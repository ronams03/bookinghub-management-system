'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { BOOKING_SOURCE_DATA } from '@/lib/mockData';
import { ChartSkeleton } from '@/components/ui/LoadingSkeleton';

const PieChart = dynamic(() => import('recharts').then(m => ({ default: m.PieChart })), { ssr: false, loading: () => <ChartSkeleton height={200} /> });
const Pie = dynamic(() => import('recharts').then(m => ({ default: m.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(m => ({ default: m.Cell })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(m => ({ default: m.ResponsiveContainer })), { ssr: false });

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="card-base shadow-dropdown px-3 py-2 text-xs">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: payload[0].payload.color }} />
        <span className="font-600 text-foreground">{payload[0].name}</span>
      </div>
      <p className="text-muted-foreground">{payload[0].value}% of bookings</p>
    </div>
  );
}

export default function ReportsSourceDonut() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = BOOKING_SOURCE_DATA.reduce((s, d) => s + d.value, 0);

  return (
    <div className="card-base shadow-card p-5 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-600 text-foreground">Booking Channel Mix</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Source distribution — MTD</p>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={BOOKING_SOURCE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {BOOKING_SOURCE_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-rpt-${entry.name}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.45}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-2xl font-700 text-foreground tabular-nums">{total}%</p>
            <p className="text-[10px] text-muted-foreground">Total</p>
          </div>
        </div>
        <div className="w-full space-y-2 mt-3">
          {BOOKING_SOURCE_DATA.map((item, i) => (
            <div
              key={`rpt-src-${item.name}`}
              className="flex items-center gap-2 text-xs cursor-default"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="flex-1 text-muted-foreground">{item.name}</span>
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mx-2">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.value}%`, background: item.color }}
                />
              </div>
              <span className="font-600 text-foreground tabular-nums w-8 text-right">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}