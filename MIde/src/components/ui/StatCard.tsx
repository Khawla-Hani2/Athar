import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { cn } from '@/utils/cn';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  color?: string;
}

export function StatCard({ label, value, icon: Icon, trend, color = '#7c3aed' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          </div>
          <div
            className="flex size-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${color}1a`, color }}
          >
            <Icon className="size-5" />
          </div>
        </div>
        {trend !== undefined && (
          <div
            className={cn(
              'mt-3 flex items-center gap-1 text-xs font-medium',
              trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
            )}
          >
            {trend >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
            {Math.abs(trend)}% vs last period
          </div>
        )}
      </Card>
    </motion.div>
  );
}
