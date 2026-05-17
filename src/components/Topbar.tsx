'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Plus, X, BookOpen, Users, BarChart3, Settings, HelpCircle, LogOut, Check } from 'lucide-react';
import { BOOKINGS } from '@/lib/mockData';
import Link from 'next/link';

interface TopbarProps {
  onNewBooking: () => void;
}

const NOTIFICATIONS = [
  { id: 'notif-1', type: 'warning', title: 'Pending booking expiring', message: 'BKG-2026-0455 expires in 4 hours', time: '2 min ago', read: false },
  { id: 'notif-2', type: 'success', title: 'Check-in completed', message: 'Priya Nair checked into Room 412', time: '18 min ago', read: false },
  { id: 'notif-3', type: 'info', title: 'New booking received', message: 'Oliver Strauss · 3 nights · Standard', time: '41 min ago', read: false },
  { id: 'notif-4', type: 'error', title: 'Booking cancelled', message: 'Charlotte Beaumont cancelled BKG-2026-0459', time: '1h ago', read: true },
  { id: 'notif-5', type: 'success', title: 'Payment received', message: '$1,290 for Marcus Holloway', time: '2h ago', read: true },
];

const NOTIF_STYLES: Record<string, string> = {
  warning: 'bg-warning/10 text-warning',
  success: 'bg-positive/10 text-positive',
  info: 'bg-primary/10 text-primary',
  error: 'bg-negative/10 text-negative',
};

export default function Topbar({ onNewBooking }: TopbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const inputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const searchResults = searchQuery.length > 1
    ? BOOKINGS.filter(b =>
        b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.roomNumber.includes(searchQuery)
      ).slice(0, 5)
    : [];

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); setNotifOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const statusClass = (status: string) => {
    const map: Record<string, string> = {
      'confirmed': 'status-badge-confirmed',
      'pending': 'status-badge-pending',
      'cancelled': 'status-badge-cancelled',
      'checked-in': 'status-badge-checkedin',
      'checked-out': 'status-badge-checkedout',
      'no-show': 'status-badge-noshow',
    };
    return map[status] || 'status-badge-pending';
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-4 gap-3 shrink-0 relative z-30">
      {/* Search bar */}
      <div className="flex-1 max-w-md relative">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors text-sm"
        >
          <Search size={15} />
          <span className="flex-1 text-left text-sm">Search bookings, guests...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-500 bg-card border border-border rounded px-1.5 py-0.5">
            <span>⌘</span><span>K</span>
          </kbd>
        </button>

        {/* Search dropdown */}
        {searchOpen && (
          <div className="absolute top-0 left-0 right-0 bg-card border border-border rounded-lg shadow-modal z-50 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
              <Search size={15} className="text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search bookings, guests, rooms..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
            {searchQuery.length > 1 && (
              <div className="max-h-64 overflow-y-auto scrollbar-thin">
                {searchResults.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No bookings found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div>
                    <p className="px-3 py-1.5 text-[10px] font-600 uppercase tracking-widest text-muted-foreground bg-muted/50">
                      Bookings
                    </p>
                    {searchResults.map(b => (
                      <Link
                        key={`search-${b.id}`}
                        href="/bookings-management"
                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                      >
                        <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                          <BookOpen size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-600 text-foreground truncate">{b.guestName}</p>
                          <p className="text-xs text-muted-foreground">{b.id} · Room {b.roomNumber}</p>
                        </div>
                        <span className={`text-[11px] font-600 px-2 py-0.5 rounded-full ${statusClass(b.status)}`}>
                          {b.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            {searchQuery.length <= 1 && (
              <div className="px-3 py-3 space-y-1">
                <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground pb-1">Quick Links</p>
                {[
                  { label: 'All Bookings', icon: <BookOpen size={14} />, href: '/bookings-management' },
                  { label: 'Customers', icon: <Users size={14} />, href: '/customers' },
                  { label: 'Reports', icon: <BarChart3 size={14} />, href: '/reports-analytics' },
                ].map(link => (
                  <Link
                    key={`quick-${link.label}`}
                    href={link.href}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer transition-colors text-sm text-secondary-foreground hover:text-foreground"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  >
                    <span className="text-muted-foreground">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* New Booking button */}
        <button
          onClick={onNewBooking}
          className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Booking</span>
          <kbd className="hidden md:flex items-center text-[10px] opacity-70 bg-white/20 rounded px-1">N</kbd>
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-negative" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-modal z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-700 text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-700 bg-negative text-white rounded-full px-1.5 py-0.5 min-w-[20px] text-center tabular-nums">
                      {unreadCount}
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs font-600 text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                  >
                    <Check size={11} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-border">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer ${!n.read ? 'bg-primary/3' : ''}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${NOTIF_STYLES[n.type]}`}>
                      <Bell size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-xs font-600 text-foreground ${!n.read ? 'font-700' : ''}`}>{n.title}</p>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button
                  onClick={() => setNotifOpen(false)}
                  className="w-full text-xs font-600 text-primary hover:text-primary/80 transition-colors text-center py-1"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar / Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-700 text-sm cursor-pointer hover:bg-primary/20 transition-colors"
          >
            GM
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-modal z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-700 text-foreground">Grace Mitchell</p>
                <p className="text-xs text-muted-foreground">General Manager</p>
                <p className="text-xs text-muted-foreground mt-0.5">grace@grandazure.com</p>
              </div>
              <div className="py-1">
                {[
                  { label: 'Settings', icon: <Settings size={14} />, href: null },
                  { label: 'Help & Support', icon: <HelpCircle size={14} />, href: null },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-secondary-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <span className="text-muted-foreground">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-border py-1">
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-negative hover:bg-negative/5 transition-colors"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for search */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40"
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        />
      )}
    </header>
  );
}