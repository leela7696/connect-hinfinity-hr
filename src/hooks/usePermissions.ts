import { useAuth } from './useAuth';

type Action = 'create' | 'read' | 'update' | 'delete' | 'manage' | 'approve' | 'export' | 'bulk_import';
type Resource = 'team' | 'member' | 'project' | 'settings' | 'audit';

// RBAC permission matrix
const PERMISSIONS: Record<string, Record<Resource, Action[]>> = {
  admin: {
    team: ['create', 'read', 'update', 'delete', 'manage', 'export', 'bulk_import'],
    member: ['create', 'read', 'update', 'delete', 'manage', 'export', 'bulk_import'],
    project: ['create', 'read', 'update', 'delete', 'manage'],
    settings: ['create', 'read', 'update', 'delete', 'manage'],
    audit: ['read', 'export'],
  },
  hr: {
    team: ['create', 'read', 'update', 'delete', 'export', 'bulk_import'],
    member: ['create', 'read', 'update', 'delete', 'export', 'bulk_import'],
    project: ['create', 'read', 'update', 'manage'],
    settings: ['read', 'update'],
    audit: ['read', 'export'],
  },
  manager: {
    team: ['read', 'update'], // Can only update teams they manage
    member: ['read', 'update', 'create'], // Propose changes, some need HR approval
    project: ['create', 'read', 'update'],
    settings: ['read'],
    audit: ['read'], // Only their team's audit
  },
  employee: {
    team: ['read'], // View only their team
    member: ['read'], // View only
    project: ['read'],
    settings: [],
    audit: [],
  },
};

export function usePermissions() {
  const { profile } = useAuth();

  const hasPermission = (action: Action, resource: Resource, context?: { isManager?: boolean }): boolean => {
    if (!profile) return false;
    
    const role = profile.role;
    const permissions = PERMISSIONS[role]?.[resource] || [];
    
    // Managers have context-specific permissions
    if (role === 'manager' && context?.isManager) {
      return permissions.includes(action);
    }
    
    // Admin and HR have broader permissions
    if (role === 'admin' || role === 'hr') {
      return permissions.includes(action);
    }
    
    // Employee has limited permissions
    return permissions.includes(action);
  };

  const canManageTeam = (managerId: string): boolean => {
    if (!profile) return false;
    if (profile.role === 'admin' || profile.role === 'hr') return true;
    if (profile.role === 'manager' && profile.user_id === managerId) return true;
    return false;
  };

  const canBulkImport = (): boolean => {
    return hasPermission('bulk_import', 'member');
  };

  const canExport = (): boolean => {
    return hasPermission('export', 'team');
  };

  const canViewAudit = (): boolean => {
    return hasPermission('read', 'audit');
  };

  return {
    hasPermission,
    canManageTeam,
    canBulkImport,
    canExport,
    canViewAudit,
    role: profile?.role,
  };
}
