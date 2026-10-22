export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean | null;
  created_at: string;
  updated_at: string | null;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  city: string | null;
  google_maps: string | null;
  google_maps_embed: string | null;
  description: string | null;
  image_url: string | null;
  opening_hours: Record<string, { open: string; close: string }> | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Sport {
  id: string;
  name: string;
  slug: string;
  icon_name: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface Court {
  id: string;
  location_id: string;
  sport_id: string;
  name: string;
  court_type: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  is_indoor: boolean;
  special_marker: string | null;
}

export interface Booking {
  id: string;
  user_id: string;
  court_id: string;
  location_id: string;
  sport_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  booking_status: string;
  payment_status: string;
  price_aed: number | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  admin_notes: string | null;
}

export interface Payment {
  id: string;
  booking_id: string;
  status: string;
  created_at: string;
  currency: string | null;
  paid_at: string | null;
  amount_aed: number | null;
  provider: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string | null;
  message: string | null;
  type: string | null;
  is_read: boolean | null;
  created_at: string;
  booking_id: string | null;
}

export interface BlockedSlot {
  id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  reason: string | null;
  created_at: string;
  created_by: string | null;
}

export interface BookingWithDetails extends Booking {
  court?: Court;
  location?: Location;
  sport?: Sport;
  payment?: Payment;
}
