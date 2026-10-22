import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { usePayments } from '@/hooks/useData';
import { formatDateTime, formatPrice, getStatusColor } from '@/lib/format';

export default function Payments() {
  const { data, loading, error, refresh } = usePayments();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Payments</h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} payment{data.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-6 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <CreditCard className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No payments found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Booking ID</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Currency</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid At</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((payment) => (
                <tr key={payment.id} className="border-b border-slate-800/50">
                  <td className="px-5 py-4 text-sm text-slate-300 font-mono text-xs">{payment.booking_id.slice(0, 8)}...</td>
                  <td className="px-5 py-4 text-sm text-white font-medium">{formatPrice(payment.amount_aed)}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-300 capitalize">{payment.provider ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{payment.currency ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">{formatDateTime(payment.paid_at)}</td>
                  <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">{formatDateTime(payment.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
