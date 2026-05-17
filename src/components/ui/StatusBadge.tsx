'use client';

import React from 'react';
import type { BookingStatus, PaymentStatus } from '@/lib/mockData';

interface StatusBadgeProps {
  status: BookingStatus;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
  'checked-in': 'Checked In',
  'checked-out': 'Checked Out',
  'no-show': 'No Show',
};

const STATUS_CLASSES: Record<BookingStatus, string> = {
  confirmed: 'status-badge-confirmed',
  pending: 'status-badge-pending',
  cancelled: 'status-badge-cancelled',
  'checked-in': 'status-badge-checkedin',
  'checked-out': 'status-badge-checkedout',
  'no-show': 'status-badge-noshow',
};

export function StatusBadge({ status, onClick, size = 'md' }: StatusBadgeProps) {
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5';
  return (
    <span
      onClick={onClick}
      className={`
        inline-flex items-center font-600 rounded-full whitespace-nowrap
        ${sizeClass} ${STATUS_CLASSES[status]}
        ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity select-none' : ''}
      `}
      title={onClick ? 'Click to change status' : undefined}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

interface PaymentBadgeProps {
  status: PaymentStatus;
}

const PAYMENT_CLASSES: Record<PaymentStatus, string> = {
  paid: 'bg-positive/10 text-positive',
  partial: 'bg-warning/10 text-warning',
  unpaid: 'bg-negative/10 text-negative',
  refunded: 'bg-muted text-muted-foreground',
};

const PAYMENT_LABELS: Record<PaymentStatus, string> = {
  paid: 'Paid',
  partial: 'Partial',
  unpaid: 'Unpaid',
  refunded: 'Refunded',
};

export function PaymentBadge({ status }: PaymentBadgeProps) {
  return (
    <span className={`inline-flex items-center text-[11px] font-600 px-2 py-0.5 rounded-full ${PAYMENT_CLASSES[status]}`}>
      {PAYMENT_LABELS[status]}
    </span>
  );
}