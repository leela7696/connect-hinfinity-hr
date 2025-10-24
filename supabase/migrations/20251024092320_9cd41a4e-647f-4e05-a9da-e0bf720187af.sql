-- Fix infinite recursion by removing circular dependencies between teams and team_members policies

-- Drop existing policies
DROP POLICY IF EXISTS "Role-based team viewing" ON public.teams;
DROP POLICY IF EXISTS "Role-based team member viewing" ON public.team_members;

-- Create simplified teams SELECT policy without team_members check
CREATE POLICY "Role-based team viewing"
  ON public.teams
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    (public.has_role(auth.uid(), 'manager') AND manager_id = auth.uid()) OR
    public.has_role(auth.uid(), 'employee')  -- Employees can see all teams initially, we filter in app
  );

-- Create simplified team_members SELECT policy without teams check
CREATE POLICY "Role-based team member viewing"
  ON public.team_members
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    public.has_role(auth.uid(), 'manager') OR  -- Managers can see all members, filtered by team in app
    employee_id = auth.uid()  -- Employees can see themselves
  );