-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policy that causes recursion
DROP POLICY IF EXISTS "Admins and HR can view all profiles" ON public.profiles;

-- Create a function to get user role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE user_id = user_uuid;
  
  RETURN user_role;
END;
$$;

-- Create new policy for admins and HR that doesn't cause recursion
CREATE POLICY "Admins and HR can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id OR 
  public.get_user_role(auth.uid()) IN ('admin', 'hr')
);