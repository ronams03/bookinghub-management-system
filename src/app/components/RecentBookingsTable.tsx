'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BOOKINGS, type Booking } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ArrowRight, X } from 'lucide-react';

export default function RecentBookingsTable() {
  const recent = BOOKINGS?.slice(0, 5);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  return (
    <>
      <div className="card-base shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="text-sm font-600 text-foreground">Recent Bookings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Last 5 reservations</p>
          </div>
          <Link
            href="/bookings-management"
            className="flex items-center gap-1 text-xs font-600 text-primary hover:text-primary/80 transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-5 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Booking ID</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Guest</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Room</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Check-in</th>
                <th className="text-left px-4 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right px-5 py-2.5 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent?.map((booking, i) => (
                <tr
                  key={`recent-${booking?.id}`}
                  onClick={() => setViewBooking(booking)}
                  className={`border-b border-border hover:bg-muted/40 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-muted/10'}`}
                >
                  <td className="px-5 py-3">
                    <span className="text-xs font-600 text-primary font-mono">{booking?.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-500 text-foreground text-xs">{booking?.guestName}</p>
                    <p className="text-[11px] text-muted-foreground">{booking?.source}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-foreground">{booking?.roomType}</p>
                    <p className="text-[11px] text-muted-foreground">Rm {booking?.roomNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground tabular-nums">{booking?.checkIn}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking?.status} size="sm" />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-600 text-foreground tabular-nums">${booking?.totalAmount?.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Booking Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setViewBooking(null)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-700 text-foreground">{viewBooking.id}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Booking Details</p>
              </div>
              <button onClick={() => setViewBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-700 text-foreground">{viewBooking.guestName}</p>
                  <p className="text-xs text-muted-foreground">{viewBooking.guestEmail}</p>
                  <p className="text-xs text-muted-foreground">{viewBooking.guestPhone}</p>
                </div>
                <StatusBadge status={viewBooking.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Room Type', value: viewBooking.roomType },
                  { label: 'Room Number', value: viewBooking.roomNumber },
                  { label: 'Check-in', value: viewBooking.checkIn },
                  { label: 'Check-out', value: viewBooking.checkOut },
                  { label: 'Nights', value: String(viewBooking.nights) },
                  { label: 'Guests', value: `${viewBooking.adults} adults${viewBooking.children > 0 ? `, ${viewBooking.children} children` : ''}` },
                  { label: 'Source', value: viewBooking.source },
                  { label: 'Payment', value: viewBooking.paymentStatus },
                ].map(item => (
                  <div key={`detail-${item.label}`} className="bg-muted/40 rounded-md px-3 py-2">
                    <p className="text-[10px] font-600 uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-600 text-foreground mt-0.5 capitalize">{item.value}</p>
                  </div>
                ))}
              </div>
              {viewBooking.specialRequests && (
                <div className="bg-muted/40 rounded-md px-3 py-2">
                  <p className="text-[10px] font-600 uppercase tracking-wider text-muted-foreground mb-1">Special Requests</p>
                  <p className="text-xs text-foreground">{viewBooking.specialRequests}</p>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Total Amount</span>
                <span className="text-xl font-700 text-foreground tabular-nums">${viewBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-between items-center">
              <Link
                href="/bookings-management"
                className="text-xs font-600 text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                onClick={() => setViewBooking(null)}
              >
                View in Bookings <ArrowRight size={12} />
              </Link>
              <button onClick={() => setViewBooking(null)} className="btn-ghost px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}