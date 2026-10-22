import { Loader2, AlertCircle, Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useData';
import { formatDateTime } from '@/lib/format';

export default function Notifications() {
  const { data, loading, error, refresh } = useNotifications();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
          <p className="text-slate-400 text-sm mt-1">{data.length} notification{data.length !== 1 ? 's' : ''}</p>
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
          <Bell className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">No notifications found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((notif) => (
            <div key={notif.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                notif.is_read ? 'bg-slate-800' : 'bg-emerald-500/15'
              }`}>
                <Bell className={`w-5 h-5 ${notif.is_read ? 'text-slate-500' : 'text-emerald-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white text-sm font-medium">{notif.title ?? 'Untitled'}</p>
                  {notif.type && (
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg">{notif.type}</span>
                  )}
                  {!notif.is_read && (
                    <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg">New</span>
                  )}
                </div>
                {notif.message && <p className="text-slate-400 text-sm">{notif.message}</p>}
                <p className="text-slate-600 text-xs mt-2">{formatDateTime(notif.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
