import { Loader2, AlertCircle, LayoutGrid } from 'lucide-react';
import { useCourts, useLocations, useSports } from '@/hooks/useData';

export default function Courts() {
  const { data, loading, error, refresh } = useCourts();
  const { data: locations } = useLocations();
  const { data: sports } = useSports();

  const locationMap = new Map(locations.map((l) => [l.id, l.name]));
  const sportMap = new Map(sports.map((s) => [s.id, s.name]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Courts</h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} court{data.length !== 1 ? 's' : ''}</p>
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
          <LayoutGrid className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No courts found</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sport</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Indoor</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Marker</th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((court) => (
                <tr key={court.id} className="border-b border-slate-800/50">
                  <td className="px-5 py-4 text-sm text-white font-medium">{court.name}</td>
                  <td className="px-5 py-4 text-sm text-slate-300 capitalize">{court.court_type}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{locationMap.get(court.location_id) ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{sportMap.get(court.sport_id) ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-slate-300">{court.is_indoor ? 'Yes' : 'No'}</td>
                  <td className="px-5 py-4 text-sm text-slate-300 capitalize">{court.special_marker ?? '—'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      court.is_active
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                    }`}>
                      {court.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
