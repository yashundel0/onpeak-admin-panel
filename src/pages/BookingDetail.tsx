import {
  X,
  MapPin,
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Trophy,
  LayoutGrid,
  CreditCard,
  FileText,
  StickyNote,
} from 'lucide-react';
import type { BookingWithDetails } from '@/types/database';
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatPrice,
  getStatusColor,
} from '@/lib/format';

interface BookingDetailProps {
  booking: BookingWithDetails;
  onClose: () => void;
}

export default function BookingDetail({ booking, onClose }: BookingDetailProps) {
  const details = [
    {
      icon: User,
      label: 'Customer Name',
      value: booking.customer_name ?? '—',
    },
    {
      icon: Mail,
      label: 'Customer Email',
      value: booking.customer_email ?? '—',
    },
    {
      icon: Phone,
      label: 'Customer Phone',
      value: booking.customer_phone ?? '—',
    },
    {
      icon: CalendarDays,
      label: 'Booking Date',
      value: formatDate(booking.booking_date),
    },
    {
      icon: Clock,
      label: 'Time Slot',
      value: `${formatTime(booking.start_time)} — ${formatTime(booking.end_time)}`,
    },
    {
      icon: LayoutGrid,
      label: 'Court',
      value: booking.court?.name ?? '—',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: booking.location?.name ?? '—',
    },
    {
      icon: Trophy,
      label: 'Sport',
      value: booking.sport?.name ?? '—',
    },
    {
      icon: CreditCard,
      label: 'Price',
      value: formatPrice(booking.price_aed),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Booking Details</h2>
            <p className="text-slate-500 text-xs mt-1 font-mono">{booking.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status badges */}
        <div className="flex gap-3 px-6 pt-4">
          <div>
            <p className="text-slate-500 text-xs mb-1">Booking Status</p>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(booking.booking_status)}`}>
              {booking.booking_status ?? '—'}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Payment Status</p>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor(booking.payment_status)}`}>
              {booking.payment_status ?? '—'}
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {details.map((detail) => {
            const Icon = detail.icon;
            return (
              <div key={detail.label} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-500 text-xs">{detail.label}</p>
                  <p className="text-white text-sm font-medium mt-0.5 break-words">{detail.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment info */}
        {booking.payment && (
          <div className="px-6 pb-4">
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <p className="text-sm font-semibold text-white">Payment Record</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500">Amount:</span>{' '}
                  <span className="text-slate-300">{formatPrice(booking.payment.amount_aed)}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status:</span>{' '}
                  <span className="text-slate-300">{booking.payment.status}</span>
                </div>
                <div>
                  <span className="text-slate-500">Provider:</span>{' '}
                  <span className="text-slate-300">{booking.payment.provider ?? '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Currency:</span>{' '}
                  <span className="text-slate-300">{booking.payment.currency ?? '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500">Paid At:</span>{' '}
                  <span className="text-slate-300">{formatDateTime(booking.payment.paid_at)}</span>
                </div>
                <div>
                  <span className="text-slate-500">Created:</span>{' '}
                  <span className="text-slate-300">{formatDateTime(booking.payment.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes */}
        {(booking.notes || booking.admin_notes) && (
          <div className="px-6 pb-6 space-y-3">
            {booking.notes && (
              <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <p className="text-sm font-semibold text-white">Customer Notes</p>
                </div>
                <p className="text-slate-400 text-sm">{booking.notes}</p>
              </div>
            )}
            {booking.admin_notes && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StickyNote className="w-4 h-4 text-amber-400" />
                  <p className="text-sm font-semibold text-white">Admin Notes</p>
                </div>
                <p className="text-slate-400 text-sm">{booking.admin_notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Timestamps */}
        <div className="px-6 pb-6 border-t border-slate-800 pt-4">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-500">
            <div>Created: {formatDateTime(booking.created_at)}</div>
            <div>Updated: {formatDateTime(booking.updated_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
