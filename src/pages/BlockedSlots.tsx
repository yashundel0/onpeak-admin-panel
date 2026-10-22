import { Loader2, AlertCircle, Ban } from 'lucide-react';
import { useBlockedSlots, useCourts, useLocations } from '@/hooks/useData';
import { formatDate, formatTime } from '@/lib/format';

export default function BlockedSlots() {
  const { data, loading, error, refresh } = useBlockedSlots();
  const { data: courts } = useCourts();
  const { data: locations } = useLocations();

  const courtMap = new Map(courts.map((c) => [c.id, c]));
  const locationMap = new Map(locations.map((l) => [l.id, l.name]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Blocked Slots</h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} blocked slot{data.length !== 1 ? 's' : ''}</p>
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
          <Ban className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No blocked slots found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Court</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Reason</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((slot) => {
                const court = courtMap.get(slot.court_id);
                return (
                  <tr key={slot.id} className="border-b border-slate-800/50">
                    <td className="px-5 py-4 text-sm text-white font-medium whitespace-nowrap">{formatDate(slot.date)}</td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">{formatTime(slot.start_time)} — {formatTime(slot.end_time)}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{court?.name ?? '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{court ? (locationMap.get(court.location_id) ?? '—') : '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-300">{slot.reason ?? '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-300 whitespace-nowrap">{formatDate(slot.created_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
