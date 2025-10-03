import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DocumentRequest, EligibilityCheckResult } from '@/types/documents';

export function useDocumentRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('document_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load document requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setRequests([]);
      setLoading(false);
      return;
    }

    fetchRequests();

    // Set up realtime subscription for live updates
    const channel = supabase
      .channel('document-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'document_requests',
        },
        (payload) => {
          console.log('Document request change:', payload);
          // Refetch requests on any change
          fetchRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, profile]);

  const createRequest = async (requestData: Partial<DocumentRequest>) => {
    try {
      // Get employee name from profile
      const employeeName = profile?.full_name || user?.email || 'Unknown';

      const insertData: any = {
        document_type: requestData.document_type!,
        purpose: requestData.purpose!,
        format: requestData.format || 'pdf',
        delivery_method: requestData.delivery_method || 'both',
        employee_id: user?.id,
        employee_name: employeeName,
      };

      if (requestData.period) {
        insertData.period = requestData.period;
      }
      if (requestData.status) {
        insertData.status = requestData.status;
      }

      const { data, error } = await supabase
        .from('document_requests')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Create audit log
      await supabase.from('document_audit_logs').insert({
        actor_id: user?.id,
        actor_name: employeeName,
        action: 'request_created',
        request_id: data.id,
        after_state: data,
      });

      toast({
        title: 'Request Submitted',
        description: 'Your document request has been submitted successfully',
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { data: null, error };
    }
  };

  const updateRequestStatus = async (
    requestId: string,
    status: DocumentRequest['status'],
    metadata?: { reason?: string; comment?: string }
  ) => {
    try {
      // Get the current request for audit trail
      const { data: currentRequest } = await supabase
        .from('document_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      const updateData: any = { status };
      
      if (metadata?.reason) {
        updateData.rejection_reason = metadata.reason;
      }
      if (metadata?.comment) {
        updateData.comment = metadata.comment;
      }

      // Add approval metadata if approved
      if (status === 'approved') {
        updateData.approved_by = user?.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('document_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // Create audit log
      const employeeName = profile?.full_name || user?.email || 'Unknown';
      await supabase.from('document_audit_logs').insert({
        actor_id: user?.id,
        actor_name: employeeName,
        action: `request_${status}`,
        request_id: requestId,
        before_state: currentRequest,
        after_state: { ...currentRequest, ...updateData },
      });

      toast({
        title: 'Status Updated',
        description: `Request ${status.replace('_', ' ')}`,
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error updating request:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      return { error };
    }
  };

  /**
   * Check eligibility for document request
   * In production, this should call a serverless endpoint:
   * POST /api/doc/eligibility
   * 
   * Endpoint should use Supabase service role key to:
   * - Query employee data securely
   * - Apply business rules
   * - Check tenure, employment status, confidential flags
   * - Return eligibility result
   */
  const checkEligibility = async (
    docType: DocumentRequest['document_type'],
    params?: Record<string, any>
  ): Promise<EligibilityCheckResult> => {
    // Demo implementation - in production, call API endpoint
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

    // Simple eligibility rules for demo
    const eligibilityMap: Record<string, EligibilityCheckResult> = {
      salary_slip: {
        eligible: true,
        requiresApproval: false,
        autoGenerateAvailable: true,
        estimatedTime: '2 minutes',
        prefillData: { period: 'current_month' },
      },
      experience_letter: {
        eligible: true,
        requiresApproval: true,
        reason: 'HR approval required for experience letters',
        autoGenerateAvailable: true,
        estimatedTime: '24 hours (after approval)',
      },
      employment_verification: {
        eligible: true,
        requiresApproval: true,
        reason: 'Manager/HR approval required',
        autoGenerateAvailable: true,
        estimatedTime: '24 hours',
      },
      offer_letter: {
        eligible: false,
        requiresApproval: true,
        reason: 'Offer letter already issued. Contact HR for copies.',
        autoGenerateAvailable: false,
      },
      relieving_letter: {
        eligible: true,
        requiresApproval: true,
        reason: 'HR approval required and must be in offboarding status',
        autoGenerateAvailable: true,
        estimatedTime: '48 hours',
      },
      custom: {
        eligible: true,
        requiresApproval: true,
        reason: 'Custom requests require manual review',
        autoGenerateAvailable: false,
      },
    };

    return eligibilityMap[docType] || {
      eligible: false,
      requiresApproval: true,
      reason: 'Unknown document type',
    };
  };

  return {
    requests,
    loading,
    createRequest,
    updateRequestStatus,
    checkEligibility,
  };
}
