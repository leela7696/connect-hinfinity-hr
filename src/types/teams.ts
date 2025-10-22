export type TeamStatus = 'active' | 'inactive';
export type MemberStatus = 'active' | 'on_leave' | 'inactive';
export type TeamMemberRole = 'lead' | 'member' | 'contributor';

export interface Team {
  id: string;
  tenant_id?: string;
  name: string;
  slug: string;
  department: string;
  manager_id: string;
  manager_name?: string;
  manager_email?: string;
  description: string;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  member_count?: number;
}

export interface TeamMember {
  id: string;
  team_id: string;
  employee_id: string;
  employee_name?: string;
  employee_email?: string;
  employee_avatar?: string;
  role_in_team: TeamMemberRole;
  joined_on: string;
  status: MemberStatus;
  is_primary: boolean;
}

export interface TeamMetrics {
  team_id: string;
  member_count: number;
  avg_attendance: number;
  task_completion: number;
  open_tickets: number;
  period_start: string;
  period_end: string;
}

export interface TeamAuditEntry {
  id: string;
  team_id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  resource_type: 'team' | 'member' | 'project' | 'setting';
  resource_id: string;
  before_state?: any;
  after_state?: any;
  timestamp: string;
  ip_address?: string;
}

export interface BulkImportRequest {
  tenant_id?: string;
  csvFileUrl: string;
  mapping: Record<string, string>;
  dryRun: boolean;
}

export interface BulkImportResult {
  success: boolean;
  processed: number;
  errors: Array<{ row: number; error: string }>;
  created?: number;
}
