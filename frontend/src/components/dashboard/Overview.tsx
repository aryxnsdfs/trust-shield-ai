import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { GlassCard, MetricCard } from './GlassCard';
import { DonutChart } from './DonutChart';
import { DataTable } from './DataTable';

interface DashboardStats {
  total_scans: number;
  threats_detected: number;
  safe_scans: number;
  pie_data: [number, number, number];
  recent_activity: Array<{
    timestamp: string;
    type: string;
    verdict: string;
    details: string;
  }>;
}

export const Overview: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_scans: 0,
    threats_detected: 0,
    safe_scans: 0,
    pie_data: [0, 0, 0],
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/overview-stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
      setLoading(false);
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">
          Command Center
        </h2>
        <p className="text-muted-foreground">
          Real-time security overview and threat analysis dashboard.
        </p>
      </motion.div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Donut Chart */}
        <motion.div variants={itemVariants} className="md:col-span-4">
          <GlassCard className="flex flex-col items-center justify-center h-full py-8">
            <h3 className="text-sm font-medium text-muted-foreground mb-6 flex items-center gap-2 self-start">
              <Activity size={16} className="text-primary" />
              Threat Distribution
            </h3>
            <DonutChart data={stats.pie_data} size={180} />
            <div className="flex gap-6 mt-6 text-xs font-medium">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-muted-foreground">Suspicious</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">Threats</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div variants={itemVariants} className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 h-full">
            <MetricCard
              icon={Search}
              label="Total Analyzed"
              value={stats.total_scans.toLocaleString()}
              variant="default"
            />
            <MetricCard
              icon={ShieldAlert}
              label="Threats Detected"
              value={stats.threats_detected}
              variant="destructive"
            />
            <MetricCard
              icon={ShieldCheck}
              label="Verified Safe"
              value={stats.safe_scans.toLocaleString()}
              variant="success"
            />
          </div>
        </motion.div>
      </div>

      {/* Activity Log */}
      <motion.div variants={itemVariants}>
        <DataTable data={stats.recent_activity} loading={loading} />
      </motion.div>
    </motion.div>
  );
};

export default Overview;
