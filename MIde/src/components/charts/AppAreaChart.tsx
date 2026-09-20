import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useIsDarkMode } from '@/hooks/useIsDarkMode';
import { CATEGORICAL_LIGHT, CATEGORICAL_DARK, CHART_INK } from '@/constants/chartColors';
import { ChartTooltip } from './ChartTooltip';

interface AppAreaChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  height?: number;
}

export function AppAreaChart({ data, xKey, yKey, height = 260 }: AppAreaChartProps) {
  const isDark = useIsDarkMode();
  const color = isDark ? CATEGORICAL_DARK[0] : CATEGORICAL_LIGHT[0];
  const ink = isDark ? CHART_INK.dark : CHART_INK.light;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={ink.grid} strokeDasharray="3 3" />
        <XAxis dataKey={xKey} tick={{ fill: ink.muted, fontSize: 12 }} axisLine={{ stroke: ink.axis }} tickLine={false} />
        <YAxis tick={{ fill: ink.muted, fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2} fill="url(#areaFill)" activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
