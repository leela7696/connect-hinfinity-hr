import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamMember } from '@/types/teams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TransferMemberModalProps {
  open: boolean;
  onClose: () => void;
  member: TeamMember | null;
  currentTeamId: string;
  onSubmit: (memberId: string, newTeamId: string, reason: string) => Promise<boolean>;
}

interface Team {
  id: string;
  name: string;
  department: string;
}

export function TransferMemberModal({ 
  open, 
  onClose, 
  member, 
  currentTeamId,
  onSubmit 
}: TransferMemberModalProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTeams, setFetchingTeams] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAvailableTeams();
    }
  }, [open, currentTeamId]);

  const fetchAvailableTeams = async () => {
    try {
      setFetchingTeams(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, department')
        .eq('is_active', true)
        .neq('id', currentTeamId)
        .order('name');

      if (error) throw error;
      setTeams(data || []);
    } catch (error: any) {
      console.error('Error fetching teams:', error);
      toast({
        title: 'Error',
        description: 'Failed to load teams',
        variant: 'destructive',
      });
    } finally {
      setFetchingTeams(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !selectedTeam) return;

    if (!reason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for the transfer',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const success = await onSubmit(member.id, selectedTeam, reason);
      if (success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTeam('');
    setReason('');
    onClose();
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Team Member</DialogTitle>
          <DialogDescription>
            Transfer {member.employee_name} to another team. This action requires HR approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team">New Team *</Label>
              {fetchingTeams ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : teams.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No other active teams available
                </p>
              ) : (
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger id="team">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex flex-col">
                          <span>{team.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {team.department}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for Transfer *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain why this member is being transferred..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedTeam || !reason.trim() || fetchingTeams}
            >
              {loading ? 'Transferring...' : 'Transfer Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
