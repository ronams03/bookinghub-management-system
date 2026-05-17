'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  BarChart3,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Hotel,
  X,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'nav-overview', label: 'Overview', href: '/', icon: <LayoutDashboard size={20} /> },
  { id: 'nav-bookings', label: 'Bookings', href: '/bookings-management', icon: <BookOpen size={20} />, badge: 3 },
  { id: 'nav-calendar', label: 'Calendar', href: '/calendar', icon: <CalendarDays size={20} /> },
  { id: 'nav-customers', label: 'Customers', href: '/customers', icon: <Users size={20} /> },
  { id: 'nav-reports', label: 'Reports', href: '/reports-analytics', icon: <BarChart3 size={20} /> },
];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (val: boolean) => void;
}

const HELP_TOPICS = [
  { title: 'Getting Started', desc: 'Learn the basics of BookingHub' },
  { title: 'Managing Bookings', desc: 'Create, edit, and cancel reservations' },
  { title: 'Reports & Analytics', desc: 'Understand your performance data' },
  { title: 'Contact Support', desc: 'Reach our team at support@bookinghub.io' },
];

const NOTIF_STYLES: Record<string, string> = {
  warning: 'bg-warning/10 text-warning',
  success: 'bg-positive/10 text-positive',
  info: 'bg-primary/10 text-primary',
  error: 'bg-negative/10 text-negative',
};

