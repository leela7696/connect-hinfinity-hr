-- Fix RLS policies for teams table to be more permissive for testing
-- Drop existing policies
DROP POLICY IF EXISTS "HR and Admin can create teams" ON public.teams;
DROP POLICY IF EXISTS "HR and Admin can update all teams" ON public.teams;
DROP POLICY IF EXISTS "HR and Admin can delete teams" ON public.teams;
DROP POLICY IF EXISTS "Managers can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Everyone can view active teams" ON public.teams;

-- Create new, more permissive policies
-- Allow authenticated users to view all teams (active or not)
CREATE POLICY "Authenticated users can view all teams"
ON public.teams
FOR SELECT
TO authenticated
USING (true);

-- Allow HR, Admin, and Manager roles to create teams
CREATE POLICY "HR, Admin, and Managers can create teams"
ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (
  get_user_role(auth.uid()) IN ('hr', 'admin', 'manager')
);

-- Allow HR and Admin to update any team, Managers can update their own teams
CREATE POLICY "HR and Admin can update teams"
ON public.teams
FOR UPDATE
TO authenticated
USING (
  get_user_role(auth.uid()) IN ('hr', 'admin') 
  OR (get_user_role(auth.uid()) = 'manager' AND auth.uid() = manager_id)
);

-- Allow HR and Admin to delete teams
CREATE POLICY "HR and Admin can delete teams"
ON public.teams
FOR DELETE
TO authenticated
USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

-- Fix RLS policies for team_members table
DROP POLICY IF EXISTS "HR and Admin can add members" ON public.team_members;
DROP POLICY IF EXISTS "Managers can add members to their teams" ON public.team_members;
DROP POLICY IF EXISTS "HR and Admin can update members" ON public.team_members;
DROP POLICY IF EXISTS "Managers can update members in their teams" ON public.team_members;
DROP POLICY IF EXISTS "Everyone can view team members" ON public.team_members;

-- Create new policies for team_members
-- Everyone can view team members
CREATE POLICY "All authenticated users can view team members"
ON public.team_members
FOR SELECT
TO authenticated
USING (true);

-- HR and Admin can add members to any team
CREATE POLICY "HR and Admin can add team members"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (get_user_role(auth.uid()) IN ('hr', 'admin'));

-- Managers can add members to their teams
CREATE POLICY "Managers can add members to their teams"
ON public.team_members
FOR INSERT
TO authenticated
WITH CHECK (
  get_user_role(auth.uid()) = 'manager' 
  AND EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_id 
    AND teams.manager_id = auth.uid()
  )
);

-- HR and Admin can update any team member
CREATE POLICY "HR and Admin can update team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (get_user_role(auth.uid()) IN ('hr', 'admin'));

-- Managers can update members in their teams
CREATE POLICY "Managers can update their team members"
ON public.team_members
FOR UPDATE
TO authenticated
USING (
  get_user_role(auth.uid()) = 'manager'
  AND EXISTS (
    SELECT 1 FROM public.teams 
    WHERE teams.id = team_id 
    AND teams.manager_id = auth.uid()
  )
);

-- HR and Admin can delete team members
CREATE POLICY "HR and Admin can delete team members"
ON public.team_members
FOR DELETE
TO authenticated
USING (get_user_role(auth.uid()) IN ('hr', 'admin'));