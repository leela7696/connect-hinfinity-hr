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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamMember, TeamMemberRole } from '@/types/teams';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  teamId: string;
  onSubmit: (member: Partial<TeamMember>) => Promise<boolean>;
}

interface Employee {
  user_id: string;
  full_name: string;
  department: string | null;
  position: string | null;
}

const roles: { value: TeamMemberRole; label: string }[] = [
  { value: 'lead', label: 'Team Lead' },
  { value: 'member', label: 'Member' },
  { value: 'contributor', label: 'Contributor' },
];

export function AddMemberModal({ open, onClose, teamId, onSubmit }: AddMemberModalProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [role, setRole] = useState<TeamMemberRole>('member');
  const [loading, setLoading] = useState(false);
  const [fetchingEmployees, setFetchingEmployees] = useState(true);

  useEffect(() => {
    if (open) {
      fetchAvailableEmployees();
    }
  }, [open, teamId]);

  const fetchAvailableEmployees = async () => {
    try {
      setFetchingEmployees(true);

      // Fetch all employees
      const { data: allEmployees, error: employeesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, department, position')
        .order('full_name');

      if (employeesError) throw employeesError;

      // Fetch current team members to exclude them
      const { data: teamMembers, error: membersError } = await supabase
        .from('team_members')
        .select('employee_id')
        .eq('team_id', teamId)
        .eq('status', 'active');

      if (membersError) throw membersError;

      const memberIds = new Set(teamMembers?.map(m => m.employee_id) || []);
      const available = (allEmployees || []).filter(
        emp => !memberIds.has(emp.user_id)
      );

      setEmployees(available);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to load employees',
        variant: 'destructive',
      });
    } finally {
      setFetchingEmployees(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedEmployee) {
      toast({
        title: 'Error',
        description: 'Please select an employee',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const success = await onSubmit({
        team_id: teamId,
        employee_id: selectedEmployee,
        role_in_team: role,
        status: 'active',
        is_primary: true,
      });

      if (success) {
        handleClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployee('');
    setRole('member');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
          <DialogDescription>
            Select an employee and assign their role in the team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee *</Label>
              {fetchingEmployees ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : employees.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No available employees to add
                </p>
              ) : (
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.user_id} value={emp.user_id}>
                        <div className="flex flex-col">
                          <span>{emp.full_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {emp.position || 'No position'} • {emp.department || 'No department'}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role in Team *</Label>
              <Select value={role} onValueChange={(value) => setRole(value as TeamMemberRole)}>
                <SelectTrigger id="role">
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !selectedEmployee || fetchingEmployees}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
