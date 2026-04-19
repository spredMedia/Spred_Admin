"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface BarChartComponentProps {
  data: any[];
  bars: Array<{
    key: string;
    fill: string;
    name: string;
  }>;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  className?: string;
  xAxisKey?: string;
}

export function BarChartComponent({
  data,
  bars,
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
  xAxisKey = 'date',
}: BarChartComponentProps) {
  return (
    <div className={cn('w-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />}
          <XAxis
            dataKey={xAxisKey}
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
            }}
            formatter={(value) => value.toLocaleString()}
          />
          {showLegend && <Legend />}
          {bars.map((bar) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              fill={bar.fill}
              name={bar.name}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
