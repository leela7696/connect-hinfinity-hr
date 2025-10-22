import { useState } from 'react';
import { Plus, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamCard } from '@/components/team/TeamCard';
import { TeamTable } from '@/components/team/TeamTable';
import { TeamFilters } from '@/components/team/TeamFilters';
import { CreateTeamModal } from '@/components/team/CreateTeamModal';
import { useTeams } from '@/hooks/useTeams';
import { usePermissions } from '@/hooks/usePermissions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function TeamsDirectory() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  const [managers, setManagers] = useState<Array<{ user_id: string; full_name: string }>>([]);
  
  const { teams, loading, createTeam, updateTeam, deleteTeam } = useTeams(filters);
  const { hasPermission, role } = usePermissions();
  const { user } = useAuth();

  const canCreateTeam = hasPermission('create', 'team');

  // Fetch managers for the dropdown
  useState(() => {
    const fetchManagers = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('user_id, full_name')
        .in('role', ['admin', 'hr', 'manager']);
      
      if (data) {
        setManagers(data);
      }
    };
    fetchManagers();
  });

  const handleCreateTeam = async (teamData: any) => {
    await createTeam(teamData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Teams Directory</h1>
              <p className="text-muted-foreground mt-1">
                Manage and view all teams across the organization
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {canCreateTeam && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              )}
              
              <div className="flex rounded-lg border border-border/50 p-1 bg-card/50">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <TeamFilters onFilterChange={setFilters} />

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={hasPermission('update', 'team') ? (team) => {
                    // Handle edit - you could open a modal here
                    console.log('Edit team:', team);
                  } : undefined}
                />
              ))}
            </div>
          ) : (
            <TeamTable
              teams={teams}
              onEdit={hasPermission('update', 'team') ? (team) => {
                console.log('Edit team:', team);
              } : undefined}
              onDeactivate={hasPermission('delete', 'team') ? deleteTeam : undefined}
            />
          )}

          {!loading && teams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No teams found</p>
              {canCreateTeam && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Team
                </Button>
              )}
            </div>
          )}
        </div>
      </main>

      <CreateTeamModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
        managers={managers}
      />
    </div>
  );
}
