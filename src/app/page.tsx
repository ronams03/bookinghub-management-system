import React from 'react';
import AppLayout from '@/components/AppLayout';
import MetricsBentoGrid from './components/MetricsBentoGrid';
import BookingTrendChart from './components/BookingTrendChart';
import WeeklyRevenueChart from './components/WeeklyRevenueChart';
import BookingSourceDonut from './components/BookingSourceDonut';
import RecentBookingsTable from './components/RecentBookingsTable';
import ActivityFeed from './components/ActivityFeed';

export default function OverviewPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Grand Azure Hotel · Sunday, May 17, 2026</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-positive/10 text-positive px-3 py-1.5 rounded-full font-600">
            <span className="w-1.5 h-1.5 rounded-full bg-positive animate-pulse inline-block"></span>
            Live · Updated just now
          </div>
        </div>

        {/* KPI Cards */}
        <MetricsBentoGrid />

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <BookingTrendChart />
          </div>
          <div>
            <BookingSourceDonut />
          </div>
        </div>

        {/* Revenue chart */}
        <WeeklyRevenueChart />

        {/* Bottom section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2">
            <RecentBookingsTable />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}