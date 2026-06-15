// =====================================================
// USER TYPES
// =====================================================

export type UserRole = 'student' | 'organizer' | 'moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  fullname: string;
  avatarUrl?: string;
  phone?: string;
  city?: string;
  university?: string;
  faculty?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organizer {
  id: string;
  userId: string;
  organizationName: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// EVENT TYPES
// =====================================================

export type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

export interface Event {
  id: string;
  organizerId: string;
  categoryId?: string;
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  startDate: Date;
  endDate: Date;
  status: EventStatus;
  views: number;
  isFree: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  organizer?: Organizer;
  category?: EventCategory;
  isFavorited?: boolean;
}

// =====================================================
// TICKET & ORDER TYPES
// =====================================================

export interface Ticket {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  remaining: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'paid' | 'cancelled' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  providerReference?: string;
  amount: number;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IssuedTicket {
  id: string;
  orderId: string;
  userId: string;
  ticketId: string;
  qrCode: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
}

// =====================================================
// BOOST & AD TYPES
// =====================================================

export type BoostType = 'h24' | 'h72' | 'days7';
export type BoostStatus = 'active' | 'expired' | 'cancelled';

export interface Boost {
  id: string;
  eventId: string;
  organizerId: string;
  boostType: BoostType;
  startDate: Date;
  endDate: Date;
  status: BoostStatus;
  createdAt: Date;
}

export interface Ad {
  id: string;
  advertiserName: string;
  bannerUrl: string;
  targetCity?: string;
  clickUrl?: string;
  impressions: number;
  clicks: number;
  startDate: Date;
  endDate: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// =====================================================
// NOTIFICATION TYPES
// =====================================================

export type NotificationType =
  | 'ticket_purchased'
  | 'event_reminder'
  | 'event_approved'
  | 'event_rejected'
  | 'event_updated'
  | 'payment_confirmed'
  | 'payment_failed';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiListResponse<T = unknown> {
  success: true;
  data: T[];
  meta: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    statusCode: number;
    details?: Array<{ field: string; message: string }>;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}
