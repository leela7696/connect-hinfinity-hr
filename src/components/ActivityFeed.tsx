import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'success' | 'warning' | 'info' | 'pending';
  message: string;
  time: string;
  details?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  className?: string;
}

export function ActivityFeed({ activities, title = "Recent Activities", className }: ActivityFeedProps) {
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (type: Activity['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'warning':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'pending':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'info':
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>
          Latest updates and notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent activities</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div 
                key={activity.id}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
                  getStatusColor(activity.type)
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  {activity.details && (
                    <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                    <Badge 
                      variant="secondary" 
                      className={cn("text-xs capitalize", {
                        'bg-green-100 text-green-800': activity.type === 'success',
                        'bg-orange-100 text-orange-800': activity.type === 'warning',
                        'bg-blue-100 text-blue-800': activity.type === 'pending',
                        'bg-gray-100 text-gray-800': activity.type === 'info',
                      })}
                    >
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}