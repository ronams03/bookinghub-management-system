'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, BedDouble, Users, DollarSign, AlertTriangle, XCircle, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Bento grid plan: 6 cards → grid-cols-4
// Row 1: Occupancy Rate (hero, spans 2 cols) + Today Arrivals (1 col) + MTD Revenue (1 col)
// Row 2: Pending Confirmations (warning, 1 col) + Cancellation Rate (1 col) + ADR (1 col) + RevPAR (1 col)

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'positive' | 'warning' | 'negative' | 'info';
  hero?: boolean;
}

function KpiCard({ label, value, subtext, trend, trendValue, icon, variant = 'default', hero = false }: KpiCardProps) {
  const variantStyles = {
    default: 'card-base shadow-card',
    positive: 'card-base shadow-card border-positive/20',
    warning: 'bg-warning/5 border border-warning/30 rounded-lg shadow-card',
    negative: 'bg-negative/5 border border-negative/20 rounded-lg shadow-card',
    info: 'card-base shadow-card border-primary/20',
  };

  const iconBg = {
    default: 'bg-muted',
    positive: 'bg-positive/10',
    warning: 'bg-warning/10',
    negative: 'bg-negative/10',
    info: 'bg-primary/10',
  };

  const iconColor = {
    default: 'text-muted-foreground',
    positive: 'text-positive',
    warning: 'text-warning',
    negative: 'text-negative',
    info: 'text-primary',
  };

  return (
    <div className={`p-5 ${variantStyles[variant]} ${hero ? 'h-full' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg[variant]}`}>
          <span className={iconColor[variant]}>{icon}</span>
        </div>
      </div>
      <div className={`${hero ? 'text-hero-stat' : 'text-3xl font-700'} tabular-nums text-foreground mb-1`}>
        {value}
      </div>
      <div className="flex items-center gap-1.5 flex-wrap">
        {trend && trendValue && (
          <span className={`flex items-center gap-0.5 text-xs font-600 ${trend === 'up' ? 'text-positive' : trend === 'down' ? 'text-negative' : 'text-muted-foreground'}`}>
            {trend === 'up' ? <ArrowUpRight size={12} /> : trend === 'down' ? <ArrowDownRight size={12} /> : null}
            {trendValue}
          </span>
        )}
        <span className="text-xs text-muted-foreground">{subtext}</span>
      </div>
    </div>
  );
}

export default function MetricsBentoGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
      {/* Row 1 */}
      {/* Hero: Occupancy Rate — spans 2 cols */}
      <div className="sm:col-span-2 lg:col-span-2 card-base shadow-card p-5 border-primary/20">
        <div className="flex items-start justify-between mb-4">
          <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">Occupancy Rate</p>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
            <BedDouble size={18} className="text-primary" />
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div>
            <div className="text-hero-stat tabular-nums text-foreground">76%</div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="flex items-center gap-0.5 text-xs font-600 text-positive">
                <ArrowUpRight size={12} /> +4.2%
              </span>
              <span className="text-xs text-muted-foreground">vs. last week</span>
            </div>
          </div>
          <div className="flex-1">
            {/* Occupancy bar */}
            <div className="space-y-1.5 mb-2">
              {[
                { label: 'Standard', pct: 72 },
                { label: 'Deluxe', pct: 81 },
                { label: 'Suite', pct: 68 },
                { label: 'Executive', pct: 79 },
              ].map(r => (
                <div key={`occ-${r.label}`} className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground w-16 shrink-0">{r.label}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-700"
                      style={{ width: `${r.pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-600 text-foreground w-8 text-right tabular-nums">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-muted-foreground">38 of 50 rooms occupied</span>
          <span className="font-600 text-positive">Target: 80%</span>
        </div>
      </div>

      {/* Today's Arrivals */}
      <Link href="/bookings-management" className="block">
        <div className="card-base shadow-card border-primary/20 p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">Today&apos;s Arrivals</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
              <Users size={18} className="text-primary" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">7</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-600 text-positive">
              <ArrowUpRight size={12} /> +2 vs yesterday
            </span>
            <span className="text-xs text-muted-foreground">check-ins scheduled</span>
          </div>
        </div>
      </Link>

      {/* MTD Revenue */}
      <Link href="/reports-analytics" className="block">
        <div className="card-base shadow-card border-positive/20 p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">MTD Revenue</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-positive/10">
              <DollarSign size={18} className="text-positive" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">$142.8K</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-600 text-positive">
              <ArrowUpRight size={12} /> +11.6%
            </span>
            <span className="text-xs text-muted-foreground">vs $128K target</span>
          </div>
        </div>
      </Link>

      {/* Row 2 */}
      {/* Pending Confirmations — warning — clickable */}
      <Link href="/bookings-management" className="block">
        <div className="bg-warning/5 border border-warning/30 rounded-lg shadow-card p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-warning">Pending Confirmations</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-warning/10">
              <AlertTriangle size={18} className="text-warning" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">3</div>
          <p className="text-xs text-warning font-500">2 expiring within 4 hours</p>
          <div className="mt-3 pt-3 border-t border-warning/20">
            <p className="text-[11px] text-muted-foreground">Oldest pending: 6h 22m ago</p>
          </div>
        </div>
      </Link>

      {/* Cancellation Rate */}
      <Link href="/reports-analytics" className="block">
        <div className="bg-negative/5 border border-negative/20 rounded-lg shadow-card p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">Cancellation Rate</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-negative/10">
              <XCircle size={18} className="text-negative" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">8.3%</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-600 text-negative">
              <ArrowUpRight size={12} /> +1.2%
            </span>
            <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
        </div>
      </Link>

      {/* ADR */}
      <Link href="/reports-analytics" className="block">
        <div className="card-base shadow-card p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">Avg. Daily Rate</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted">
              <TrendingUp size={18} className="text-muted-foreground" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">$287</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-600 text-positive">
              <ArrowUpRight size={12} /> +$14
            </span>
            <span className="text-xs text-muted-foreground">per occupied room</span>
          </div>
        </div>
      </Link>

      {/* RevPAR */}
      <Link href="/reports-analytics" className="block">
        <div className="card-base shadow-card p-5 h-full hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">RevPAR</p>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-muted">
              <BarChart2 size={18} className="text-muted-foreground" />
            </div>
          </div>
          <div className="text-3xl font-700 tabular-nums text-foreground mb-1">$218</div>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-xs font-600 text-positive">
              <ArrowUpRight size={12} /> +8.4%
            </span>
            <span className="text-xs text-muted-foreground">revenue per avail. room</span>
          </div>
        </div>
      </Link>
    </div>
  );
}