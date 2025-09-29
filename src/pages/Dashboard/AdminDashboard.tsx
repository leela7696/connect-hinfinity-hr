import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/StatsCard';
import { QuickActionCard } from '@/components/QuickActionCard';
import { ActivityFeed } from '@/components/ActivityFeed';
import { MetricsOverview } from '@/components/MetricsOverview';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Shield, 
  Clock,
  FileText,
  Settings,
  BarChart3,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';

export default function AdminDashboard() {
  const { profile } = useAuth();

  const stats = [
    {
      title: "Total Employees",
      value: "247",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: "189",
      change: "+8%",
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "System Performance",
      value: "99.9%",
      change: "Stable",
      icon: TrendingUp,
      color: "text-purple-600"
    },
    {
      title: "Security Alerts",
      value: "3",
      change: "Low Risk",
      icon: Shield,
      color: "text-orange-600"
    }
  ];

  const recentActivities = [
    {
      id: "1",
      type: "success" as const,
      message: "New user John Smith registered",
      time: "2 minutes ago",
      details: "Employee onboarding completed successfully"
    },
    {
      id: "2", 
      type: "success" as const,
      message: "System backup completed successfully",
      time: "1 hour ago",
      details: "All data backed up to secure storage"
    },
    {
      id: "3",
      type: "warning" as const,
      message: "Failed login attempts detected",
      time: "3 hours ago", 
      details: "Multiple failed attempts from IP 192.168.1.100"
    },
    {
      id: "4",
      type: "info" as const,
      message: "Scheduled maintenance completed",
      time: "1 day ago",
      details: "System performance optimizations applied"
    }
  ];

  const systemMetrics = [
    {
      label: "CPU Usage",
      value: 65,
      target: 100,
      trend: "stable" as const,
      format: "percentage" as const,
      change: 2
    },
    {
      label: "Memory Usage", 
      value: 78,
      target: 100,
      trend: "up" as const,
      format: "percentage" as const,
      change: 5
    },
    {
      label: "Storage Used",
      value: 2100,
      target: 5000,
      trend: "up" as const,
      format: "number" as const,
      change: 150
    },
    {
      label: "Active Sessions",
      value: 189,
      target: 250,
      trend: "stable" as const,
      format: "number" as const,
      change: -3
    }
  ];

  const quickActions = [
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: Users,
      action: "View Users"
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      action: "Open Settings"
    },
    {
      title: "Analytics",
      description: "View detailed system analytics",
      icon: BarChart3,
      action: "View Analytics"
    },
    {
      title: "Audit Logs",
      description: "Review system audit trails",
      icon: FileText,
      action: "View Logs"
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
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Welcome back, {profile?.full_name}
                </p>
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Administrator
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                title={stat.title}
                value={stat.value}
                change={stat.change}
                icon={stat.icon}
                color={stat.color}
                className="animate-fade-in"
              />
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks and system management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <QuickActionCard
                        key={index}
                        title={action.title}
                        description={action.description}
                        icon={action.icon}
                        action={action.action}
                        className="animate-fade-in"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Metrics */}
              <MetricsOverview 
                title="System Performance" 
                metrics={systemMetrics}
                className="animate-fade-in"
              />
            </div>

            {/* Recent Activities */}
            <div>
              <ActivityFeed 
                activities={recentActivities}
                title="System Activities"
                className="animate-fade-in"
              />
            </div>
          </div>

          {/* System Health */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  System Health Overview
                </CardTitle>
                <CardDescription>
                  Monitor key system metrics and performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
                    <div className="text-sm text-muted-foreground">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">156ms</div>
                    <div className="text-sm text-muted-foreground">Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">2.1GB</div>
                    <div className="text-sm text-muted-foreground">Storage Used</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}