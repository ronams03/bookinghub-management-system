'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { WEEKLY_REVENUE_DATA } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false, loading: () => <ChartSkeleton height={220} /> });
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(m => ({ default: m.Legend })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

const ROOM_COLORS = {
  standard: '#94a3b8',
  deluxe: 'var(--accent)',
  suite: 'var(--primary)',
  executive: '#16a34a',
  penthouse: '#7c3aed',
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; fill: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((s, p) => s + p.value, 0);
  return (
    <div className="card-base shadow-dropdown px-3 py-2.5 text-xs min-w-[160px]">
      <p className="font-600 text-foreground mb-2">Week of {label}</p>
      {payload.map((p, i) => (
        <div key={`rev-tt-${i}`} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill }} />
            <span className="text-muted-foreground capitalize">{p.name}</span>
          </div>
          <span className="font-600 text-foreground tabular-nums">${p.value.toLocaleString()}</span>
        </div>
      ))}
      <div className="border-t border-border pt-1.5 mt-1.5 flex justify-between">
        <span className="font-600 text-foreground">Total</span>
        <span className="font-700 text-foreground tabular-nums">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

export default function WeeklyRevenueChart() {
  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-600 text-foreground">Revenue by Room Type</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weekly breakdown — last 5 weeks</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">This week total</p>
          <p className="text-base font-700 text-foreground tabular-nums">$38,350</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={WEEKLY_REVENUE_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -10 }} barSize={14} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '11px', paddingTop: '12px', fontFamily: 'var(--font-sans)' }}
            formatter={(value: string) => <span style={{ color: 'var(--muted-foreground)', textTransform: 'capitalize' }}>{value}</span>}
          />
          <Bar dataKey="standard" stackId="a" fill={ROOM_COLORS.standard} radius={[0, 0, 0, 0]} />
          <Bar dataKey="deluxe" stackId="a" fill={ROOM_COLORS.deluxe} />
          <Bar dataKey="suite" stackId="a" fill={ROOM_COLORS.suite} />
          <Bar dataKey="executive" stackId="a" fill={ROOM_COLORS.executive} />
          <Bar dataKey="penthouse" stackId="a" fill={ROOM_COLORS.penthouse} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}