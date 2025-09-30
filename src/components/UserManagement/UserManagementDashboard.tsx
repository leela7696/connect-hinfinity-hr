import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Shield,
  Eye,
  Trash2,
  UserCheck,
  UserX,
  Settings
} from 'lucide-react';
import { useUsers, UserFilters } from '@/hooks/useUsers';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { BulkOperations } from './BulkOperations';
import { AuditLogDashboard } from './AuditLogDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';

export function UserManagementDashboard() {
  const { users, loading, fetchUsers, createUser, updateUser, deleteUser, assignRole, toggleUserStatus } = useUsers();
  const { profile } = useAuth();
  const [filters, setFilters] = useState<UserFilters>({});
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');

  // Permission check
  if (profile?.role !== 'admin' && profile?.role !== 'hr') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="h-5 w-5 mr-2" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You don't have permission to access the User Management dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    const filterValue = value === 'all' ? '' : value;
    const newFilters = { ...filters, [key]: filterValue || undefined };
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    fetchUsers();
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      icon: Users,
      description: 'All registered users'
    },
    {
      title: 'Active Users',
      value: users.filter(u => u.is_active !== false).length.toString(),
      icon: UserCheck,
      description: 'Currently active accounts'
    },
    {
      title: 'Suspended',
      value: users.filter(u => u.is_active === false).length.toString(),
      icon: UserX,
      description: 'Suspended accounts'
    },
    {
      title: 'New This Month',
      value: users.filter(u => 
        new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length.toString(),
      icon: UserPlus,
      description: 'Users added in last 30 days'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold gradient-text">User Management</h1>
            <p className="text-muted-foreground mt-2">
              Manage users, roles, and permissions across HR Connect
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowUserForm(true)}
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-scale glass">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            {profile?.role === 'admin' && (
              <TabsTrigger value="settings">Settings</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9"
                      value={filters.search || ''}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                  </div>
                  
                  <Select value={filters.role || 'all'} onValueChange={(value) => handleFilterChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filters.department || 'all'} onValueChange={(value) => handleFilterChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select 
                    value={filters.is_active?.toString() || 'all'} 
                    onValueChange={(value) => handleFilterChange('is_active', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <UserTable
              users={users}
              loading={loading}
              onEdit={(user) => {
                setSelectedUser(user);
                setShowUserForm(true);
              }}
              onDelete={deleteUser}
              onAssignRole={assignRole}
              onToggleStatus={toggleUserStatus}
            />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkOperations />
          </TabsContent>

          <TabsContent value="audit">
            <AuditLogDashboard />
          </TabsContent>

          {profile?.role === 'admin' && (
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    System Settings
                  </CardTitle>
                  <CardDescription>
                    Configure system-wide user management settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Password Policy</h4>
                        <p className="text-sm text-muted-foreground">Configure password requirements</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Multi-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">MFA settings and enforcement</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Session Management</h4>
                        <p className="text-sm text-muted-foreground">Configure session timeouts and policies</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* User Form Modal */}
        {showUserForm && (
          <UserForm
            user={selectedUser}
            onClose={() => {
              setShowUserForm(false);
              setSelectedUser(null);
            }}
            onSave={async (userIdOrData: any, updates?: any) => {
              if (selectedUser && updates) {
                await updateUser(userIdOrData, updates);
              } else {
                await createUser(userIdOrData);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}