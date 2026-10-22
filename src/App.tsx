import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Login from '@/pages/Login';
import Layout, { type PageKey } from '@/components/Layout';
import Bookings from '@/pages/Bookings';
import BookingDetail from '@/pages/BookingDetail';
import Locations from '@/pages/Locations';
import Sports from '@/pages/Sports';
import Courts from '@/pages/Courts';
import Payments from '@/pages/Payments';
import Notifications from '@/pages/Notifications';
import BlockedSlots from '@/pages/BlockedSlots';
import type { BookingWithDetails } from '@/types/database';
import { Loader2, Mountain, ShieldAlert } from 'lucide-react';

function AdminApp() {
  const { session, profile, loading, isAdmin, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageKey>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Mountain className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 text-sm mb-6">
            Your account does not have admin privileges. Contact an administrator to get access.
          </p>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left mb-6">
            <p className="text-slate-500 text-xs mb-1">Signed in as:</p>
            <p className="text-white text-sm font-medium">{profile?.full_name ?? 'Unknown'}</p>
            <p className="text-slate-400 text-xs">{session.user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {currentPage === 'bookings' && <Bookings onSelectBooking={setSelectedBooking} />}
        {currentPage === 'locations' && <Locations />}
        {currentPage === 'sports' && <Sports />}
        {currentPage === 'courts' && <Courts />}
        {currentPage === 'payments' && <Payments />}
        {currentPage === 'notifications' && <Notifications />}
        {currentPage === 'blocked_slots' && <BlockedSlots />}
      </Layout>

      {selectedBooking && (
        <BookingDetail
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  );
}

export default App;
