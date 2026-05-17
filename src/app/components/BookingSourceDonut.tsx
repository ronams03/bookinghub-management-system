'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { BOOKING_SOURCE_DATA } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const PieChart = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })), { ssr: false, loading: () => <ChartSkeleton height={180} /> });
const Pie = dynamic(() => import('recharts').then(m => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-dropdown px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: payload[0].payload.color }} />
        <span className="font-600 text-foreground">{payload[0].name}</span>
      </div>
      <p className="text-muted-foreground mt-0.5">{payload[0].value}% of bookings</p>
    </div>
  );
}

export default function BookingSourceDonut() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="card-base shadow-card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-600 text-foreground">Booking Sources</h3>
        <p className="text-xs text-muted-foreground mt-0.5">MTD distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={BOOKING_SOURCE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {BOOKING_SOURCE_DATA.map((entry, index) => (
              <Cell
                key={`cell-source-${entry.name}`}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-2">
        {BOOKING_SOURCE_DATA.map((item, i) => (
          <div
            key={`src-legend-${item.name}`}
            className="flex items-center justify-between text-xs"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-600 text-foreground tabular-nums">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}