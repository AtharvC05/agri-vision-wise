import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertCardProps {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  type: 'irrigation' | 'fertilizer' | 'pest' | 'weather';
  icon: LucideIcon;
  date: string;
  actionRequired?: boolean;
  onAction?: () => void;
  actionText?: string;
  className?: string;
}

const AlertCard = ({
  title,
  message,
  priority,
  type,
  icon: Icon,
  date,
  actionRequired = false,
  onAction,
  actionText = 'Take Action',
  className
}: AlertCardProps) => {
  const getPriorityStyles = () => {
    switch (priority) {
      case 'high':
        return 'border-danger/30 bg-danger/5';
      case 'medium':
        return 'border-warning/30 bg-warning/5';
      case 'low':
        return 'border-success/30 bg-success/5';
      default:
        return '';
    }
  };

  const getPriorityBadgeVariant = () => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getIconColor = () => {
    switch (priority) {
      case 'high':
        return 'text-danger';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className={cn('transition-all hover:shadow-md', getPriorityStyles(), className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn('p-2 rounded-full bg-background', getIconColor())}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={getPriorityBadgeVariant()}>
                  {priority.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">{date}</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-foreground">{message}</p>
        
        {actionRequired && onAction && (
          <Button 
            onClick={onAction}
            variant={priority === 'high' ? 'default' : 'outline'}
            size="sm"
            className="w-full"
          >
            {actionText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertCard;