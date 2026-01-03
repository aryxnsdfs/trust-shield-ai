import React from 'react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { motion } from 'framer-motion';

interface LogEntry {
  timestamp: string;
  type: string;
  verdict: string;
  details: string;
}

interface DataTableProps {
  data: LogEntry[];
  loading?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({ data, loading }) => {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border/50 bg-muted/30">
        <h3 className="font-display font-semibold text-foreground flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live Analysis Log
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border/50">
              <th className="p-4 font-medium">Time</th>
              <th className="p-4 font-medium">Module</th>
              <th className="p-4 font-medium">Verdict</th>
              <th className="p-4 font-medium">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {data.length > 0 ? (
              data.map((log, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {log.timestamp}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-lg bg-muted text-xs font-medium text-foreground">
                      {log.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <StatusBadge status={log.verdict} size="sm" />
                  </td>
                  <td className="p-4 text-sm text-muted-foreground truncate max-w-xs">
                    {log.details}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
                      <div className="w-3 h-3 rounded-full bg-primary/50 animate-pulse" />
                    </div>
                    <p className="font-medium">Awaiting Data</p>
                    <p className="text-sm">System initialized and ready for analysis</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
