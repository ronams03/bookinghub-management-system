'use client';

import React, { useState } from 'react';
import { CUSTOMERS } from '@/lib/mockData';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortKey = 'totalSpend' | 'totalBookings' | 'lastStay';
type SortDir = 'asc' | 'desc';

const TIER_STYLES: Record<string, string> = {
  Bronze: 'bg-orange-100 text-orange-700',
  Silver: 'bg-slate-100 text-slate-600',
  Gold: 'bg-yellow-100 text-yellow-700',
  Platinum: 'bg-violet-100 text-violet-700',
};

export default function TopGuestsTable() {
  const [sortKey, setSortKey] = useState<SortKey>('totalSpend');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...CUSTOMERS].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === 'number' && typeof bv === 'number'
      ? av - bv
      : String(av).localeCompare(String(bv));
    return sortDir === 'asc' ? cmp : -cmp;
  });

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

  return (
    <div className="card-base shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <h3 className="text-sm font-600 text-foreground">Top Guests by Spend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">All-time guest performance</p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-500">
          {CUSTOMERS.length} guests
        </span>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-5 py-3 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">#</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Guest</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Nationality</th>
              <th className="text-left px-4 py-3 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Loyalty</th>
              <th className="text-right px-4 py-3"><ThBtn col="totalBookings">Bookings</ThBtn></th>
              <th className="text-right px-4 py-3"><ThBtn col="totalSpend">Total Spend</ThBtn></th>
              <th className="text-left px-4 py-3"><ThBtn col="lastStay">Last Stay</ThBtn></th>
              <th className="text-right px-5 py-3 text-[11px] font-600 uppercase tracking-wider text-muted-foreground">Avg. / Stay</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((customer, i) => (
              <tr
                key={`guest-${customer.id}`}
                className={`border-b border-border hover:bg-muted/40 transition-colors ${i % 2 === 1 ? 'bg-muted/10' : ''}`}
              >
                <td className="px-5 py-3 text-xs font-700 text-muted-foreground tabular-nums">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
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
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${TIER_STYLES[customer.loyaltyTier]}`}>
                    {customer.loyaltyTier}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs font-600 text-foreground tabular-nums">{customer.totalBookings}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-700 text-foreground tabular-nums">${customer.totalSpend.toLocaleString()}</span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground tabular-nums">{customer.lastStay}</td>
                <td className="px-5 py-3 text-right">
                  <span className="text-xs font-600 text-foreground tabular-nums">
                    ${Math.round(customer.totalSpend / customer.totalBookings).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/40 border-t-2 border-border">
              <td colSpan={4} className="px-5 py-3 text-xs font-600 text-muted-foreground">Totals</td>
              <td className="px-4 py-3 text-right text-xs font-700 text-foreground tabular-nums">
                {sorted.reduce((s, c) => s + c.totalBookings, 0)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm font-700 text-foreground tabular-nums">
                  ${sorted.reduce((s, c) => s + c.totalSpend, 0).toLocaleString()}
                </span>
              </td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}