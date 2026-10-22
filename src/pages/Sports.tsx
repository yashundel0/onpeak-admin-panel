import { Loader2, AlertCircle, Trophy } from 'lucide-react';
import { useSports } from '@/hooks/useData';

export default function Sports() {
  const { data, loading, error, refresh } = useSports();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sports</h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} sport{data.length !== 1 ? 's' : ''}</p>
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
          <Trophy className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No sports found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((sport) => (
            <div key={sport.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold text-lg">{sport.name}</h3>
                  <p className="text-slate-500 text-sm">/{sport.slug}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  sport.is_active
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/15 text-slate-400 border-slate-500/30'
                }`}>
                  {sport.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              {sport.icon_name && (
                <p className="text-slate-500 text-xs mt-3">Icon: {sport.icon_name}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
