'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Eye, XCircle, Download, Calendar, X } from 'lucide-react';
import { BOOKINGS, type Booking, type BookingStatus } from '@/lib/mockData';
import { StatusBadge, PaymentBadge } from '@/components/ui/StatusBadge';
import AddBookingModal from '@/components/AddBookingModal';

const STATUS_CYCLE: BookingStatus[] = ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'no-show'];

const ALL_STATUSES: { value: BookingStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'checked-in', label: 'Checked In' },
  { value: 'checked-out', label: 'Checked Out' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no-show', label: 'No Show' },
];

type SortKey = keyof Booking | '';
type SortDir = 'asc' | 'desc';

const PAGE_SIZES = [10, 25, 50];

export default function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const cycleStatus = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;
      const idx = STATUS_CYCLE.indexOf(b.status);
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
      toast.success(`Status updated to "${next}"`, { description: `Booking ${bookingId}` });
      return { ...b, status: next };
    }));
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status: 'cancelled' as BookingStatus } : b
    ));
    toast.error('Booking cancelled', { description: bookingId });
  }, []);

  const bulkCancel = () => {
    setBookings(prev => prev.map(b =>
      selectedIds.has(b.id) ? { ...b, status: 'cancelled' as BookingStatus } : b
    ));
    toast.error(`${selectedIds.size} booking${selectedIds.size > 1 ? 's' : ''} cancelled`);
    setSelectedIds(new Set());
  };

  const filtered = useMemo(() => {
    let result = bookings;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.guestName.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.roomNumber.includes(q) ||
        b.guestEmail.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey as keyof Booking];
        const bv = b[sortKey as keyof Booking];
        if (av === undefined || bv === undefined) return 0;
        const cmp = String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [bookings, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const allSelected = paginated.length > 0 && paginated.every(b => selectedIds.has(b.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(prev => { const n = new Set(prev); paginated.forEach(b => n.delete(b.id)); return n; });
    } else {
      setSelectedIds(prev => { const n = new Set(prev); paginated.forEach(b => n.add(b.id)); return n; });
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp size={12} className="text-muted-foreground opacity-30" />;
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />;
  };

  const ThBtn = ({ col, children }: { col: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(col)}
      className="flex items-center gap-1 text-[11px] font-600 uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
    >
      {children} <SortIcon col={col} />
    </button>
  );

  const exportCSV = () => {
    const headers = ['Booking ID', 'Guest Name', 'Email', 'Phone', 'Room Type', 'Room Number', 'Check-in', 'Check-out', 'Nights', 'Adults', 'Children', 'Source', 'Status', 'Payment', 'Amount'];
    const rows = filtered.map(b => [
      b.id, b.guestName, b.guestEmail, b.guestPhone, b.roomType, b.roomNumber,
      b.checkIn, b.checkOut, b.nights, b.adults, b.children, b.source,
      b.status, b.paymentStatus, b.totalAmount,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Bookings exported', { description: `${filtered.length} records downloaded as CSV` });
  };

  return (
    <>
      <div className="card-base shadow-card overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-border space-y-3">
          {/* Row 1: search + actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by guest, ID, room..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button className="btn-ghost flex items-center gap-1.5 px-3 py-2 border border-border" onClick={exportCSV}>
                <Download size={14} /> <span className="text-xs hidden sm:inline">Export</span>
              </button>
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn-primary flex items-center gap-1.5 px-3 py-2"
              >
                <span className="text-sm">+ Add Booking</span>
              </button>
            </div>
          </div>

          {/* Row 2: status filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {ALL_STATUSES.map(s => (
              <button
                key={`filter-${s.value}`}
                onClick={() => { setStatusFilter(s.value); setPage(1); }}
                className={`
                  px-3 py-1 rounded-full text-xs font-600 transition-all duration-150 border
                  ${statusFilter === s.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-transparent text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  }
                `}
              >
                {s.label}
                {s.value !== 'all' && (
                  <span className="ml-1.5 opacity-70 tabular-nums">
                    {bookings.filter(b => b.status === s.value).length}
                  </span>
                )}
              </button>
            ))}
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                  />
                </th>
                <th className="text-left px-4 py-3"><ThBtn col="id">Booking ID</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="guestName">Guest</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="roomType">Room</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="checkIn">Check-in</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="checkOut">Check-out</ThBtn></th>
                <th className="text-center px-4 py-3"><ThBtn col="nights">Nights</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="source">Source</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="status">Status</ThBtn></th>
                <th className="text-left px-4 py-3"><ThBtn col="paymentStatus">Payment</ThBtn></th>
                <th className="text-right px-4 py-3"><ThBtn col="totalAmount">Amount</ThBtn></th>
                <th className="w-20 px-4 py-3 text-center text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar size={32} className="text-muted-foreground/40" />
                      <p className="text-sm font-600 text-foreground">No bookings found</p>
                      <p className="text-xs text-muted-foreground">Try adjusting your search or filters to find reservations</p>
                      <button
                        onClick={() => { setSearch(''); setStatusFilter('all'); }}
                        className="btn-ghost px-4 py-2 mt-1 border border-border text-xs"
                      >
                        Clear filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((booking, i) => (
                  <tr
                    key={`row-${booking.id}`}
                    className={`border-b border-border hover:bg-muted/40 transition-colors group ${i % 2 === 1 ? 'bg-muted/10' : ''} ${selectedIds.has(booking.id) ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(booking.id)}
                        onChange={() => {
                          setSelectedIds(prev => {
                            const n = new Set(prev);
                            n.has(booking.id) ? n.delete(booking.id) : n.add(booking.id);
                            return n;
                          });
                        }}
                        className="w-3.5 h-3.5 rounded accent-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-600 text-primary font-mono">{booking.id}</span>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <p className="font-500 text-foreground text-xs truncate">{booking.guestName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{booking.guestEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-foreground">{booking.roomType}</p>
                      <p className="text-[11px] text-muted-foreground">Rm {booking.roomNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-foreground tabular-nums">{booking.checkIn}</td>
                    <td className="px-4 py-3 text-xs text-foreground tabular-nums">{booking.checkOut}</td>
                    <td className="px-4 py-3 text-center text-xs font-600 text-foreground tabular-nums">{booking.nights}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{booking.source}</td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={booking.status}
                        onClick={() => cycleStatus(booking.id)}
                        size="sm"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentBadge status={booking.paymentStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-600 text-foreground tabular-nums">${booking.totalAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="relative group/btn">
                          <button
                            onClick={() => setViewBooking(booking)}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Eye size={13} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity z-10">
                            <div className="bg-foreground text-card text-[10px] font-500 px-1.5 py-0.5 rounded whitespace-nowrap">View</div>
                          </div>
                        </div>
                        <div className="relative group/btn2">
                          <button
                            onClick={() => cancelBooking(booking.id)}
                            disabled={booking.status === 'cancelled'}
                            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-negative/10 transition-colors text-muted-foreground hover:text-negative disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <XCircle size={13} />
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 pointer-events-none opacity-0 group-hover/btn2:opacity-100 transition-opacity z-10">
                            <div className="bg-foreground text-card text-[10px] font-500 px-1.5 py-0.5 rounded whitespace-nowrap">Cancel booking</div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border flex-wrap gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="px-2 py-1 rounded-md border border-input bg-background text-foreground text-xs outline-none focus:ring-2 focus:ring-ring/30"
            >
              {PAGE_SIZES.map(s => (
                <option key={`ps-${s}`} value={s}>{s}</option>
              ))}
            </select>
            <span className="tabular-nums">
              {filtered.length === 0 ? '0' : `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, filtered.length)}`} of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-600"
            >
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={`page-${pageNum}`}
                  onClick={() => setPage(pageNum)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-600 transition-colors ${page === pageNum ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed text-xs font-600"
            >
              »
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 slide-up">
          <div className="bg-foreground text-card rounded-xl shadow-modal px-5 py-3 flex items-center gap-4">
            <span className="text-sm font-600">{selectedIds.size} selected</span>
            <div className="w-px h-4 bg-card/20" />
            <button
              onClick={bulkCancel}
              className="flex items-center gap-1.5 text-sm font-600 text-negative hover:text-red-300 transition-colors"
            >
              <XCircle size={14} /> Cancel Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="flex items-center gap-1.5 text-sm text-card/60 hover:text-card transition-colors"
            >
              <X size={14} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      <AddBookingModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={(booking) => {
          // BACKEND INTEGRATION POINT: refresh bookings list after creation
          setBookings(prev => [{
            id: booking.id,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            roomType: booking.roomType as import('@/lib/mockData').RoomType,
            roomNumber: booking.roomNumber || 'TBD',
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            nights: Math.max(1, Math.round((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86400000)),
            adults: booking.adults,
            children: booking.children,
            totalAmount: 0,
            status: 'pending' as BookingStatus,
            paymentStatus: booking.paymentStatus as import('@/lib/mockData').PaymentStatus,
            source: booking.source as import('@/lib/mockData').BookingSource,
            specialRequests: booking.specialRequests,
            createdAt: new Date().toISOString(),
          }, ...prev]);
        }}
      />

      {/* View Booking Modal */}
      {viewBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm fade-in" onClick={() => setViewBooking(null)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-lg scale-in overflow-hidden">
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
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setViewBooking(null)} className="btn-ghost px-4 py-2">Close</button>
              <button
                onClick={() => { cancelBooking(viewBooking.id); setViewBooking(null); }}
                disabled={viewBooking.status === 'cancelled'}
                className="flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-600 text-negative bg-negative/10 hover:bg-negative/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <XCircle size={14} /> Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}