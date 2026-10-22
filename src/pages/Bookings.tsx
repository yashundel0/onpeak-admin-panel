import { RefreshCw, Search, CalendarDays, Loader2, AlertCircle } from 'lucide-react';
import { useBookings } from '@/hooks/useData';
import { getStatusColor, formatPrice, formatDate, formatTime } from '@/lib/format';
import type { BookingWithDetails } from '@/types/database';
import type { BookingStatusFilter } from '@/hooks/useData';

interface BookingsProps {
  onSelectBooking: (booking: BookingWithDetails) => void;
}

const statusOptions: { value: BookingStatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

export default function Bookings({ onSelectBooking }: BookingsProps) {
  const {
    bookings,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh,
  } = useBookings();

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Bookings</h1>
          <p className="text-slate-400 text-sm mt-1">
            {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BookingStatusFilter)}
          className="bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm min-w-[160px]"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && bookings.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <CalendarDays className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No bookings found</p>
          <p className="text-sm mt-1">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Bookings will appear here when customers book'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800 text-left">
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Court</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sport</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    onClick={() => onSelectBooking(booking)}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {formatDate(booking.booking_date)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {formatTime(booking.start_time)} — {formatTime(booking.end_time)}
                    </td>
                    <td className="px-5 py-4 text-sm text-white font-medium whitespace-nowrap">
                      {booking.customer_name ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {booking.court?.name ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {booking.location?.name ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {booking.sport?.name ?? '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">
                      {formatPrice(booking.price_aed)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(booking.booking_status)}`}>
                        {booking.booking_status ?? '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(booking.payment_status)}`}>
                        {booking.payment_status ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-4 active:bg-slate-800/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-medium text-sm">{booking.customer_name ?? '—'}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {formatDate(booking.booking_date)} · {formatTime(booking.start_time)}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(booking.booking_status)}`}>
                    {booking.booking_status ?? '—'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Court:</span>{' '}
                    <span className="text-slate-300">{booking.court?.name ?? '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Location:</span>{' '}
                    <span className="text-slate-300">{booking.location?.name ?? '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Sport:</span>{' '}
                    <span className="text-slate-300">{booking.sport?.name ?? '—'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Price:</span>{' '}
                    <span className="text-slate-300">{formatPrice(booking.price_aed)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
