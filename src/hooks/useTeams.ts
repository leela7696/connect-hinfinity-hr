import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { Team } from '@/types/teams';

export function useTeams(filters?: {
  department?: string;
  is_active?: boolean;
  manager_id?: string;
  search?: string;
  tags?: string[];
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query
      let query = supabase
        .from('teams')
        .select(`
          *,
          manager:profiles!teams_manager_id_fkey (
            full_name,
            user_id
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.department) {
        query = query.eq('department', filters.department);
      }
      if (filters?.is_active !== undefined) {
        query = query.eq('is_active', filters.is_active);
      }
      if (filters?.manager_id) {
        query = query.eq('manager_id', filters.manager_id);
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Transform data
      let transformedTeams = (data || []).map(team => ({
        ...team,
        manager_name: (team.manager as any)?.full_name,
        manager_email: (team.manager as any)?.user_id,
      }));

      // For employees, filter to only show teams they belong to
      if (profile?.role === 'employee' && user?.id) {
        const { data: membershipData } = await supabase
          .from('team_members')
          .select('team_id')
          .eq('employee_id', user.id)
          .eq('status', 'active');

        const teamIds = new Set(membershipData?.map(m => m.team_id) || []);
        transformedTeams = transformedTeams.filter(team => teamIds.has(team.id));
      }

      setTeams(transformedTeams as Team[]);
    } catch (err: any) {
      console.error('Error fetching teams:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (teamData: Partial<Team>): Promise<Team | null> => {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          name: teamData.name!,
          slug: teamData.name?.toLowerCase().replace(/\s+/g, '-') || '',
          department: teamData.department!,
          manager_id: teamData.manager_id!,
          description: teamData.description || '',
          tags: teamData.tags || [],
          is_active: teamData.is_active ?? true,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Team created successfully',
      });

      // CALL SERVERLESS: POST /api/audit/record to log team creation
      // { actorId: user.id, action: 'create', resourceType: 'team', resourceId: data.id, after: data }

      await fetchTeams();
      return data;
    } catch (err: any) {
      console.error('Error creating team:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTeam = async (teamId: string, updates: Partial<Team>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', teamId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Team updated successfully',
      });

      // CALL SERVERLESS: POST /api/audit/record to log team update
      // { actorId: user.id, action: 'update', resourceType: 'team', resourceId: teamId, before: oldData, after: updates }

      await fetchTeams();
      return true;
    } catch (err: any) {
      console.error('Error updating team:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteTeam = async (teamId: string): Promise<boolean> => {
    try {
      // Soft delete
      const { error } = await supabase
        .from('teams')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', teamId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Team deactivated successfully',
      });

      // CALL SERVERLESS: POST /api/audit/record to log team deletion
      await fetchTeams();
      return true;
    } catch (err: any) {
      console.error('Error deleting team:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const assignManager = async (teamId: string, newManagerId: string): Promise<boolean> => {
    try {
      // Client-side update for basic info
      const { error } = await supabase
        .from('teams')
        .update({ manager_id: newManagerId, updated_at: new Date().toISOString() })
        .eq('id', teamId);

      if (error) throw error;

      // CALL SERVERLESS: POST /api/team/update-manager { teamId, newManagerId }
      // This endpoint will:
      // 1. Update user_roles metadata if needed (requires SERVICE_ROLE_KEY)
      // 2. Send notification to new manager
      // 3. Log audit entry

      toast({
        title: 'Success',
        description: 'Manager assigned successfully',
      });

      await fetchTeams();
      return true;
    } catch (err: any) {
      console.error('Error assigning manager:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user, JSON.stringify(filters)]);

  // Realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('teams-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'teams',
        },
        () => {
          fetchTeams();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    teams,
    loading,
    error,
    fetchTeams,
    createTeam,
    updateTeam,
    deleteTeam,
    assignManager,
  };
}
