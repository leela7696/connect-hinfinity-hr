import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { TeamActivityLog } from '@/types/projects';

export function useTeamActivity(teamId?: string) {
  const [activities, setActivities] = useState<TeamActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchActivities = async () => {
    if (!teamId || !user) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('team_activity_log')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setActivities((data || []) as TeamActivityLog[]);
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    action: string,
    resourceType: 'team' | 'member' | 'project' | 'setting',
    description: string,
    resourceId?: string,
    metadata?: any
  ): Promise<boolean> => {
    if (!teamId || !user) return false;

    try {
      const { error } = await supabase
        .from('team_activity_log')
        .insert({
          team_id: teamId,
          actor_id: user.id,
          actor_name: profile?.full_name || user.email || 'Unknown',
          action,
          resource_type: resourceType,
          resource_id: resourceId,
          description,
          metadata: metadata || {},
        });

      if (error) throw error;

      await fetchActivities();
      return true;
    } catch (err: any) {
      console.error('Error logging activity:', err);
      return false;
    }
  };

  useEffect(() => {
    if (teamId && user) {
      fetchActivities();
    }
  }, [teamId, user]);

  // Realtime subscription
  useEffect(() => {
    if (!teamId || !user) return;

    const channel = supabase
      .channel('team-activity-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_activity_log',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          fetchActivities();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, user]);

  return {
    activities,
    loading,
    error,
    fetchActivities,
    logActivity,
  };
}
