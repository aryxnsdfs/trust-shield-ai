import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'primary' | 'success' | 'destructive' | 'warning' | 'none';
  hover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glowColor = 'none',
  hover = false,
}) => {
  const glowStyles = {
    primary: 'hover:shadow-glow border-primary/20',
    success: 'hover:shadow-glow-success border-success/20',
    destructive: 'hover:shadow-glow-destructive border-destructive/20',
    warning: 'border-warning/20',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:-translate-y-1 cursor-pointer',
        glowStyles[glowColor],
        className
      )}
    >
      {children}
    </div>
  );
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  variant?: 'default' | 'success' | 'destructive' | 'warning';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon: Icon,
  label,
  value,
  trend,
  variant = 'default',
}) => {
  const variants = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
      glow: 'primary' as const,
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
      valueColor: 'text-success',
      glow: 'success' as const,
    },
    destructive: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
      valueColor: 'text-destructive',
      glow: 'destructive' as const,
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning',
      valueColor: 'text-warning',
      glow: 'warning' as const,
    },
  };

  const style = variants[variant];

  return (
    <GlassCard glowColor={style.glow} hover className="flex flex-col justify-between min-h-[160px]">
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          style.iconBg
        )}
      >
        <Icon className={cn('w-6 h-6', style.iconColor)} />
      </div>
      <div className="mt-4">
        <div className={cn('text-3xl font-display font-bold tracking-tight', style.valueColor)}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground font-medium mt-1">{label}</div>
        {trend && (
          <div className="text-xs text-muted-foreground/70 mt-2">{trend}</div>
        )}
      </div>
    </GlassCard>
  );
};

export default GlassCard;
