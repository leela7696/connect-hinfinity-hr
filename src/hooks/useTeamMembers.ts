import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { TeamMember, BulkImportRequest, BulkImportResult } from '@/types/teams';

export function useTeamMembers(teamId?: string) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMembers = async () => {
    if (!teamId) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('team_members')
        .select(`
          *,
          profiles:employee_id (
            full_name,
            avatar_url,
            user_id
          )
        `)
        .eq('team_id', teamId)
        .order('joined_on', { ascending: false });

      if (fetchError) throw fetchError;

      const transformedMembers = (data || []).map(member => ({
        ...member,
        employee_name: member.profiles?.full_name,
        employee_email: member.profiles?.user_id,
        employee_avatar: member.profiles?.avatar_url,
      }));

      setMembers(transformedMembers);
    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData: Partial<TeamMember>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('team_members')
        .insert({
          ...memberData,
          joined_on: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member added successfully',
      });

      // CALL SERVERLESS: POST /api/notify to notify member and manager
      await fetchMembers();
      return true;
    } catch (err: any) {
      console.error('Error adding member:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const updateMember = async (memberId: string, updates: Partial<TeamMember>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('team_members')
        .update(updates)
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });

      await fetchMembers();
      return true;
    } catch (err: any) {
      console.error('Error updating member:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeMember = async (memberId: string): Promise<boolean> => {
    try {
      // Soft remove - mark as inactive
      const { error } = await supabase
        .from('team_members')
        .update({ status: 'inactive' })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member removed from team',
      });

      await fetchMembers();
      return true;
    } catch (err: any) {
      console.error('Error removing member:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const transferMember = async (
    memberId: string,
    newTeamId: string,
    reason: string
  ): Promise<boolean> => {
    try {
      // CALL SERVERLESS: POST /api/team/transfer-member
      // { tenant_id, member_id: memberId, new_team_id: newTeamId, reason, initiated_by: user.id }
      // This endpoint will:
      // 1. Validate permissions
      // 2. Create transfer log
      // 3. Update team_members record
      // 4. Notify HR & new manager

      console.log('Transfer member serverless call needed:', {
        memberId,
        newTeamId,
        reason,
        initiatedBy: user?.id,
      });

      toast({
        title: 'Transfer Initiated',
        description: 'Member transfer request has been submitted',
      });

      return true;
    } catch (err: any) {
      console.error('Error transferring member:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const bulkImport = async (importRequest: BulkImportRequest): Promise<BulkImportResult> => {
    try {
      // CALL SERVERLESS: POST /api/team/bulk-import
      // Input: { tenant_id, csvFileUrl, mapping, dryRun }
      // Behavior: Validate rows, return validation report; if dryRun=false, create team_members
      // Security: Must validate caller role (HR/Admin) using SERVICE_ROLE_KEY

      console.log('Bulk import serverless call needed:', importRequest);

      // Mock response for demo
      return {
        success: true,
        processed: 10,
        created: importRequest.dryRun ? 0 : 10,
        errors: [],
      };
    } catch (err: any) {
      console.error('Error bulk importing:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return {
        success: false,
        processed: 0,
        errors: [{ row: 0, error: err.message }],
      };
    }
  };

  useEffect(() => {
    if (teamId && user) {
      fetchMembers();
    }
  }, [teamId, user]);

  // Realtime subscription
  useEffect(() => {
    if (!teamId || !user) return;

    const channel = supabase
      .channel(`team-members-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_members',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          fetchMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, user]);

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    removeMember,
    transferMember,
    bulkImport,
  };
}
