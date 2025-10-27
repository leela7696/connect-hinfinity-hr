import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import { TeamProject } from '@/types/projects';

export function useTeamProjects(teamId?: string) {
  const [projects, setProjects] = useState<TeamProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!teamId || !user) return;

    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('team_projects')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setProjects((data || []) as TeamProject[]);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      toast({
        title: 'Error',
        description: 'Failed to load projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: Partial<TeamProject>): Promise<TeamProject | null> => {
    try {
      const { data, error } = await supabase
        .from('team_projects')
        .insert({
          team_id: teamId,
          name: projectData.name!,
          description: projectData.description,
          status: projectData.status || 'planning',
          priority: projectData.priority || 'medium',
          start_date: projectData.start_date,
          end_date: projectData.end_date,
          completion_percentage: projectData.completion_percentage || 0,
          assigned_members: projectData.assigned_members || [],
          tags: projectData.tags || [],
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project created successfully',
      });

      await fetchProjects();
      return data as TeamProject;
    } catch (err: any) {
      console.error('Error creating project:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateProject = async (projectId: string, updates: Partial<TeamProject>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('team_projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });

      await fetchProjects();
      return true;
    } catch (err: any) {
      console.error('Error updating project:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('team_projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });

      await fetchProjects();
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (teamId && user) {
      fetchProjects();
    }
  }, [teamId, user]);

  // Realtime subscription
  useEffect(() => {
    if (!teamId || !user) return;

    const channel = supabase
      .channel('team-projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'team_projects',
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [teamId, user]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
