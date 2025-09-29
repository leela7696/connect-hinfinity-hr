import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface User {
  id: string;
  user_id: string;
  full_name: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
  phone?: string;
  avatar_url?: string;
  department?: string;
  position?: string;
  email?: string;
  is_active?: boolean;
  last_login?: string;
}

export interface UserFilters {
  role?: string;
  department?: string;
  is_active?: boolean;
  search?: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();

  const fetchUsers = async (filters?: UserFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      let query = supabase
        .from('profiles')
        .select('*');
      
      if (filters?.role) {
        query = query.eq('role', filters.role as 'admin' | 'hr' | 'manager' | 'employee');
      }
      
      if (filters?.department) {
        query = query.eq('department', filters.department);
      }
      
      if (filters?.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setUsers(data || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email!,
        password: 'TempPassword123!', // Will be reset via email
        email_confirm: false,
        user_metadata: {
          full_name: userData.full_name,
          role: userData.role
        }
      });

      if (authError) throw authError;

      // Profile will be created automatically via trigger
      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      return authData.user;
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);
      
      if (error) throw error;
      
      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      
      await fetchUsers();
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
      throw err;
    }
  };

  const assignRole = async (userId: string, newRole: User['role']) => {
    try {
      await updateUser(userId, { role: newRole });
      
      // Log the role change for audit
      await logAuditAction('role_change', `Role changed to ${newRole}`, userId);
      
      toast({
        title: "Role Updated",
        description: `Role successfully changed to ${newRole}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to assign role",
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUser(userId, { is_active: isActive });
      
      await logAuditAction(
        isActive ? 'user_activated' : 'user_suspended',
        `User ${isActive ? 'activated' : 'suspended'}`,
        userId
      );
      
      toast({
        title: "Status Updated",
        description: `User ${isActive ? 'activated' : 'suspended'} successfully`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
      throw err;
    }
  };

  const logAuditAction = async (action: string, details: string, targetUserId?: string) => {
    try {
      // This would typically be handled by an edge function
      // For now, we'll implement basic logging
      console.log('Audit Log:', {
        action,
        details,
        targetUserId,
        performedBy: profile?.id,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to log audit action:', err);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin' || profile?.role === 'hr') {
      fetchUsers();
    }
  }, [profile]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    assignRole,
    toggleUserStatus,
    logAuditAction
  };
}