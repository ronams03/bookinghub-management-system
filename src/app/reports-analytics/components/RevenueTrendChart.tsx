'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const AreaChart = dynamic(() => import('recharts').then(m => ({ default: m.AreaChart })), { ssr: false, loading: () => <ChartSkeleton height={280} /> });
const Area = dynamic(() => import('recharts').then(m => ({ default: m.Area })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then(m => ({ default: m.ReferenceLine })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

const REVENUE_90D = [
  { date: 'Feb 16', revenue: 3840, target: 4200 },
  { date: 'Feb 23', revenue: 4120, target: 4200 },
  { date: 'Mar 02', revenue: 5200, target: 4500 },
  { date: 'Mar 09', revenue: 4780, target: 4500 },
  { date: 'Mar 16', revenue: 6100, target: 5000 },
  { date: 'Mar 23', revenue: 5640, target: 5000 },
  { date: 'Mar 30', revenue: 4900, target: 5000 },
  { date: 'Apr 06', revenue: 6800, target: 5500 },
  { date: 'Apr 13', revenue: 7200, target: 5500 },
  { date: 'Apr 20', revenue: 6400, target: 5800 },
  { date: 'Apr 27', revenue: 8100, target: 6000 },
  { date: 'May 04', revenue: 7600, target: 6200 },
  { date: 'May 11', revenue: 9200, target: 6500 },
  { date: 'May 17', revenue: 8640, target: 6500 },
];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-dropdown px-3 py-2.5 text-xs min-w-[140px]">
      <p className="font-600 text-foreground mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={`rev90-tt-${i}`} className="flex items-center justify-between gap-3 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span className="text-muted-foreground capitalize">{p.name === 'revenue' ? 'Revenue' : 'Target'}</span>
          </div>
          <span className="font-600 text-foreground tabular-nums">${p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueTrendChart() {
  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-600 text-foreground">Revenue Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Weekly revenue vs. target — last 90 days</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-primary rounded-full inline-block" />
            <span className="text-muted-foreground">Actual Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-accent rounded-full inline-block" style={{ borderTop: '2px dashed var(--accent)', background: 'none', display: 'inline-block', width: '12px' }} />
            <span className="text-muted-foreground">Target</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={REVENUE_90D} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="revGrad90" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.08} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            interval={1}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="target"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fill="url(#targetGrad)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--primary)"
            strokeWidth={2.5}
            fill="url(#revGrad90)"
            dot={false}
            activeDot={{ r: 5, strokeWidth: 0, fill: 'var(--primary)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}