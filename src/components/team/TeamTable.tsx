import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Edit, UserX } from 'lucide-react';
import { Team } from '@/types/teams';
import { Link } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';

interface TeamTableProps {
  teams: Team[];
  onEdit?: (team: Team) => void;
  onDeactivate?: (teamId: string) => void;
}

export function TeamTable({ teams, onEdit, onDeactivate }: TeamTableProps) {
  const { canManageTeam, role } = usePermissions();

  if (teams.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No teams found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-muted/50">
            <TableHead>Team Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team) => {
            const isManager = canManageTeam(team.manager_id);
            const canEdit = role === 'admin' || role === 'hr' || isManager;

            return (
              <TableRow key={team.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">
                  <Link to={`/teams/${team.id}`} className="hover:underline">
                    {team.name}
                  </Link>
                </TableCell>
                <TableCell>{team.department}</TableCell>
                <TableCell>{team.manager_name || 'Unassigned'}</TableCell>
                <TableCell>{team.member_count || 0}</TableCell>
                <TableCell>
                  <Badge variant={team.is_active ? 'default' : 'secondary'}>
                    {team.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link to={`/teams/${team.id}`} className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      {canEdit && onEdit && (
                        <>
                          <DropdownMenuItem onClick={() => onEdit(team)} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit Team
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {(role === 'admin' || role === 'hr') && onDeactivate && team.is_active && (
                        <DropdownMenuItem
                          onClick={() => onDeactivate(team.id)}
                          className="text-destructive flex items-center gap-2"
                        >
                          <UserX className="h-4 w-4" />
                          Deactivate Team
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
