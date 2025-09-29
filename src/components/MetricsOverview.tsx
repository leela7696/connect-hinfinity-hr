import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Metric {
  label: string;
  value: number;
  target?: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  format?: 'percentage' | 'number' | 'currency';
}

interface MetricsOverviewProps {
  title?: string;
  metrics: Metric[];
  className?: string;
}

export function MetricsOverview({ 
  title = "Performance Metrics", 
  metrics, 
  className 
}: MetricsOverviewProps) {
  const formatValue = (value: number, format: Metric['format'] = 'number') => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: 'USD' 
        }).format(value);
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend?: Metric['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend?: Metric['trend']) => {
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
    <Card className={cn("animate-fade-in", className)}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>
          Key performance indicators and progress tracking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className="space-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-foreground">
                    {metric.label}
                  </span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-foreground">
                    {formatValue(metric.value, metric.format)}
                  </span>
                  {metric.target && (
                    <span className="text-sm text-muted-foreground">
                      / {formatValue(metric.target, metric.format)}
                    </span>
                  )}
                </div>
              </div>
              
              {metric.target && (
                <div className="space-y-1">
                  <Progress 
                    value={Math.min((metric.value / metric.target) * 100, 100)} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>{formatValue(metric.target, metric.format)}</span>
                  </div>
                </div>
              )}
              
              {metric.change !== undefined && (
                <div className={cn("flex items-center space-x-1 text-sm", getTrendColor(metric.trend))}>
                  {getTrendIcon(metric.trend)}
                  <span>
                    {metric.change > 0 ? '+' : ''}{formatValue(metric.change, metric.format)} 
                    {metric.format === 'percentage' ? ' points' : ''} from last period
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}