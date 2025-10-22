-- Create teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  manager_id UUID NOT NULL REFERENCES public.profiles(user_id),
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(user_id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.profiles(user_id),
  role_in_team TEXT NOT NULL CHECK (role_in_team IN ('lead', 'member', 'contributor')),
  joined_on TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'inactive')),
  is_primary BOOLEAN DEFAULT true,
  UNIQUE(team_id, employee_id)
);

-- Enable RLS
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for teams
CREATE POLICY "Everyone can view active teams"
ON public.teams
FOR SELECT
USING (is_active = true);

CREATE POLICY "HR and Admin can create teams"
ON public.teams
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['hr'::text, 'admin'::text]));

CREATE POLICY "HR and Admin can update all teams"
ON public.teams
FOR UPDATE
USING (get_user_role(auth.uid()) = ANY (ARRAY['hr'::text, 'admin'::text]));

CREATE POLICY "Managers can update their teams"
ON public.teams
FOR UPDATE
USING (auth.uid() = manager_id);

CREATE POLICY "HR and Admin can delete teams"
ON public.teams
FOR DELETE
USING (get_user_role(auth.uid()) = ANY (ARRAY['hr'::text, 'admin'::text]));

-- RLS Policies for team_members
CREATE POLICY "Everyone can view team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "HR and Admin can add members"
ON public.team_members
FOR INSERT
WITH CHECK (get_user_role(auth.uid()) = ANY (ARRAY['hr'::text, 'admin'::text]));

CREATE POLICY "Managers can add members to their teams"
ON public.team_members
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_id AND manager_id = auth.uid()
  )
);

CREATE POLICY "HR and Admin can update members"
ON public.team_members
FOR UPDATE
USING (get_user_role(auth.uid()) = ANY (ARRAY['hr'::text, 'admin'::text]));

CREATE POLICY "Managers can update members in their teams"
ON public.team_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.teams
    WHERE id = team_id AND manager_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_teams_manager_id ON public.teams(manager_id);
CREATE INDEX idx_teams_department ON public.teams(department);
CREATE INDEX idx_teams_is_active ON public.teams(is_active);
CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
CREATE INDEX idx_team_members_employee_id ON public.team_members(employee_id);
CREATE INDEX idx_team_members_status ON public.team_members(status);