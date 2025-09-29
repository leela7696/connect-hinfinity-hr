import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'completed' | 'overdue';
  dueDate: string;
  assignee?: string;
}

interface TaskCardProps {
  task: Task;
  onComplete?: (taskId: string) => void;
  onView?: (taskId: string) => void;
  className?: string;
}

export function TaskCard({ task, onComplete, onView, className }: TaskCardProps) {
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-all duration-200", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground truncate">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
                <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
              </div>
              {task.assignee && (
                <p className="text-xs text-muted-foreground mt-1">
                  Assigned to: {task.assignee}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {task.status === 'pending' && onComplete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onComplete(task.id)}
                className="h-8 px-2"
              >
                Complete
              </Button>
            )}
            {onView && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onView(task.id)}
                className="h-8 px-2"
              >
                View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}