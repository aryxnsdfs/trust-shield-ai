import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

type StatusType = 'safe' | 'suspicious' | 'threat' | 'pending';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalizedStatus = status.toLowerCase();
  
  const getStatusConfig = () => {
    if (['safe', 'real', 'legit', 'legitimate', 'verified'].some(s => normalizedStatus.includes(s))) {
      return {
        icon: CheckCircle,
        bg: 'bg-success/10',
        text: 'text-success',
        border: 'border-success/30',
        label: status,
      };
    }
    if (['danger', 'malicious', 'threat', 'fraud', 'scam'].some(s => normalizedStatus.includes(s))) {
      return {
        icon: XCircle,
        bg: 'bg-destructive/10',
        text: 'text-destructive',
        border: 'border-destructive/30',
        label: status,
      };
    }
    if (['suspicious', 'warning', 'caution', 'risky'].some(s => normalizedStatus.includes(s))) {
      return {
        icon: AlertTriangle,
        bg: 'bg-warning/10',
        text: 'text-warning',
        border: 'border-warning/30',
        label: status,
      };
    }
    return {
      icon: Clock,
      bg: 'bg-muted',
      text: 'text-muted-foreground',
      border: 'border-border',
      label: status,
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        config.bg,
        config.text,
        config.border,
        sizes[size]
      )}
    >
      <Icon size={size === 'sm' ? 12 : 14} />
      <span className="uppercase tracking-wide">{config.label}</span>
    </span>
  );
};

export default StatusBadge;
