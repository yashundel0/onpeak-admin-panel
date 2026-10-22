import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Booking,
  BookingWithDetails,
  Court,
  Location,
  Sport,
  Payment,
  Notification,
  BlockedSlot,
} from '@/types/database';

export type BookingStatusFilter = 'all' | 'confirmed' | 'pending' | 'cancelled' | string;

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (statusFilter !== 'all') {
      query = query.eq('booking_status', statusFilter);
    }

    if (searchQuery.trim()) {
      query = query.or(
        `customer_name.ilike.%${searchQuery}%,customer_email.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`
      );
    }

    const { data, error: err } = await query;

    if (err) {
      setError(err.message);
      setBookings([]);
      setLoading(false);
      return;
    }

    const rawBookings = (data ?? []) as Booking[];
    if (rawBookings.length === 0) {
      setBookings([]);
      setLoading(false);
      return;
    }

    const courtIds = [...new Set(rawBookings.map((b) => b.court_id))];
    const locationIds = [...new Set(rawBookings.map((b) => b.location_id))];
    const sportIds = [...new Set(rawBookings.map((b) => b.sport_id))];
    const bookingIds = rawBookings.map((b) => b.id);

    const [courtsRes, locationsRes, sportsRes, paymentsRes] = await Promise.all([
      supabase.from('courts').select('*').in('id', courtIds),
      supabase.from('locations').select('*').in('id', locationIds),
      supabase.from('sports').select('*').in('id', sportIds),
      supabase.from('payments').select('*').in('booking_id', bookingIds),
    ]);

    const courts = (courtsRes.data ?? []) as Court[];
    const locations = (locationsRes.data ?? []) as Location[];
    const sports = (sportsRes.data ?? []) as Sport[];
    const payments = (paymentsRes.data ?? []) as Payment[];

    const courtMap = new Map(courts.map((c) => [c.id, c]));
    const locationMap = new Map(locations.map((l) => [l.id, l]));
    const sportMap = new Map(sports.map((s) => [s.id, s]));
    const paymentMap = new Map(payments.map((p) => [p.booking_id, p]));

    const enriched: BookingWithDetails[] = rawBookings.map((b) => ({
      ...b,
      court: courtMap.get(b.court_id),
      location: locationMap.get(b.location_id),
      sport: sportMap.get(b.sport_id),
      payment: paymentMap.get(b.id),
    }));

    setBookings(enriched);
    setLoading(false);
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    refresh: fetchBookings,
  };
}

export function useTableData<T>(
  table: string,
  orderBy: string = 'created_at',
  ascending: boolean = false,
  limit: number = 200
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from(table)
      .select('*')
      .order(orderBy, { ascending })
      .limit(limit);

    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((data ?? []) as T[]);
    }
    setLoading(false);
  }, [table, orderBy, ascending, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useLocations() {
  return useTableData<Location>('locations', 'sort_order', true);
}

export function useSports() {
  return useTableData<Sport>('sports', 'sort_order', true);
}

export function useCourts() {
  return useTableData<Court>('courts', 'sort_order', true);
}

export function usePayments() {
  const [data, setData] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (err) {
      setError(err.message);
      setData([]);
    } else {
      setData((data ?? []) as Payment[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}

export function useNotifications() {
  return useTableData<Notification>('notifications', 'created_at', false);
}

export function useBlockedSlots() {
  return useTableData<BlockedSlot>('blocked_slots', 'date', true);
}
