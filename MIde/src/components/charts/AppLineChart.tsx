import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';
import { categoricalColors, CHART_INK } from '@/constants/chartColors';
import { ChartTooltip } from './ChartTooltip';

interface AppLineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines: { key: string; name: string }[];
  height?: number;
}

export function AppLineChart({ data, xKey, lines, height = 280 }: AppLineChartProps) {
  const isDark = useIsDarkMode();
  const colors = categoricalColors(isDark);
  const ink = isDark ? CHART_INK.dark : CHART_INK.light;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={ink.grid} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fill: ink.muted, fontSize: 12 }} axisLine={{ stroke: ink.axis }} tickLine={false} />
        <YAxis tick={{ fill: ink.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 12, color: ink.secondary }} iconType="circle" />}
        {lines.map((line, i) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name}
            stroke={colors[i % colors.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
