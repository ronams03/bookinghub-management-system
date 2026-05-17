'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, BedDouble, CreditCard, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (booking: BookingFormData & { id: string }) => void;
}

interface BookingFormData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomType: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  source: string;
  paymentStatus: string;
  specialRequests: string;
}

function generateBookingId() {
  const num = 463 + Math.floor(Math.random() * 10);
  return `BKG-2026-0${num}`;
}

export default function AddBookingModal({ open, onClose, onSuccess }: AddBookingModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    defaultValues: {
      adults: 1,
      children: 0,
      source: 'Direct',
      paymentStatus: 'unpaid',
    },
  });

  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
  };

  const getRoomRate = (roomType: string) => {
    const rates: Record<string, number> = {
      Standard: 180, Deluxe: 320, Suite: 430, Executive: 340, Penthouse: 950,
    };
    return rates[roomType] || 0;
  };

  const roomType = watch('roomType');
  const nights = getNights();
  const estimatedTotal = nights * getRoomRate(roomType);

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (data: BookingFormData) => {
    // BACKEND INTEGRATION POINT: POST /api/bookings with data
    await new Promise(r => setTimeout(r, 900));
    const newId = generateBookingId();
    toast.success(`Booking ${newId} created successfully`, {
      description: `${data.guestName} · ${data.roomType} · ${nights} night${nights !== 1 ? 's' : ''}`,
      duration: 4000,
    });
    if (onSuccess) onSuccess({ ...data, id: newId });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-lg font-700 text-foreground">New Booking</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fill in the details to create a new reservation</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5 space-y-6">

            {/* Guest Information */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <User size={13} className="text-primary" />
                </div>
                <h3 className="text-sm font-600 text-foreground">Guest Information</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Full Name <span className="text-negative">*</span>
                  </label>
                  <input
                    {...register('guestName', { required: 'Guest name is required' })}
                    className={`w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow ${errors.guestName ? 'border-negative' : 'border-input'}`}
                    placeholder="e.g. Marcus Holloway"
                  />
                  {errors.guestName && <p className="text-xs text-negative mt-1">{errors.guestName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Email Address <span className="text-negative">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('guestEmail', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                    })}
                    className={`w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow ${errors.guestEmail ? 'border-negative' : 'border-input'}`}
                    placeholder="guest@email.com"
                  />
                  {errors.guestEmail && <p className="text-xs text-negative mt-1">{errors.guestEmail.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Phone Number</label>
                  <input
                    {...register('guestPhone')}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </section>

            {/* Room & Dates */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center">
                  <BedDouble size={13} className="text-accent" />
                </div>
                <h3 className="text-sm font-600 text-foreground">Room & Dates</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Room Type <span className="text-negative">*</span>
                  </label>
                  <select
                    {...register('roomType', { required: 'Room type is required' })}
                    className={`w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow ${errors.roomType ? 'border-negative' : 'border-input'}`}
                  >
                    <option value="">Select room type</option>
                    {['Standard', 'Deluxe', 'Suite', 'Executive', 'Penthouse'].map(rt => (
                      <option key={`rt-${rt}`} value={rt}>{rt} — ${getRoomRate(rt)}/night</option>
                    ))}
                  </select>
                  {errors.roomType && <p className="text-xs text-negative mt-1">{errors.roomType.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Room Number</label>
                  <input
                    {...register('roomNumber')}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                    placeholder="e.g. 302"
                  />
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Check-in Date <span className="text-negative">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('checkIn', { required: 'Check-in date is required' })}
                    className={`w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow ${errors.checkIn ? 'border-negative' : 'border-input'}`}
                  />
                  {errors.checkIn && <p className="text-xs text-negative mt-1">{errors.checkIn.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">
                    Check-out Date <span className="text-negative">*</span>
                  </label>
                  <input
                    type="date"
                    {...register('checkOut', {
                      required: 'Check-out date is required',
                      validate: v => !checkIn || v > checkIn || 'Check-out must be after check-in',
                    })}
                    className={`w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow ${errors.checkOut ? 'border-negative' : 'border-input'}`}
                  />
                  {errors.checkOut && <p className="text-xs text-negative mt-1">{errors.checkOut.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    {...register('adults', { min: 1, max: 6, valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Children</label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    {...register('children', { min: 0, max: 4, valueAsNumber: true })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                  />
                </div>
              </div>
            </section>

            {/* Booking Details */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-positive/10 flex items-center justify-center">
                  <CreditCard size={13} className="text-positive" />
                </div>
                <h3 className="text-sm font-600 text-foreground">Booking Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Booking Source</label>
                  <select
                    {...register('source')}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                  >
                    {['Direct', 'Booking.com', 'Expedia', 'Corporate', 'Walk-in', 'Referral'].map(s => (
                      <option key={`src-${s}`} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-600 text-foreground mb-1">Payment Status</label>
                  <select
                    {...register('paymentStatus')}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Special Requests */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center">
                  <FileText size={13} className="text-muted-foreground" />
                </div>
                <h3 className="text-sm font-600 text-foreground">Special Requests</h3>
              </div>
              <textarea
                {...register('specialRequests')}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring/30 transition-shadow resize-none"
                placeholder="Late check-out, dietary requirements, room preferences..."
              />
            </section>

            {/* Estimated total */}
            {nights > 0 && estimatedTotal > 0 && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-600 text-muted-foreground uppercase tracking-wide">Estimated Total</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{nights} night{nights !== 1 ? 's' : ''} × ${getRoomRate(roomType)}/night</p>
                </div>
                <p className="text-xl font-700 text-primary tabular-nums">${estimatedTotal.toLocaleString()}</p>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0 bg-muted/30">
          <p className="text-xs text-muted-foreground">
            <span className="text-negative">*</span> Required fields
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost px-4 py-2"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="btn-primary flex items-center gap-2 px-5 py-2 min-w-[130px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Booking'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}