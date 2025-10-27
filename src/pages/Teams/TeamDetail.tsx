import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, AlertCircle, CheckCircle2, UserPlus, Plus } from 'lucide-react';
import { useTeams } from '@/hooks/useTeams';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { useTeamProjects } from '@/hooks/useTeamProjects';
import { useTeamActivity } from '@/hooks/useTeamActivity';
import { usePermissions } from '@/hooks/usePermissions';
import { TeamMetrics, TeamMember, TeamMemberRole } from '@/types/teams';
import { AddMemberModal } from '@/components/team/AddMemberModal';
import { MemberActionsMenu } from '@/components/team/MemberActionsMenu';
import { ChangeRoleModal } from '@/components/team/ChangeRoleModal';
import { TransferMemberModal } from '@/components/team/TransferMemberModal';
import { CreateProjectModal } from '@/components/team/CreateProjectModal';
import { ProjectCard } from '@/components/team/ProjectCard';
import { format } from 'date-fns';

export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const { teams } = useTeams();
  const { members, loading: membersLoading, addMember, updateMember, removeMember, transferMember } = useTeamMembers(teamId);
  const { projects, loading: projectsLoading, createProject, deleteProject } = useTeamProjects(teamId);
  const { activities, loading: activitiesLoading } = useTeamActivity(teamId);
  const { canManageTeam, role } = usePermissions();
  const [metrics, setMetrics] = useState<TeamMetrics | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  const team = teams.find(t => t.id === teamId);
  const canEdit = role === 'admin' || role === 'hr' || (team && canManageTeam(team.manager_id));

  useEffect(() => {
    // CALL SERVERLESS: POST /api/team/metrics
    // { tenant_id, team_id: teamId, range: '30d' }
    // For now, using mock data
    if (teamId) {
      setMetrics({
        team_id: teamId,
        member_count: members.length,
        avg_attendance: 94.5,
        task_completion: 87.2,
        open_tickets: 12,
        period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        period_end: new Date().toISOString(),
      });
    }
  }, [teamId, members]);

  if (!team) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Team not found</h2>
            <p className="text-muted-foreground mt-2">The team you're looking for doesn't exist.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{team.name}</h1>
                <Badge variant={team.is_active ? 'default' : 'secondary'}>
                  {team.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <p className="text-muted-foreground">{team.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span>Department: {team.department}</span>
                <span>Manager: {team.manager_name}</span>
              </div>
            </div>
            
            {canEdit && (
              <Button onClick={() => setShowAddMember(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>

          {/* KPI Cards */}
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">{metrics.member_count}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-2xl font-bold">{metrics.avg_attendance}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Task Completion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span className="text-2xl font-bold">{metrics.task_completion}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Open Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <span className="text-2xl font-bold">{metrics.open_tickets}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tabs */}
          <Tabs defaultValue="members" className="space-y-4">
            <TabsList>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    {members.length} member{members.length !== 1 ? 's' : ''} in this team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {membersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : members.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No members yet</p>
                  ) : (
                    <div className="space-y-3">
                      {members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{member.employee_name || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">{member.employee_email || 'No email'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{member.role_in_team}</Badge>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                              {member.status}
                            </Badge>
                            <MemberActionsMenu
                              member={member}
                              canEdit={canEdit}
                              onChangeRole={(id) => {
                                setSelectedMember(member);
                                setShowChangeRole(true);
                              }}
                              onTransfer={(id) => {
                                setSelectedMember(member);
                                setShowTransfer(true);
                              }}
                              onRemove={removeMember}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Projects</CardTitle>
                      <CardDescription>Projects assigned to this team</CardDescription>
                    </div>
                    {canEdit && (
                      <Button onClick={() => setShowCreateProject(true)} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {projectsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : projects.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No projects yet. Create your first project to get started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          canEdit={canEdit}
                          onDelete={deleteProject}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Recent team activities and changes</CardDescription>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : activities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No recent activity
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                            <AlertCircle className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{activity.actor_name}</p>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {activity.resource_type}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(activity.created_at), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Modals */}
      {teamId && (
        <>
          <AddMemberModal
            open={showAddMember}
            onClose={() => setShowAddMember(false)}
            teamId={teamId}
            onSubmit={addMember}
          />
          
          <ChangeRoleModal
            open={showChangeRole}
            onClose={() => {
              setShowChangeRole(false);
              setSelectedMember(null);
            }}
            member={selectedMember}
            onSubmit={async (memberId, newRole) => {
              return await updateMember(memberId, { role_in_team: newRole });
            }}
          />
          
          <TransferMemberModal
            open={showTransfer}
            onClose={() => {
              setShowTransfer(false);
              setSelectedMember(null);
            }}
            member={selectedMember}
            currentTeamId={teamId}
            onSubmit={transferMember}
          />

          <CreateProjectModal
            open={showCreateProject}
            onClose={() => setShowCreateProject(false)}
            onSubmit={createProject}
          />
        </>
      )}
    </div>
  );
}
