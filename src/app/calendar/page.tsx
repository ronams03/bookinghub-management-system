'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { BOOKINGS } from '@/lib/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const STATUS_DOT: Record<string, string> = {
  confirmed: 'bg-primary',
  pending: 'bg-warning',
  cancelled: 'bg-negative',
  'checked-in': 'bg-positive',
  'checked-out': 'bg-muted-foreground',
  'no-show': 'bg-secondary-foreground',
};

interface DayBooking {
  id: string;
  guestName: string;
  roomType: string;
  status: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  roomNumber: string;
  nights: number;
  guestEmail: string;
  guestPhone: string;
  paymentStatus: string;
  source: string;
  specialRequests: string;
}

export default function CalendarPage() {
  const today = new Date(2026, 4, 17); // May 17, 2026
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<DayBooking | null>(null);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  const getBookingsForDay = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return BOOKINGS.filter(b => b.checkIn === dateStr || b.checkOut === dateStr);
  };

  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : [];

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Calendar</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Booking schedule · Grand Azure Hotel</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Legend */}
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
              {[
                { label: 'Check-in', color: 'bg-primary' },
                { label: 'Check-out', color: 'bg-accent' },
                { label: 'Pending', color: 'bg-warning' },
                { label: 'Cancelled', color: 'bg-negative' },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${l.color}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Calendar grid */}
          <div className="xl:col-span-2 card-base shadow-card overflow-hidden">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft size={16} />
              </button>
              <h2 className="text-base font-700 text-foreground">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </h2>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS_OF_WEEK.map(d => (
                <div key={d} className="py-2 text-center text-[11px] font-600 uppercase tracking-wider text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {cells.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-20 border-b border-r border-border bg-muted/20" />;
                }
                const dayBookings = getBookingsForDay(day);
                const isSelected = selectedDay === day;
                const isTodayDay = isToday(day);

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`h-20 border-b border-r border-border p-1.5 cursor-pointer transition-colors overflow-hidden
                      ${isSelected ? 'bg-primary/5 border-primary/30' : 'hover:bg-muted/40'}
                      ${(idx + 1) % 7 === 0 ? 'border-r-0' : ''}
                    `}
                  >
                    <div className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-600 mb-1
                      ${isTodayDay ? 'bg-primary text-primary-foreground' : 'text-foreground'}
                    `}>
                      {day}
                    </div>
                    <div className="space-y-0.5">
                      {dayBookings.slice(0, 2).map(b => (
                        <div
                          key={`cal-${b.id}-${day}`}
                          className="flex items-center gap-1 truncate"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[b.status] || 'bg-muted-foreground'}`} />
                          <span className="text-[10px] text-foreground truncate leading-tight">{b.guestName.split(' ')[0]}</span>
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <span className="text-[10px] text-muted-foreground">+{dayBookings.length - 2} more</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side panel */}
          <div className="card-base shadow-card overflow-hidden">
            {selectedDay ? (
              <>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <div>
                    <h3 className="text-sm font-600 text-foreground">
                      {MONTH_NAMES[viewMonth]} {selectedDay}, {viewYear}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedDayBookings.length} booking{selectedDayBookings.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="divide-y divide-border overflow-y-auto max-h-[500px] scrollbar-thin">
                  {selectedDayBookings.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <p className="text-sm text-muted-foreground">No bookings on this day</p>
                    </div>
                  ) : (
                    selectedDayBookings.map(b => {
                      const isCheckIn = b.checkIn === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
                      return (
                        <div
                          key={`panel-${b.id}`}
                          className="px-5 py-3.5 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => setSelectedBooking(b as DayBooking)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div>
                              <p className="text-sm font-600 text-foreground">{b.guestName}</p>
                              <p className="text-xs text-muted-foreground font-mono">{b.id}</p>
                            </div>
                            <StatusBadge status={b.status} size="sm" />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{b.roomType} · Rm {b.roomNumber}</span>
                            <span className={`font-600 ${isCheckIn ? 'text-primary' : 'text-accent'}`}>
                              {isCheckIn ? '↓ Check-in' : '↑ Check-out'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs font-600 text-foreground tabular-nums">
                            ${b.totalAmount.toLocaleString()}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="px-5 py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <ChevronRight size={20} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-600 text-foreground">Select a day</p>
                <p className="text-xs text-muted-foreground mt-1">Click any date to view bookings</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking detail modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedBooking(null)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-700 text-foreground">{selectedBooking.id}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Booking Details</p>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-700 text-foreground">{selectedBooking.guestName}</p>
                  <p className="text-xs text-muted-foreground">{selectedBooking.guestEmail}</p>
                </div>
                <StatusBadge status={selectedBooking.status as import('@/lib/mockData').BookingStatus} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Room Type', value: selectedBooking.roomType },
                  { label: 'Room Number', value: selectedBooking.roomNumber },
                  { label: 'Check-in', value: selectedBooking.checkIn },
                  { label: 'Check-out', value: selectedBooking.checkOut },
                  { label: 'Nights', value: String(selectedBooking.nights) },
                  { label: 'Source', value: selectedBooking.source },
                ].map(item => (
                  <div key={`modal-${item.label}`} className="bg-muted/40 rounded-md px-3 py-2">
                    <p className="text-[10px] font-600 uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-600 text-foreground mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-xs text-muted-foreground">Total Amount</span>
                <span className="text-xl font-700 text-foreground tabular-nums">${selectedBooking.totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button onClick={() => setSelectedBooking(null)} className="btn-ghost px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
