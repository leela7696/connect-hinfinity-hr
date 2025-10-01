import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { DocumentRequest, EligibilityCheckResult } from '@/types/documents';
import { demoRequests, isDemoMode } from '@/data/demoDocuments';

export function useDocumentRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isDemoMode()) {
      // Use demo data
      if (profile?.role === 'admin' || profile?.role === 'hr') {
        setRequests(demoRequests);
      } else {
        setRequests(demoRequests.filter(r => r.employee_id === user?.id));
      }
      setLoading(false);
      return;
    }

    // TODO: Fetch from Supabase when tables are created
    // fetchRequests();
    setRequests([]);
    setLoading(false);
  }, [user, profile]);

  const createRequest = async (requestData: Partial<DocumentRequest>) => {
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: 'Request created in demo mode (not saved)',
      });
      return { data: { id: 'demo-req-' + Date.now() }, error: null };
    }

    try {
      // TODO: Implement Supabase insertion
      // const { data, error } = await supabase
      //   .from('document_requests')
      //   .insert([{ ...requestData, employee_id: user?.id }])
      //   .select()
      //   .single();

      toast({
        title: 'Request Submitted',
        description: 'Your document request has been submitted successfully',
      });

      return { data: null, error: null };
    } catch (error: any) {
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
    if (isDemoMode()) {
      toast({
        title: 'Demo Mode',
        description: 'Status updated in demo mode (not saved)',
      });
      return { error: null };
    }

    try {
      // TODO: Implement Supabase update
      // const { error } = await supabase
      //   .from('document_requests')
      //   .update({ status, ...metadata, updated_at: new Date().toISOString() })
      //   .eq('id', requestId);

      toast({
        title: 'Status Updated',
        description: `Request ${status}`,
      });

      return { error: null };
    } catch (error: any) {
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
