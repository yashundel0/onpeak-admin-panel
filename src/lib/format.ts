import type { BookingWithDetails } from '@/types/database';

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(timeStr: string | null): string {
  if (!timeStr) return '—';
  return timeStr;
}

export function formatPrice(price: number | null): string {
  if (price === null || price === undefined) return '—';
  return `AED ${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function getStatusColor(status: string | null): string {
  switch (status?.toLowerCase()) {
    case 'confirmed':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'pending':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'cancelled':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'completed':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    case 'paid':
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    case 'unpaid':
    case 'refunded':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

export function getBookingDisplay(booking: BookingWithDetails) {
  return {
    courtName: booking.court?.name ?? '—',
    locationName: booking.location?.name ?? '—',
    sportName: booking.sport?.name ?? '—',
    customerName: booking.customer_name ?? '—',
    customerEmail: booking.customer_email ?? '—',
    customerPhone: booking.customer_phone ?? '—',
    date: formatDate(booking.booking_date),
    startTime: formatTime(booking.start_time),
    endTime: formatTime(booking.end_time),
    price: formatPrice(booking.price_aed),
    status: booking.booking_status ?? '—',
    paymentStatus: booking.payment_status ?? '—',
    notes: booking.notes ?? '—',
    adminNotes: booking.admin_notes ?? '—',
  };
}
