import React from 'react';
import { ACTIVITY_FEED } from '@/lib/mockData';
import { LogIn, LogOut, PlusCircle, CreditCard, XCircle, Clock } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  LogIn: <LogIn size={14} />,
  LogOut: <LogOut size={14} />,
  PlusCircle: <PlusCircle size={14} />,
  CreditCard: <CreditCard size={14} />,
  XCircle: <XCircle size={14} />,
  Clock: <Clock size={14} />,
};

const TYPE_COLORS: Record<string, string> = {
  'check-in': 'bg-primary/10 text-primary',
  'check-out': 'bg-muted text-muted-foreground',
  'new-booking': 'bg-positive/10 text-positive',
  'payment': 'bg-accent/10 text-accent',
  'cancellation': 'bg-negative/10 text-negative',
  'pending': 'bg-warning/10 text-warning',
};

export default function ActivityFeed() {
  return (
    <div className="card-base shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-600 text-foreground">Live Activity</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Recent events</p>
      </div>
      <div className="divide-y divide-border">
        {ACTIVITY_FEED.map(item => (
          <div key={item.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${TYPE_COLORS[item.type]}`}>
              {ICON_MAP[item.icon]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground leading-relaxed">{item.message}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}