import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';
import { categoricalColors, CHART_INK } from '@/constants/chartColors';
import { ChartTooltip } from './ChartTooltip';

interface AppDonutChartProps {
  data: Array<{ name: string; value: number }>;
  height?: number;
}

export function AppDonutChart({ data, height = 260 }: AppDonutChartProps) {
  const isDark = useIsDarkMode();
  const colors = categoricalColors(isDark);
  const ink = isDark ? CHART_INK.dark : CHART_INK.light;
  const surface = isDark ? '#1a1a19' : '#fcfcfb';

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 12, color: ink.secondary }} iconType="circle" />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="60%"
          outerRadius="85%"
          paddingAngle={2}
          stroke={surface}
          strokeWidth={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={colors[i % colors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
