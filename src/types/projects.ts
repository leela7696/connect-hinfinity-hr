export type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TeamProject {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date?: string;
  end_date?: string;
  completion_percentage: number;
  assigned_members?: string[];
  tags?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface TeamAnalytics {
  id: string;
  team_id: string;
  metric_type: 'attendance' | 'task_completion' | 'productivity' | 'member_count' | 'project_completion';
  metric_value: number;
  metric_date: string;
  metadata?: any;
  created_at: string;
}

export interface TeamActivityLog {
  id: string;
  team_id: string;
  actor_id?: string;
  actor_name: string;
  action: string;
  resource_type: 'team' | 'member' | 'project' | 'setting';
  resource_id?: string;
  description: string;
  metadata?: any;
  created_at: string;
}
