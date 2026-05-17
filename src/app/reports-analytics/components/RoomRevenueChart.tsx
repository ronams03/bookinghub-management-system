'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ROOM_TYPE_REVENUE } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const BarChart = dynamic(() => import('recharts').then(m => ({ default: m.BarChart })), { ssr: false, loading: () => <ChartSkeleton height={240} /> });
const Bar = dynamic(() => import('recharts').then(m => ({ default: m.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

const ROOM_COLORS = ['#94a3b8', 'var(--accent)', 'var(--primary)', '#16a34a', '#7c3aed'];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload: { bookings: number; occupancy: number } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card-base shadow-dropdown px-3 py-2.5 text-xs min-w-[150px]">
      <p className="font-600 text-foreground mb-2">{label}</p>
      <div className="space-y-1">
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Revenue</span>
          <span className="font-600 text-foreground tabular-nums">${payload[0].value.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Bookings</span>
          <span className="font-600 text-foreground tabular-nums">{d.bookings}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span className="text-muted-foreground">Occupancy</span>
          <span className="font-600 text-foreground tabular-nums">{d.occupancy}%</span>
        </div>
      </div>
    </div>
  );
}

export default function RoomRevenueChart() {
  return (
    <div className="card-base shadow-card p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-600 text-foreground">Revenue by Room Type</h3>
          <p className="text-xs text-muted-foreground mt-0.5">MTD performance comparison</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total MTD</p>
          <p className="text-base font-700 text-foreground tabular-nums">
            ${ROOM_TYPE_REVENUE.reduce((s, r) => s + r.revenue, 0).toLocaleString()}
          </p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={ROOM_TYPE_REVENUE} margin={{ top: 4, right: 4, bottom: 0, left: 0 }} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="room"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
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
          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {ROOM_TYPE_REVENUE.map((entry, index) => (
              <Cell key={`cell-room-${entry.room}`} fill={ROOM_COLORS[index % ROOM_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {/* Legend row */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {ROOM_TYPE_REVENUE.map((r, i) => (
          <div key={`room-leg-${r.room}`} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: ROOM_COLORS[i % ROOM_COLORS.length] }} />
            <span className="text-muted-foreground">{r.room}</span>
            <span className="font-600 text-foreground tabular-nums">{r.occupancy}% occ.</span>
          </div>
        ))}
      </div>
    </div>
  );
}