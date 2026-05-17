import React from 'react';
import AppLayout from '@/components/AppLayout';
import BookingsTable from './components/BookingsTable';

export default function BookingsManagementPage() {
  return (
    <AppLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Bookings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage all reservations · Grand Azure Hotel</p>
          </div>
        </div>
        <BookingsTable />
      </div>
    </AppLayout>
  );
}