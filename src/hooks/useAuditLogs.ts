import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  performed_by: string;
  target_user_id?: string;
  timestamp: string;
  performer_name?: string;
  target_user_name?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditLogFilters {
  action?: string;
  performed_by?: string;
  target_user_id?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export function useAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();

  // Mock data for demonstration - in real implementation this would come from Supabase
  const mockLogs: AuditLog[] = [
    {
      id: '1',
      action: 'user_created',
      details: 'Created new employee account',
      performed_by: 'admin-1',
      target_user_id: 'user-123',
      timestamp: new Date().toISOString(),
      performer_name: 'Admin User',
      target_user_name: 'John Doe',
      ip_address: '192.168.1.100'
    },
    {
      id: '2',
      action: 'role_change',
      details: 'Role changed from employee to manager',
      performed_by: 'hr-1',
      target_user_id: 'user-124',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      performer_name: 'HR Manager',
      target_user_name: 'Jane Smith',
      ip_address: '192.168.1.101'
    },
    {
      id: '3',
      action: 'user_suspended',
      details: 'User account suspended',
      performed_by: 'admin-1',
      target_user_id: 'user-125',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      performer_name: 'Admin User',
      target_user_name: 'Bob Johnson',
      ip_address: '192.168.1.100'
    },
    {
      id: '4',
      action: 'profile_updated',
      details: 'Profile information updated',
      performed_by: 'user-126',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      performer_name: 'Alice Brown',
      ip_address: '192.168.1.102'
    },
    {
      id: '5',
      action: 'password_reset',
      details: 'Password reset requested',
      performed_by: 'user-127',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      performer_name: 'Charlie Wilson',
      ip_address: '192.168.1.103'
    }
  ];

  const fetchAuditLogs = async (filters?: AuditLogFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredLogs = [...mockLogs];
      
      if (filters?.action) {
        filteredLogs = filteredLogs.filter(log => log.action === filters.action);
      }
      
      if (filters?.performed_by) {
        filteredLogs = filteredLogs.filter(log => log.performed_by === filters.performed_by);
      }
      
      if (filters?.target_user_id) {
        filteredLogs = filteredLogs.filter(log => log.target_user_id === filters.target_user_id);
      }
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredLogs = filteredLogs.filter(log => 
          log.details.toLowerCase().includes(searchLower) ||
          log.performer_name?.toLowerCase().includes(searchLower) ||
          log.target_user_name?.toLowerCase().includes(searchLower)
        );
      }
      
      if (filters?.date_from) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) >= new Date(filters.date_from!)
        );
      }
      
      if (filters?.date_to) {
        filteredLogs = filteredLogs.filter(log => 
          new Date(log.timestamp) <= new Date(filters.date_to!)
        );
      }
      
      setLogs(filteredLogs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportAuditLogs = async (filters?: AuditLogFilters) => {
    try {
      // In real implementation, this would generate and download a CSV/Excel file
      const logsToExport = logs.length > 0 ? logs : mockLogs;
      
      const csvContent = [
        ['Timestamp', 'Action', 'Performer', 'Target User', 'Details', 'IP Address'].join(','),
        ...logsToExport.map(log => [
          log.timestamp,
          log.action,
          log.performer_name || 'Unknown',
          log.target_user_name || 'N/A',
          `"${log.details}"`,
          log.ip_address || 'Unknown'
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchAuditLogs();
    }
  }, [profile]);

  return {
    logs,
    loading,
    error,
    fetchAuditLogs,
    exportAuditLogs
  };
}