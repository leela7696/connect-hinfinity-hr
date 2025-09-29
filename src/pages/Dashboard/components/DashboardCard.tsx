import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  value?: string | number;
  change?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  description,
  value,
  change,
  badge,
  badgeVariant = "secondary",
  icon: Icon,
  children,
  className,
  onClick
}: DashboardCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {Icon && (
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-4 w-4 text-primary" />
              </div>
            )}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {badge && (
            <Badge variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {value !== undefined && (
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            {change && (
              <p className="text-sm text-muted-foreground">{change}</p>
            )}
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}