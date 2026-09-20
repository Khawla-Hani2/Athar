import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';
import { categoricalColors, CHART_INK } from '@/constants/chartColors';
import { ChartTooltip } from './ChartTooltip';

interface AppBarChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  bars: { key: string; name: string }[];
  height?: number;
  stacked?: boolean;
}

export function AppBarChart({ data, xKey, bars, height = 280, stacked }: AppBarChartProps) {
  const isDark = useIsDarkMode();
  const colors = categoricalColors(isDark);
  const ink = isDark ? CHART_INK.dark : CHART_INK.light;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
        <CartesianGrid vertical={false} stroke={ink.grid} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fill: ink.muted, fontSize: 12 }} axisLine={{ stroke: ink.axis }} tickLine={false} />
        <YAxis tick={{ fill: ink.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(11,11,11,0.03)' }} />
        {bars.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: ink.secondary }} iconType="circle" />}
        {bars.map((bar, i) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            name={bar.name}
            stackId={stacked ? 'stack' : undefined}
            fill={colors[i % colors.length]}
            radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            maxBarSize={36}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
