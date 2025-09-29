import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = "text-primary",
  trend = 'neutral',
  className 
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn("hover:shadow-lg transition-all duration-300 hover:-translate-y-1 card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-2xl font-bold text-foreground animate-fade-in">{value}</p>
              {trend !== 'neutral' && (
                <Badge 
                  variant="secondary" 
                  className={cn(getTrendColor(), "text-xs")}
                >
                  {change}
                </Badge>
              )}
            </div>
            {trend === 'neutral' && (
              <p className="text-sm text-muted-foreground mt-1">{change}</p>
            )}
          </div>
          <div className={cn("p-3 rounded-full bg-primary/10 hover-glow", color)}>
            <Icon className="h-6 w-6 animate-scale-in" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}