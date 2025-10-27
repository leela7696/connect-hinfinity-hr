-- Create team_projects table
CREATE TABLE IF NOT EXISTS public.team_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  assigned_members UUID[],
  tags TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_analytics table for storing historical metrics
CREATE TABLE IF NOT EXISTS public.team_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL CHECK (metric_type IN ('attendance', 'task_completion', 'productivity', 'member_count', 'project_completion')),
  metric_value NUMERIC NOT NULL,
  metric_date DATE NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_activity_log table
CREATE TABLE IF NOT EXISTS public.team_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('team', 'member', 'project', 'setting')),
  resource_id TEXT,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.team_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for team_projects
CREATE POLICY "Users can view projects of their teams"
  ON public.team_projects
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams WHERE teams.id = team_projects.team_id AND teams.manager_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_projects.team_id 
      AND team_members.employee_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Admins, HR, and Managers can create projects"
  ON public.team_projects
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams WHERE teams.id = team_projects.team_id AND teams.manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins, HR, and Managers can update projects"
  ON public.team_projects
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams WHERE teams.id = team_projects.team_id AND teams.manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins and HR can delete projects"
  ON public.team_projects
  FOR DELETE
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr')
  );

-- RLS Policies for team_analytics
CREATE POLICY "Users can view analytics of their teams"
  ON public.team_analytics
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams WHERE teams.id = team_analytics.team_id AND teams.manager_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_analytics.team_id 
      AND team_members.employee_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Admins and HR can insert analytics"
  ON public.team_analytics
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr')
  );

-- RLS Policies for team_activity_log
CREATE POLICY "Users can view activity of their teams"
  ON public.team_activity_log
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'hr') OR
    EXISTS (
      SELECT 1 FROM public.teams WHERE teams.id = team_activity_log.team_id AND teams.manager_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = team_activity_log.team_id 
      AND team_members.employee_id = auth.uid()
      AND team_members.status = 'active'
    )
  );

CREATE POLICY "Anyone can insert activity logs"
  ON public.team_activity_log
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_team_projects_team_id ON public.team_projects(team_id);
CREATE INDEX idx_team_projects_status ON public.team_projects(status);
CREATE INDEX idx_team_analytics_team_id ON public.team_analytics(team_id);
CREATE INDEX idx_team_analytics_metric_date ON public.team_analytics(metric_date);
CREATE INDEX idx_team_activity_log_team_id ON public.team_activity_log(team_id);
CREATE INDEX idx_team_activity_log_created_at ON public.team_activity_log(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_team_projects_updated_at
  BEFORE UPDATE ON public.team_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create view for team member counts
CREATE OR REPLACE VIEW public.team_member_counts AS
SELECT 
  t.id as team_id,
  COUNT(tm.id) as member_count
FROM public.teams t
LEFT JOIN public.team_members tm ON t.id = tm.team_id AND tm.status = 'active'
GROUP BY t.id;