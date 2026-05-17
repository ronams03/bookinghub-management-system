'use client';

import React, { useState, useMemo } from 'react';
import AppLayout from '@/components/AppLayout';
import { CUSTOMERS, BOOKINGS, type Customer } from '@/lib/mockData';
import { Search, X, ChevronUp, ChevronDown, Star, Users } from 'lucide-react';

const TIER_STYLES: Record<string, string> = {
  Bronze: 'bg-amber-100 text-amber-700 border border-amber-200',
  Silver: 'bg-slate-100 text-slate-600 border border-slate-200',
  Gold: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  Platinum: 'bg-purple-100 text-purple-700 border border-purple-200',
};

const TIER_ORDER = ['Bronze', 'Silver', 'Gold', 'Platinum'];

type SortKey = keyof Customer | '';
type SortDir = 'asc' | 'desc';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('totalSpend');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let result = CUSTOMERS;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }
    if (tierFilter !== 'all') {
      result = result.filter(c => c.loyaltyTier === tierFilter);
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const av = a[sortKey as keyof Customer];
        const bv = b[sortKey as keyof Customer];
        if (av === undefined || bv === undefined) return 0;
        const cmp = typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [search, tierFilter, sortKey, sortDir]);

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

  const customerBookings = selectedCustomer
    ? BOOKINGS.filter(b => b.guestEmail === selectedCustomer.email)
    : [];

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-700 text-foreground">Customers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Guest profiles & loyalty · Grand Azure Hotel</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full font-600">
            <Users size={13} />
            {CUSTOMERS.length} guests
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TIER_ORDER.map(tier => {
            const count = CUSTOMERS.filter(c => c.loyaltyTier === tier).length;
            return (
              <button
                key={tier}
                onClick={() => setTierFilter(tierFilter === tier ? 'all' : tier)}
                className={`card-base shadow-card p-4 text-left transition-all hover:shadow-md ${tierFilter === tier ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${TIER_STYLES[tier]}`}>{tier}</span>
                  <Star size={14} className="text-muted-foreground" />
                </div>
                <p className="text-2xl font-700 text-foreground tabular-nums">{count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">guests</p>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="card-base shadow-card overflow-hidden">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, email, phone..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={13} />
                </button>
              )}
            </div>
            <span className="ml-auto text-xs text-muted-foreground tabular-nums">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="text-left px-5 py-3"><ThBtn col="name">Guest</ThBtn></th>
                  <th className="text-left px-4 py-3"><ThBtn col="nationality">Country</ThBtn></th>
                  <th className="text-center px-4 py-3"><ThBtn col="totalBookings">Bookings</ThBtn></th>
                  <th className="text-right px-4 py-3"><ThBtn col="totalSpend">Total Spend</ThBtn></th>
                  <th className="text-left px-4 py-3"><ThBtn col="lastStay">Last Stay</ThBtn></th>
                  <th className="text-left px-4 py-3"><ThBtn col="loyaltyTier">Tier</ThBtn></th>
                  <th className="w-20 px-4 py-3 text-center text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center">
                      <p className="text-sm font-600 text-foreground">No customers found</p>
                      <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((customer, i) => (
                    <tr
                      key={customer.id}
                      className={`border-b border-border hover:bg-muted/40 transition-colors cursor-pointer ${i % 2 === 1 ? 'bg-muted/10' : ''}`}
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-xs shrink-0">
                            {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-600 text-foreground text-xs">{customer.name}</p>
                            <p className="text-[11px] text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{customer.nationality}</td>
                      <td className="px-4 py-3 text-center text-xs font-600 text-foreground tabular-nums">{customer.totalBookings}</td>
                      <td className="px-4 py-3 text-right text-sm font-600 text-foreground tabular-nums">${customer.totalSpend.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-foreground tabular-nums">{customer.lastStay}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${TIER_STYLES[customer.loyaltyTier]}`}>
                          {customer.loyaltyTier}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={e => { e.stopPropagation(); setSelectedCustomer(customer); }}
                          className="text-xs font-600 text-primary hover:text-primary/80 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Customer detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h2 className="text-base font-700 text-foreground">{selectedCustomer.name}</h2>
                  <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${TIER_STYLES[selectedCustomer.loyaltyTier]}`}>
                    {selectedCustomer.loyaltyTier} Member
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 space-y-5">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Email', value: selectedCustomer.email },
                  { label: 'Phone', value: selectedCustomer.phone },
                  { label: 'Nationality', value: selectedCustomer.nationality },
                  { label: 'Last Stay', value: selectedCustomer.lastStay },
                ].map(item => (
                  <div key={item.label} className="bg-muted/40 rounded-md px-3 py-2">
                    <p className="text-[10px] font-600 uppercase tracking-wider text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-600 text-foreground mt-0.5 break-all">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-primary/5 border border-primary/20 rounded-md px-3 py-3 text-center">
                  <p className="text-2xl font-700 text-primary tabular-nums">{selectedCustomer.totalBookings}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Bookings</p>
                </div>
                <div className="bg-positive/5 border border-positive/20 rounded-md px-3 py-3 text-center">
                  <p className="text-2xl font-700 text-positive tabular-nums">${selectedCustomer.totalSpend.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Total Spend</p>
                </div>
              </div>

              {/* Booking history */}
              {customerBookings.length > 0 && (
                <div>
                  <h3 className="text-xs font-600 uppercase tracking-widest text-muted-foreground mb-3">Booking History</h3>
                  <div className="space-y-2">
                    {customerBookings.map(b => (
                      <div key={b.id} className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2.5">
                        <div>
                          <p className="text-xs font-600 text-primary font-mono">{b.id}</p>
                          <p className="text-[11px] text-muted-foreground">{b.roomType} · {b.checkIn} → {b.checkOut}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-600 text-foreground tabular-nums">${b.totalAmount.toLocaleString()}</p>
                          <span className={`text-[10px] font-600 capitalize ${b.status === 'confirmed' || b.status === 'checked-in' ? 'text-positive' : b.status === 'cancelled' ? 'text-negative' : 'text-muted-foreground'}`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end shrink-0">
              <button onClick={() => setSelectedCustomer(null)} className="btn-ghost px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
