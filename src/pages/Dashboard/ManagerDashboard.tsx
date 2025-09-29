import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageCircle,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

export default function ManagerDashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: "Team Members",
      value: "15",
      change: "All active",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Leave Requests",
      value: "4",
      change: "2 require approval",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Team Performance",
      value: "92%",
      change: "+5% this month",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Open HR Tickets",
      value: "3",
      change: "1 urgent",
      icon: MessageCircle,
      color: "text-red-600"
    }
  ];

  const teamMembers = [
    {
      name: "Alice Johnson",
      position: "Senior Developer",
      status: "active",
      performance: "excellent"
    },
    {
      name: "Bob Smith",
      position: "UI/UX Designer",
      status: "on_leave",
      performance: "good"
    },
    {
      name: "Carol Wilson",
      position: "Product Manager",
      status: "active",
      performance: "excellent"
    },
    {
      name: "David Brown",
      position: "Developer",
      status: "active",
      performance: "good"
    },
    {
      name: "Emma Davis",
      position: "QA Engineer",
      status: "active",
      performance: "excellent"
    }
  ];

  const pendingActions = [
    {
      type: "leave_request",
      title: "Review leave request from Alice Johnson",
      priority: "medium",
      dueDate: "Today"
    },
    {
      type: "performance_review",
      title: "Complete quarterly review for Bob Smith",
      priority: "high",
      dueDate: "Tomorrow"
    },
    {
      type: "team_meeting",
      title: "Schedule team standup meeting",
      priority: "low",
      dueDate: "This Week"
    },
    {
      type: "hr_ticket",
      title: "Respond to HR inquiry about team budget",
      priority: "medium",
      dueDate: "Friday"
    }
  ];

  const quickActions = [
    {
      title: "Team Management",
      description: "View and manage your team members",
      icon: Users,
      action: "View Team"
    },
    {
      title: "Leave Approvals",
      description: "Review pending leave requests",
      icon: Calendar,
      action: "Review Requests"
    },
    {
      title: "HR Inquiries",
      description: "Handle team-related HR questions",
      icon: MessageCircle,
      action: "View Tickets"
    },
    {
      title: "Document Requests",
      description: "Manage document requests for your team",
      icon: FileText,
      action: "View Requests"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manager Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {profile?.full_name}
                </p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Manager
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-secondary ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions & Pending Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common management tasks and team operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors duration-200 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <action.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground">{action.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                            <Button variant="outline" size="sm">
                              {action.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Actions */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Pending Actions
                  </CardTitle>
                  <CardDescription>
                    Tasks requiring your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingActions.map((action, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-secondary rounded-lg">
                            {action.type === 'leave_request' && <Calendar className="h-4 w-4 text-primary" />}
                            {action.type === 'performance_review' && <TrendingUp className="h-4 w-4 text-primary" />}
                            {action.type === 'team_meeting' && <Users className="h-4 w-4 text-primary" />}
                            {action.type === 'hr_ticket' && <MessageCircle className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">Due: {action.dueDate}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={action.priority === 'high' ? 'destructive' : action.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {action.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Overview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Team Overview
                  </CardTitle>
                  <CardDescription>
                    Your team members and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teamMembers.map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">{member.position}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge 
                            variant={member.status === 'active' ? 'default' : 'secondary'}
                          >
                            {member.status === 'active' ? 'Active' : 'On Leave'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {member.performance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Team Performance */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Team Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Team Productivity</span>
                      <span className="font-semibold text-foreground">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Projects Completed</span>
                      <span className="font-semibold text-foreground">18</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                      <span className="font-semibold text-foreground">4.2/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Team Satisfaction</span>
                      <span className="font-semibold text-foreground">88%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}