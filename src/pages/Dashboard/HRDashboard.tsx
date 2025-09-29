import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  FileText, 
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

export default function HRDashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: "Total Employees",
      value: "247",
      change: "+12 this month",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Pending Onboarding",
      value: "8",
      change: "5 due this week",
      icon: UserPlus,
      color: "text-orange-600"
    },
    {
      title: "Leave Requests",
      value: "23",
      change: "15 pending approval",
      icon: Calendar,
      color: "text-green-600"
    },
    {
      title: "Open Tickets",
      value: "12",
      change: "3 high priority",
      icon: MessageCircle,
      color: "text-red-600"
    }
  ];

  const recentTasks = [
    {
      title: "Review leave request - Sarah Johnson",
      department: "Marketing",
      priority: "high",
      dueDate: "Today"
    },
    {
      title: "Complete onboarding for new hire",
      department: "Engineering",
      priority: "medium",
      dueDate: "Tomorrow"
    },
    {
      title: "Update employee handbook",
      department: "All Departments",
      priority: "low",
      dueDate: "Next Week"
    },
    {
      title: "Conduct performance review",
      department: "Sales",
      priority: "medium",
      dueDate: "Friday"
    }
  ];

  const quickActions = [
    {
      title: "Employee Management",
      description: "Add, edit, and manage employee profiles",
      icon: Users,
      action: "Manage Employees"
    },
    {
      title: "Leave Management",
      description: "Review and approve leave requests",
      icon: Calendar,
      action: "Review Requests"
    },
    {
      title: "Document Requests",
      description: "Handle employee document requests",
      icon: FileText,
      action: "View Requests"
    },
    {
      title: "HR Inquiries",
      description: "Respond to employee questions",
      icon: MessageCircle,
      action: "View Tickets"
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
                <h1 className="text-3xl font-bold text-foreground">HR Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {profile?.full_name}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                HR Representative
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
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common HR tasks and employee management actions
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

              {/* Recent Tasks */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Pending Tasks
                  </CardTitle>
                  <CardDescription>
                    Tasks requiring your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentTasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">{task.department}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge 
                            variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {task.priority}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{task.dueDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Employee Summary */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2" />
                    Employee Summary
                  </CardTitle>
                  <CardDescription>
                    Overview of employee status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Active Employees</span>
                      <span className="font-semibold text-foreground">239</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">On Leave</span>
                      <span className="font-semibold text-foreground">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">New Hires (30 days)</span>
                      <span className="font-semibold text-foreground">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pending Onboarding</span>
                      <span className="font-semibold text-foreground">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
                      <div>
                        <p className="text-sm text-foreground">Leave request approved</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-4 w-4 text-orange-500 mt-1" />
                      <div>
                        <p className="text-sm text-foreground">New employee onboarding</p>
                        <p className="text-xs text-muted-foreground">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-1" />
                      <div>
                        <p className="text-sm text-foreground">Document request completed</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
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