import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Tag } from 'lucide-react';
import { Team } from '@/types/teams';
import { Link } from 'react-router-dom';

interface TeamCardProps {
  team: Team;
  onEdit?: (team: Team) => void;
  onViewDetails?: (teamId: string) => void;
}

export function TeamCard({ team, onEdit, onViewDetails }: TeamCardProps) {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{team.name}</CardTitle>
            <CardDescription className="line-clamp-2">{team.description}</CardDescription>
          </div>
          <Badge variant={team.is_active ? 'default' : 'secondary'}>
            {team.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{team.department}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>
              {team.member_count || 0} members · {team.manager_name || 'No manager'}
            </span>
          </div>

          {team.tags && team.tags.length > 0 && (
            <div className="flex items-start gap-2">
              <Tag className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex flex-wrap gap-1">
                {team.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-3 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <Link to={`/teams/${team.id}`}>View Details</Link>
            </Button>
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(team)}>
                Edit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
