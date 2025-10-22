import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TeamFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    department?: string;
    is_active?: boolean;
  }) => void;
}

const departments = [
  'Technology',
  'Marketing',
  'Sales',
  'Human Resources',
  'Product',
  'Customer Support',
  'Finance',
  'Design',
  'Operations',
];

export function TeamFilters({ onFilterChange }: TeamFiltersProps) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const handleSearchChange = (value: string) => {
    setSearch(value);
    applyFilters({ search: value });
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    applyFilters({ department: value === 'all' ? '' : value });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    const isActive = value === 'active' ? true : value === 'inactive' ? false : undefined;
    applyFilters({ is_active: isActive });
  };

  const applyFilters = (updates: Partial<{
    search: string;
    department: string;
    is_active: boolean | undefined;
  }>) => {
    onFilterChange({
      search: updates.search !== undefined ? updates.search : search,
      department: updates.department !== undefined ? updates.department : department,
      is_active: updates.is_active !== undefined ? updates.is_active : 
        (status === 'active' ? true : status === 'inactive' ? false : undefined),
    });
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('');
    setStatus('');
    onFilterChange({});
  };

  const hasActiveFilters = search || department || status;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Select value={department || 'all'} onValueChange={handleDepartmentChange}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status || 'all'} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <Badge variant="secondary">
              Search: {search}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleSearchChange('')} />
            </Badge>
          )}
          {department && (
            <Badge variant="secondary">
              Dept: {department}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleDepartmentChange('all')} />
            </Badge>
          )}
          {status && (
            <Badge variant="secondary">
              Status: {status}
              <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleStatusChange('all')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
