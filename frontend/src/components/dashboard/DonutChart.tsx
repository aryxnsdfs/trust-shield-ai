import React from 'react';
import { motion } from 'framer-motion';

interface DonutChartProps {
  data: [number, number, number]; // [safe, suspicious, threats]
  size?: number;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, size = 200 }) => {
  const [safe, suspicious, threats] = data;
  const total = safe + suspicious + threats || 1;

  const colors = {
    safe: 'hsl(142, 71%, 45%)',
    suspicious: 'hsl(38, 92%, 50%)',
    threats: 'hsl(0, 72%, 51%)',
  };

  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const safePercent = (safe / total) * circumference;
  const suspiciousPercent = (suspicious / total) * circumference;
  const threatsPercent = (threats / total) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="12"
          className="opacity-20"
        />
        
        {/* Threats slice */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.threats}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${threatsPercent} ${circumference}`}
          strokeDashoffset={0}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${threatsPercent} ${circumference}` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 4px hsl(0, 72%, 51%))' }}
        />
        
        {/* Suspicious slice */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.suspicious}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${suspiciousPercent} ${circumference}`}
          strokeDashoffset={-threatsPercent}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${suspiciousPercent} ${circumference}` }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 4px hsl(38, 92%, 50%))' }}
        />
        
        {/* Safe slice */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.safe}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${safePercent} ${circumference}`}
          strokeDashoffset={-(threatsPercent + suspiciousPercent)}
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${safePercent} ${circumference}` }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          style={{ filter: 'drop-shadow(0 0 4px hsl(142, 71%, 45%))' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-display font-bold text-foreground"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
        >
          {total}
        </motion.span>
        <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Analyzed
        </span>
      </div>
    </div>
  );
};

export default DonutChart;
