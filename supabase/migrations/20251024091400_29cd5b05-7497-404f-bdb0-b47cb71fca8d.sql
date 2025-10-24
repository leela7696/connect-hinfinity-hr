-- Create app_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'hr', 'manager', 'employee');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create user_roles table for secure role management
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get primary user role
CREATE OR REPLACE FUNCTION public.get_primary_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'hr' THEN 2
      WHEN 'manager' THEN 3
      WHEN 'employee' THEN 4
    END
  LIMIT 1
$$;

-- Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update teams RLS policies for RBAC
DROP POLICY IF EXISTS "Authenticated users can view all teams" ON public.teams;
DROP POLICY IF EXISTS "HR and Admin can update teams" ON public.teams;
DROP POLICY IF EXISTS "HR and Admin can delete teams" ON public.teams;
DROP POLICY IF EXISTS "HR, Admin, and Managers can create teams" ON public.teams;

-- Teams SELECT policy with role-based filtering
CREATE POLICY "Role-based team viewing"
  ON public.teams
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    (public.has_role(auth.uid(), 'manager') AND manager_id = auth.uid()) OR
    (public.has_role(auth.uid(), 'employee') AND EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_id = teams.id 
      AND employee_id = auth.uid()
      AND status = 'active'
    ))
  );

CREATE POLICY "Admins and HR can create teams"
  ON public.teams
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

CREATE POLICY "Admins, HR, and Managers can update their teams"
  ON public.teams
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    (public.has_role(auth.uid(), 'manager') AND manager_id = auth.uid())
  );

CREATE POLICY "Admins and HR can delete teams"
  ON public.teams
  FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR 
    public.has_role(auth.uid(), 'hr')
  );

-- Update team_members RLS policies
DROP POLICY IF EXISTS "All authenticated users can view team members" ON public.team_members;
DROP POLICY IF EXISTS "HR and Admin can add team members" ON public.team_members;
DROP POLICY IF EXISTS "Managers can add members to their teams" ON public.team_members;
DROP POLICY IF EXISTS "HR and Admin can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Managers can update their team members" ON public.team_members;
DROP POLICY IF EXISTS "HR and Admin can delete team members" ON public.team_members;

CREATE POLICY "Role-based team member viewing"
  ON public.team_members
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams 
      WHERE id = team_members.team_id 
      AND manager_id = auth.uid()
    ) OR
    employee_id = auth.uid()
  );

CREATE POLICY "Admins, HR, and Managers can add members"
  ON public.team_members
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    (public.has_role(auth.uid(), 'manager') AND EXISTS (
      SELECT 1 FROM public.teams 
      WHERE id = team_members.team_id 
      AND manager_id = auth.uid()
    ))
  );

CREATE POLICY "Admins, HR, and Managers can update members"
  ON public.team_members
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams 
      WHERE id = team_members.team_id 
      AND manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins, HR, and Managers can remove members"
  ON public.team_members
  FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams 
      WHERE id = team_members.team_id 
      AND manager_id = auth.uid()
    )
  );

-- Update get_user_role function to use user_roles table
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_primary_role(user_uuid)
$$;

-- Update handle_new_user trigger function to use user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Determine role from metadata, default to employee
  user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'employee');
  
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    user_role
  );
  
  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;