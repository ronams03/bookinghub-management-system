'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { DAILY_OCCUPANCY } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false, loading: () => <ChartSkeleton height={200} /> });
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(m => ({ default: m.ReferenceLine })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="card-base shadow-dropdown px-3 py-2 text-xs">
      <p className="font-600 text-foreground">{label}</p>
      <p className="text-muted-foreground mt-0.5">
        Occupancy: <span className={`font-600 ${val >= 80 ? 'text-positive' : val >= 65 ? 'text-primary' : 'text-warning'}`}>{val}%</span>
      </p>
    </div>
  );
}

export default function OccupancyBarChart() {
  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-600 text-foreground">Daily Occupancy Rate</h3>
          <p className="text-xs text-muted-foreground mt-0.5">May 2026 — each bar represents one day</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-positive/70 inline-block" />
            <span className="text-muted-foreground">≥ 80% (target)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary/70 inline-block" />
            <span className="text-muted-foreground">65–79%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-warning/70 inline-block" />
            <span className="text-muted-foreground">Below 65%</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DAILY_OCCUPANCY} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={80} stroke="var(--positive)" strokeDasharray="4 4" strokeWidth={1.5} />
          <Bar dataKey="occupancy" radius={[3, 3, 0, 0]}>
            {DAILY_OCCUPANCY.map(entry => (
              <Cell
                key={`occ-cell-${entry.day}`}
                fill={entry.occupancy >= 80 ? 'var(--positive)' : entry.occupancy >= 65 ? 'var(--primary)' : 'var(--accent)'}
                opacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}