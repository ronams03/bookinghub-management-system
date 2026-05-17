'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { BOOKING_TREND_DATA } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const AreaChart = dynamic(() => import('recharts').then(m => ({ default: m.AreaChart })), { ssr: false, loading: () => <ChartSkeleton height={240} /> });
const Area = dynamic(() => import('recharts').then(m => ({ default: m.Area })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => ({ default: m.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => ({ default: m.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(m => ({ default: m.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

type Metric = 'bookings' | 'revenue';

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-dropdown px-3 py-2 text-xs">
      <p className="font-600 text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={`tt-${i}`} className="text-muted-foreground">
          {p.name === 'bookings' ? 'Bookings' : 'Revenue'}:{' '}
          <span className="font-600 text-foreground">
            {p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.value}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function BookingTrendChart() {
  const [metric, setMetric] = useState<Metric>('bookings');
  const showData = BOOKING_TREND_DATA.filter((_, i) => i % 2 === 0);

  return (
    <div className="card-base shadow-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-600 text-foreground">Booking Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 30 days</p>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
          {(['bookings', 'revenue'] as Metric[]).map(m => (
            <button
              key={`metric-${m}`}
              onClick={() => setMetric(m)}
              className={`px-3 py-1.5 text-xs font-600 rounded-md transition-all duration-150 ${metric === m ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {m === 'bookings' ? 'Bookings' : 'Revenue'}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={showData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.18} />
              <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontFamily: 'var(--font-sans)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => metric === 'revenue' ? `$${(v / 1000).toFixed(0)}k` : String(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={metric}
            stroke={metric === 'bookings' ? 'var(--primary)' : 'var(--accent)'}
            strokeWidth={2}
            fill={metric === 'bookings' ? 'url(#bookingGrad)' : 'url(#revenueGrad)'}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: metric === 'bookings' ? 'var(--primary)' : 'var(--accent)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}