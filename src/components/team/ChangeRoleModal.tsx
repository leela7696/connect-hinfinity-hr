import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamMember, TeamMemberRole } from '@/types/teams';

interface ChangeRoleModalProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  onSubmit: (memberId: string, newRole: TeamMemberRole) => Promise<boolean>;
}

const roles: { value: TeamMemberRole; label: string }[] = [
  { value: 'lead', label: 'Team Lead' },
  { value: 'member', label: 'Member' },
  { value: 'contributor', label: 'Contributor' },
];

export function ChangeRoleModal({ open, onClose, member, onSubmit }: ChangeRoleModalProps) {
  const [newRole, setNewRole] = useState<TeamMemberRole>(member?.role_in_team || 'member');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) return;

    setLoading(true);
    try {
      const success = await onSubmit(member.id, newRole);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Member Role</DialogTitle>
          <DialogDescription>
            Update the role for {member.employee_name} in this team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="current-role">Current Role</Label>
              <input
                id="current-role"
                type="text"
                value={roles.find(r => r.value === member.role_in_team)?.label || member.role_in_team}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-role">New Role *</Label>
              <Select value={newRole} onValueChange={(value) => setNewRole(value as TeamMemberRole)}>
                <SelectTrigger id="new-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || newRole === member.role_in_team}>
              {loading ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
