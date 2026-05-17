'use client';

import React, { useState } from 'react';
import { Calendar, TrendingUp, BarChart3, DollarSign, ArrowUpRight, ArrowDownRight, Download } from 'lucide-react';
import { toast } from 'sonner';
import RevenueTrendChart from './RevenueTrendChart';
import OccupancyBarChart from './OccupancyBarChart';
import ReportsSourceDonut from './ReportsSourceDonut';
import RoomRevenueChart from './RoomRevenueChart';
import TopGuestsTable from './TopGuestsTable';

const DATE_RANGES = [
  { id: 'dr-7d', label: 'Last 7 days' },
  { id: 'dr-30d', label: 'Last 30 days' },
  { id: 'dr-90d', label: 'Last 90 days' },
  { id: 'dr-ytd', label: 'Year to date' },
];

interface SummaryKpi {
  id: string;
  label: string;
  value: string;
  subtext: string;
  trend: 'up' | 'down';
  trendValue: string;
  icon: React.ReactNode;
  variant: 'default' | 'positive' | 'warning' | 'negative';
}

const SUMMARY_KPIS: SummaryKpi[] = [
  {
    id: 'kpi-mtd-rev',
    label: 'MTD Revenue',
    value: '$142,850',
    subtext: 'vs $128K target',
    trend: 'up',
    trendValue: '+11.6%',
    icon: <DollarSign size={16} />,
    variant: 'positive',
  },
  {
    id: 'kpi-total-bkgs',
    label: 'Total Bookings',
    value: '248',
    subtext: 'this month',
    trend: 'up',
    trendValue: '+18 vs last month',
    icon: <BarChart3 size={16} />,
    variant: 'default',
  },
  {
    id: 'kpi-revpar',
    label: 'RevPAR',
    value: '$218',
    subtext: 'revenue per avail. room',
    trend: 'up',
    trendValue: '+8.4%',
    icon: <TrendingUp size={16} />,
    variant: 'default',
  },
  {
    id: 'kpi-lead-time',
    label: 'Avg. Lead Time',
    value: '14.2 days',
    subtext: 'booking to arrival',
    trend: 'down',
    trendValue: '-2.1 days',
    icon: <Calendar size={16} />,
    variant: 'warning',
  },
];

export default function ReportsContent() {
  const [activeDateRange, setActiveDateRange] = useState('dr-30d');

  const exportPDF = () => {
    // Build a simple printable HTML and trigger browser print
    const content = `
      <html>
        <head>
          <title>BookingHub — Reports Export</title>
          <style>
            body { font-family: sans-serif; padding: 32px; color: #111; }
            h1 { font-size: 22px; margin-bottom: 4px; }
            p { color: #666; font-size: 13px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            th { background: #f4f4f5; text-align: left; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
            td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #e4e4e7; }
            .kpi { display: inline-block; background: #f4f4f5; border-radius: 8px; padding: 16px 24px; margin: 0 8px 16px 0; min-width: 140px; }
            .kpi-label { font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
            .kpi-value { font-size: 24px; font-weight: 700; margin-top: 4px; }
          </style>
        </head>
        <body>
          <h1>Reports & Analytics</h1>
          <p>Grand Azure Hotel · Exported ${new Date().toLocaleDateString()}</p>
          <div>
            <div class="kpi"><div class="kpi-label">MTD Revenue</div><div class="kpi-value">$142,850</div></div>
            <div class="kpi"><div class="kpi-label">Total Bookings</div><div class="kpi-value">248</div></div>
            <div class="kpi"><div class="kpi-label">RevPAR</div><div class="kpi-value">$218</div></div>
            <div class="kpi"><div class="kpi-label">Avg. Lead Time</div><div class="kpi-value">14.2 days</div></div>
          </div>
          <table>
            <thead><tr><th>Room Type</th><th>Revenue</th><th>Bookings</th><th>Occupancy</th></tr></thead>
            <tbody>
              <tr><td>Standard</td><td>$16,300</td><td>45</td><td>72%</td></tr>
              <tr><td>Deluxe</td><td>$23,100</td><td>38</td><td>81%</td></tr>
              <tr><td>Suite</td><td>$36,000</td><td>22</td><td>68%</td></tr>
              <tr><td>Executive</td><td>$23,900</td><td>31</td><td>79%</td></tr>
              <tr><td>Penthouse</td><td>$42,750</td><td>9</td><td>60%</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(content);
      win.document.close();
      win.focus();
      win.print();
    }
    toast.success('Report ready to print', { description: 'Use your browser\'s print dialog to save as PDF' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-700 text-foreground">Reports & Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Grand Azure Hotel · Performance insights</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Date range selector */}
          <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
            {DATE_RANGES.map(dr => (
              <button
                key={dr.id}
                onClick={() => setActiveDateRange(dr.id)}
                className={`px-3 py-1.5 text-xs font-600 rounded-md transition-all duration-150 ${activeDateRange === dr.id ? 'bg-card text-foreground shadow-card' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {dr.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportPDF}
            className="btn-ghost flex items-center gap-1.5 px-3 py-2 border border-border text-xs"
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Summary KPI cards — 4 cards, grid-cols-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {SUMMARY_KPIS.map(kpi => {
          const variantBg = {
            default: 'card-base shadow-card',
            positive: 'card-base shadow-card border-positive/20',
            warning: 'bg-warning/5 border border-warning/30 rounded-lg shadow-card',
            negative: 'bg-negative/5 border border-negative/20 rounded-lg shadow-card',
          }[kpi.variant];

          const iconBg = {
            default: 'bg-muted',
            positive: 'bg-positive/10',
            warning: 'bg-warning/10',
            negative: 'bg-negative/10',
          }[kpi.variant];

          const iconColor = {
            default: 'text-muted-foreground',
            positive: 'text-positive',
            warning: 'text-warning',
            negative: 'text-negative',
          }[kpi.variant];

          return (
            <div key={kpi.id} className={`p-5 ${variantBg}`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-600 uppercase tracking-widest text-muted-foreground">{kpi.label}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                  <span className={iconColor}>{kpi.icon}</span>
                </div>
              </div>
              <div className="text-2xl font-700 tabular-nums text-foreground mb-1">{kpi.value}</div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`flex items-center gap-0.5 text-xs font-600 ${kpi.trend === 'up' ? 'text-positive' : 'text-negative'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {kpi.trendValue}
                </span>
                <span className="text-xs text-muted-foreground">{kpi.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue trend — full width */}
      <RevenueTrendChart />

      {/* Middle row: source donut + room revenue bar */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2">
          <ReportsSourceDonut />
        </div>
        <div className="xl:col-span-3">
          <RoomRevenueChart />
        </div>
      </div>

      {/* Occupancy bar chart */}
      <OccupancyBarChart />

      {/* Top guests table */}
      <TopGuestsTable />
    </div>
  );
}