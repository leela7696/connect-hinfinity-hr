import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { TeamProject } from '@/types/projects';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: TeamProject;
  canEdit: boolean;
  onDelete?: (projectId: string) => void;
}

export function ProjectCard({ project, canEdit, onDelete }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'default';
      case 'planning': return 'secondary';
      case 'on_hold': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{project.name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">
              {project.description || 'No description'}
            </CardDescription>
          </div>
          {canEdit && onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
            <Badge variant={getPriorityColor(project.priority)}>
              {project.priority}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.completion_percentage}%</span>
            </div>
            <Progress value={project.completion_percentage} className="h-2" />
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            {project.start_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Start: {format(new Date(project.start_date), 'MMM dd, yyyy')}</span>
              </div>
            )}
            {project.end_date && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>End: {format(new Date(project.end_date), 'MMM dd, yyyy')}</span>
              </div>
            )}
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
