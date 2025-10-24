-- Fix infinite recursion by recreating functions with CASCADE
-- This will drop dependent policies and recreate them

-- Drop all dependent policies first
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Role-based team viewing" ON public.teams;
DROP POLICY IF EXISTS "Admins and HR can create teams" ON public.teams;
DROP POLICY IF EXISTS "Admins, HR, and Managers can update their teams" ON public.teams;
DROP POLICY IF EXISTS "Admins and HR can delete teams" ON public.teams;
DROP POLICY IF EXISTS "Role-based team member viewing" ON public.team_members;
DROP POLICY IF EXISTS "Admins, HR, and Managers can add members" ON public.team_members;
DROP POLICY IF EXISTS "Admins, HR, and Managers can update members" ON public.team_members;
DROP POLICY IF EXISTS "Admins, HR, and Managers can remove members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and HR can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Now drop and recreate functions
DROP FUNCTION IF EXISTS public.has_role(_user_id uuid, _role app_role) CASCADE;
DROP FUNCTION IF EXISTS public.get_primary_role(_user_id uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_role(user_uuid uuid) CASCADE;

-- Create has_role function with proper SECURITY DEFINER
CREATE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
END;
$$;

-- Create get_primary_role function
CREATE FUNCTION public.get_primary_role(_user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role::text INTO user_role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'hr' THEN 2
      WHEN 'manager' THEN 3
      WHEN 'employee' THEN 4
    END
  LIMIT 1;
  
  RETURN user_role;
END;
$$;

-- Create get_user_role function
CREATE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN public.get_primary_role(user_uuid);
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_primary_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role(uuid) TO authenticated;

-- Recreate user_roles policies
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Recreate teams policies
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

-- Recreate team_members policies
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

-- Fix profiles policies to avoid recursion
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "HR can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'hr'));

CREATE POLICY "Managers can view profiles"
  ON public.profiles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'manager'));

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));