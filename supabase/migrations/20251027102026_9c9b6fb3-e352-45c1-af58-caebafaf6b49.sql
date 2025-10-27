-- Drop the view with security definer and recreate without it
DROP VIEW IF EXISTS public.team_member_counts;

-- Recreate view without security definer (using default security invoker)
CREATE VIEW public.team_member_counts 
WITH (security_invoker = true)
AS
SELECT 
  t.id as team_id,
  COUNT(tm.id) as member_count
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.status = 'active'
GROUP BY t.id;