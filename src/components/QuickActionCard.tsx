import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  action: string;
  onClick?: () => void;
  className?: string;
}

export function QuickActionCard({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  onClick,
  className 
}: QuickActionCardProps) {
  return (
    <Card 
      className={cn(
        "p-4 border border-border rounded-lg hover:bg-secondary/50 transition-all duration-300 cursor-pointer group hover:shadow-lg hover:border-primary/20",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
            <Icon className="h-5 w-5 text-primary group-hover:scale-110 transition-transform duration-200" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
              {description}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              {action}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}