export default function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside
        className={`
          flex flex-col h-screen bg-card border-r border-border
          sidebar-transition overflow-hidden shrink-0
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-border px-3 shrink-0 ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="flex items-center gap-2 min-w-0">
            <AppLogo size={32} />
            {!collapsed && (
              <span className="font-bold text-base text-foreground tracking-tight truncate">
                BookingHub
              </span>
            )}
          </div>
        </div>

        {/* Property selector */}
        {!collapsed && (
          <div className="px-3 py-3 border-b border-border">
            <button className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted transition-colors text-left group">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Hotel size={14} className="text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-600 text-foreground truncate">Grand Azure Hotel</p>
                <p className="text-[11px] text-muted-foreground truncate">San Francisco, CA</p>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </button>
          </div>
        )}

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 scrollbar-thin">
          <div className="space-y-0.5">
            {!collapsed && (
              <p className="text-[10px] font-600 uppercase tracking-widest text-muted-foreground px-2 pb-1.5 pt-1">
                Main Menu
              </p>
            )}
            {NAV_ITEMS.map((item) => (
              <div key={item.id} className="relative group">
                <Link
                  href={item.href}
                  className={`
                    flex items-center rounded-md transition-all duration-150
                    ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-2.5 py-2.5'}
                    ${isActive(item.href)
                      ? 'bg-primary/10 text-primary font-600' : 'text-secondary-foreground hover:bg-muted hover:text-foreground font-500'
                    }
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="text-sm flex-1">{item.label}</span>
                      {item.badge !== undefined && (
                        <span className="text-[11px] font-700 bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[20px] text-center tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
                {/* Tooltip for collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <div className="bg-foreground text-card text-xs font-500 px-2 py-1 rounded-md whitespace-nowrap shadow-dropdown flex items-center gap-1.5">
                      {item.label}
                      {item.badge !== undefined && (
                        <span className="bg-primary text-primary-foreground rounded-full px-1 text-[10px] font-700">{item.badge}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Bottom section */}
        <div className="px-2 py-2 border-t border-border space-y-0.5">
          {/* Notifications */}
          <div className="relative group">
            <button
              onClick={() => setNotifOpen(true)}
              className={`flex items-center rounded-md transition-all duration-150 text-secondary-foreground hover:bg-muted hover:text-foreground ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-2.5 py-2 w-full'}`}
            >
              <span className="shrink-0"><Bell size={20} /></span>
              {!collapsed && (
                <>
                  <span className="text-sm font-500 flex-1 text-left">Notifications</span>
                  <span className="text-[11px] font-700 bg-negative/10 text-negative rounded-full px-1.5 py-0.5 min-w-[20px] text-center">5</span>
                </>
              )}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="bg-foreground text-card text-xs font-500 px-2 py-1 rounded-md whitespace-nowrap shadow-dropdown">Notifications</div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative group">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`flex items-center rounded-md transition-all duration-150 text-secondary-foreground hover:bg-muted hover:text-foreground ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-2.5 py-2 w-full'}`}
            >
              <span className="shrink-0"><Settings size={20} /></span>
              {!collapsed && <span className="text-sm font-500 flex-1 text-left">Settings</span>}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="bg-foreground text-card text-xs font-500 px-2 py-1 rounded-md whitespace-nowrap shadow-dropdown">Settings</div>
              </div>
            )}
          </div>

          {/* Help */}
          <div className="relative group">
            <button
              onClick={() => setHelpOpen(true)}
              className={`flex items-center rounded-md transition-all duration-150 text-secondary-foreground hover:bg-muted hover:text-foreground ${collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-2.5 py-2 w-full'}`}
            >
              <span className="shrink-0"><HelpCircle size={20} /></span>
              {!collapsed && <span className="text-sm font-500 flex-1 text-left">Help & Support</span>}
            </button>
            {collapsed && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <div className="bg-foreground text-card text-xs font-500 px-2 py-1 rounded-md whitespace-nowrap shadow-dropdown">Help & Support</div>
              </div>
            )}
          </div>

          {/* User profile */}
          <div className={`flex items-center mt-1 pt-2 border-t border-border ${collapsed ? 'justify-center' : 'gap-2 px-1'}`}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-700 text-sm">
              GM
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-600 text-foreground truncate">Grace Mitchell</p>
                <p className="text-[11px] text-muted-foreground truncate">General Manager</p>
              </div>
            )}
            {!collapsed && (
              <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <LogOut size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => onCollapse(!collapsed)}
          className="flex items-center justify-center h-9 border-t border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* Help Modal */}
      {helpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setHelpOpen(false)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-700 text-foreground">Help & Support</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Find answers and get assistance</p>
              </div>
              <button onClick={() => setHelpOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-3">
              {HELP_TOPICS.map(topic => (
                <div key={topic.title} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <HelpCircle size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-600 text-foreground">{topic.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button onClick={() => setHelpOpen(false)} className="btn-ghost px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setSettingsOpen(false)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-700 text-foreground">Settings</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Manage your preferences</p>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Property Name', value: 'Grand Azure Hotel', type: 'text' },
                { label: 'Location', value: 'San Francisco, CA', type: 'text' },
                { label: 'Currency', value: 'USD ($)', type: 'select', options: ['USD ($)', 'EUR (€)', 'GBP (£)'] },
                { label: 'Timezone', value: 'America/Los_Angeles', type: 'select', options: ['America/Los_Angeles', 'America/New_York', 'Europe/London'] },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-xs font-600 text-foreground mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow">
                      {field.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end gap-2">
              <button onClick={() => setSettingsOpen(false)} className="btn-ghost px-4 py-2">Cancel</button>
              <button onClick={() => setSettingsOpen(false)} className="btn-primary px-4 py-2">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {notifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
          <div className="relative bg-card rounded-xl shadow-modal w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-700 text-foreground">Notifications</h2>
              <button onClick={() => setNotifOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground">
                <X size={16} />
              </button>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto scrollbar-thin">
              {[
                { title: 'Pending booking expiring', message: 'BKG-2026-0455 expires in 4 hours', time: '2 min ago', type: 'warning' },
                { title: 'Check-in completed', message: 'Priya Nair checked into Room 412', time: '18 min ago', type: 'success' },
                { title: 'New booking received', message: 'Oliver Strauss · 3 nights · Standard', time: '41 min ago', type: 'info' },
                { title: 'Booking cancelled', message: 'Charlotte Beaumont cancelled BKG-2026-0459', time: '1h ago', type: 'error' },
                { title: 'Payment received', message: '$1,290 for Marcus Holloway', time: '2h ago', type: 'success' },
              ].map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${NOTIF_STYLES[n.type]}`}>
                    <Bell size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-600 text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-border flex justify-end">
              <button onClick={() => setNotifOpen(false)} className="btn-ghost px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
