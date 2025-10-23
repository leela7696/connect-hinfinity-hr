import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, UserX, ArrowRightLeft } from 'lucide-react';
import { TeamMember } from '@/types/teams';

interface MemberActionsMenuProps {
  member: TeamMember;
  onChangeRole?: (memberId: string) => void;
  onTransfer?: (memberId: string) => void;
  onRemove?: (memberId: string) => void;
  canEdit: boolean;
}

export function MemberActionsMenu({
  member,
  onChangeRole,
  onTransfer,
  onRemove,
  canEdit,
}: MemberActionsMenuProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRemove = () => {
    if (onRemove) {
      onRemove(member.id);
    }
    setShowRemoveDialog(false);
  };

  if (!canEdit) {
    return null;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          
          {onChangeRole && (
            <DropdownMenuItem onClick={() => onChangeRole(member.id)} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Change Role
            </DropdownMenuItem>
          )}
          
          {onTransfer && (
            <DropdownMenuItem onClick={() => onTransfer(member.id)} className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              Transfer to Another Team
            </DropdownMenuItem>
          )}
          
          {onRemove && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowRemoveDialog(true)}
                className="text-destructive flex items-center gap-2"
              >
                <UserX className="h-4 w-4" />
                Remove from Team
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {member.employee_name} from this team? 
              This action will mark them as inactive but won't delete their records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
