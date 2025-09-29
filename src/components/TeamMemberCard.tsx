import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone?: string;
  avatar?: string;
  status: 'active' | 'on_leave' | 'inactive';
  performance?: 'excellent' | 'good' | 'average' | 'needs_improvement';
}

interface TeamMemberCardProps {
  member: TeamMember;
  showActions?: boolean;
  className?: string;
  onContact?: (member: TeamMember) => void;
  onViewProfile?: (member: TeamMember) => void;
}

export function TeamMemberCard({ 
  member, 
  showActions = false, 
  className,
  onContact,
  onViewProfile 
}: TeamMemberCardProps) {
  const getStatusColor = (status: TeamMember['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on_leave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPerformanceColor = (performance?: TeamMember['performance']) => {
    switch (performance) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'average':
        return 'text-yellow-600';
      case 'needs_improvement':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {getInitials(member.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position}</p>
                <p className="text-xs text-muted-foreground">{member.department}</p>
              </div>
              
              {showActions && (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <Badge 
                variant="outline" 
                className={cn("text-xs", getStatusColor(member.status))}
              >
                {member.status.replace('_', ' ')}
              </Badge>
              
              {member.performance && (
                <span className={cn("text-xs font-medium", getPerformanceColor(member.performance))}>
                  {member.performance}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                onClick={() => onContact?.(member)}
              >
                <Mail className="h-3 w-3" />
                <span>Email</span>
              </Button>
              
              {member.phone && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Phone className="h-3 w-3" />
                  <span>Call</span>
                </Button>
              )}
              
              {showActions && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onViewProfile?.(member)}
                >
                  View Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}