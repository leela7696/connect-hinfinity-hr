import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Calendar, 
  FileText, 
  MessageCircle,
  BookOpen,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

export default function EmployeeDashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: "Leave Balance",
      value: "18 days",
      change: "Remaining this year",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Pending Requests",
      value: "2",
      change: "Awaiting approval",
      icon: FileText,
      color: "text-orange-600"
    },
    {
      title: "Performance Score",
      value: "4.2/5",
      change: "Above average",
      icon: TrendingUp,
      color: "text-green-600"
    },
    {
      title: "Training Progress",
      value: "75%",
      change: "3 courses completed",
      icon: BookOpen,
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    {
      type: "leave_approved",
      message: "Leave request for Dec 20-22 approved",
      time: "2 hours ago",
      status: "success"
    },
    {
      type: "training_completed",
      message: "Completed 'Workplace Safety' training",
      time: "1 day ago",
      status: "success"
    },
    {
      type: "document_requested",
      message: "Requested employment verification letter",
      time: "3 days ago",
      status: "pending"
    },
    {
      type: "performance_review",
      message: "Quarterly performance review scheduled",
      time: "1 week ago",
      status: "info"
    }
  ];

  const quickActions = [
    {
      title: "My Profile",
      description: "View and update your personal information",
      icon: User,
      action: "View Profile"
    },
    {
      title: "Request Leave",
      description: "Submit a new leave request",
      icon: Calendar,
      action: "Request Leave"
    },
    {
      title: "Document Requests",
      description: "Request official documents",
      icon: FileText,
      action: "Request Documents"
    },
    {
      title: "HR Support",
      description: "Get help from HR team",
      icon: MessageCircle,
      action: "Contact HR"
    }
  ];

  const upcomingTasks = [
    {
      title: "Complete annual security training",
      dueDate: "Dec 15, 2024",
      priority: "high",
      type: "training"
    },
    {
      title: "Submit quarterly self-assessment",
      dueDate: "Dec 20, 2024",
      priority: "medium",
      type: "review"
    },
    {
      title: "Update emergency contact information",
      dueDate: "Dec 31, 2024",
      priority: "low",
      type: "profile"
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
                <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {profile?.full_name}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Employee
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
            {/* Quick Actions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common tasks and self-service options
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

              {/* Upcoming Tasks */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Upcoming Tasks
                  </CardTitle>
                  <CardDescription>
                    Tasks and deadlines requiring your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-secondary rounded-lg">
                            {task.type === 'training' && <BookOpen className="h-4 w-4 text-primary" />}
                            {task.type === 'review' && <TrendingUp className="h-4 w-4 text-primary" />}
                            {task.type === 'profile' && <User className="h-4 w-4 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities & Profile Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Your recent actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {activity.status === 'success' && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                          {activity.status === 'pending' && (
                            <Clock className="h-5 w-5 text-orange-500" />
                          )}
                          {activity.status === 'info' && (
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Summary */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Department</span>
                      <span className="font-semibold text-foreground">{profile?.department || 'Engineering'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Position</span>
                      <span className="font-semibold text-foreground">{profile?.position || 'Software Developer'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Start Date</span>
                      <span className="font-semibold text-foreground">Jan 15, 2023</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Years of Service</span>
                      <span className="font-semibold text-foreground">1.8 years</span>
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