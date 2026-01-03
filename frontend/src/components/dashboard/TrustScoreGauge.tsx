import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';

interface TrustScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TrustScoreGauge: React.FC<TrustScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-[10px]', icon: 16 },
    md: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-xs', icon: 20 },
    lg: { container: 'w-44 h-44', text: 'text-4xl', label: 'text-sm', icon: 24 },
  };

  const sizeConfig = sizes[size];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: 'hsl(142, 71%, 45%)', bg: 'text-success', class: 'success' };
    if (score >= 50) return { stroke: 'hsl(38, 92%, 50%)', bg: 'text-warning', class: 'warning' };
    return { stroke: 'hsl(0, 72%, 51%)', bg: 'text-destructive', class: 'destructive' };
  };

  const color = getColor();
  const Icon = score >= 80 ? ShieldCheck : score >= 50 ? Shield : ShieldAlert;

  return (
    <div className={cn('relative flex items-center justify-center', sizeConfig.container)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="6"
          className="opacity-30"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color.stroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="drop-shadow-lg"
          style={{ filter: `drop-shadow(0 0 8px ${color.stroke})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          <Icon className={cn(color.bg, 'mb-1')} size={sizeConfig.icon} />
        </motion.div>
        <motion.span
          className={cn('font-display font-bold', sizeConfig.text, color.bg)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {score}
        </motion.span>
        {showLabel && (
          <span className={cn('text-muted-foreground uppercase tracking-wider font-medium', sizeConfig.label)}>
            Trust Score
          </span>
        )}
      </div>
    </div>
  );
};

export default TrustScoreGauge;
