/**
 * Backend API Interfaces and Types
 * Generated from backend controllers and models
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  ATTENDEE = 'Attendee',
  ADMIN = 'Admin'
}

export enum TicketStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  USED = 'used',
  CANCELLED = 'cancelled'
}

export enum FoodOrderStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled'
}

export enum TicketType {
  REGULAR = 'Regular',
  VIP = 'VIP',
  VVIP = 'VVIP'
}

// ============================================================================
// USER INTERFACES
// ============================================================================

export interface UserRegisterInput {
  email: string;
  password: string;
  name: string;
  phone_number: string;
}

export interface UserLoginInput {
  identifier: string; // Email or phone number
  password: string;
}

export interface UserUpdateRoleInput {
  role: UserRole;
}

export interface User {
  user_id: string;
  email: string;
  phone_number?: string;
  name: string;
  profile_photo?: string;
  role: UserRole;
  preferences?: Record<string, any>;
  verificationCode?: string;
  codeExpiresAt?: string;
}

export interface UserRegisterOutput {
  message: string;
  user_id: string;
}

export interface UserLoginOutput {
  message: string;
  token: string;
  user: User;
}

export interface UserUpdateRoleOutput {
  message: string;
  user: User;
}

// ============================================================================
// PASSWORD RESET INTERFACES
// ============================================================================

export interface PasswordResetRequestInput {
  identifier: string; // Email or phone number
}

export interface PasswordResetRequestOutput {
  message: string;
  [key: string]: any;
}

export interface PasswordResetVerifyInput {
  identifier: string;
  verification_code: string;
}

export interface PasswordResetVerifyOutput {
  message: string;
  [key: string]: any;
}

export interface PasswordResetInput {
  identifier: string;
  verification_code: string;
  new_password: string;
}

export interface PasswordResetOutput {
  message: string;
  [key: string]: any;
}

// ============================================================================
// VENUE INTERFACES
// ============================================================================

export interface VenueSection {
  name: string;
  capacity: number;
}

export interface VenueCreateInput {
  name: string;
  location: string;
  capacity: number;
  hasSections: boolean;
  sections?: VenueSection[];
}

export interface VenueUpdateInput {
  name?: string;
  location?: string;
  capacity?: number;
  hasSections?: boolean;
  sections?: VenueSection[];
}

export interface Venue {
  venue_id: string;
  name: string;
  location: string;
  capacity: number;
  hasSections: boolean;
  sections: VenueSection[];
  admin_id: string;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface VenueCreateOutput {
  message: string;
  venue: Venue;
}

export interface VenueUpdateOutput {
  message: string;
  venue: Venue;
}

export interface VenueDeleteOutput {
  message: string;
}

export interface VenueListOutput {
  message: string;
  venues: Venue[];
}

export interface VenueDetailOutput {
  message: string;
  venue: Venue;
}

// ============================================================================
// TICKET INTERFACES
// ============================================================================

export interface TicketTypeConfig {
  type: TicketType | string; // Can be custom section names for venues with sections
  price: number;
  quantity: number;
}

export interface Ticket {
  ticket_id: string;
  eventId: string;
  venueId: string;
  sectionName?: string;
  seatNumber?: string;
  price: number;
  status: TicketStatus;
  attendee_id?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  purchaseDate?: string;
  Event?: Event;
  Venue?: Venue;
  User?: User;
}

export interface TicketGrouped {
  sectionName: string;
  available: number;
  tickets: Ticket[];
}

export interface TicketAvailableOutput {
  message: string;
  groupedTickets: TicketGrouped[];
}

export interface TicketBookInput {
  // No input body required, ticketId comes from params
   
}

export interface TicketBookOutput {
  message: string;
  ticket: Ticket;
}

export interface TicketCancelOutput {
  message: string;
}

export interface TicketMyListOutput {
  message: string;
  tickets: Ticket[];
}

export interface TicketAdminListOutput {
  message: string;
  total: number;
  limit: number;
  offset: number;
  tickets: Ticket[];
}

// ============================================================================
// EVENT INTERFACES
// ============================================================================

export interface EventImage {
  filename: string;
  originalname?: string;
  mimetype?: string;
  size?: number;
  path: string;
}

export interface EventCreateInput {
  title: string;
  description?: string;
  date: string; // ISO 8601 datetime
  venue_id: string;
  artist_lineup?: string[] | string; // Can be array or JSON string
  tickets: TicketTypeConfig[] | string; // Can be array or JSON string
  event_image?: File;
  event_images?: File[];
}

export interface EventUpdateInput {
  title?: string;
  description?: string;
  date?: string;
  venue_id?: string;
  artist_lineup?: string[] | string;
  event_image?: File;
  event_images?: File[];
}

export interface Event {
  event_id: string;
  title: string;
  description?: string;
  date: string;
  venue_id: string;
  admin_id: string;
  artist_lineup?: string[];
  event_images?: EventImage[];
  image_url?: string;
  image_count?: number;
  tickets?: TicketTypeConfig[];
  ticketsCreated?: number;
  Venue?: Venue;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface EventCreateOutput {
  message: string;
  event: Event;
}

export interface EventUpdateOutput {
  message: string;
  event: Event;
}

export interface EventDeleteOutput {
  message: string;
}

export interface EventListOutput {
  message: string;
  events: Event[];
}

export interface EventDetailOutput {
  message: string;
  event: Event;
}

export interface EventRecentOutput {
  message: string;
  events: Event[];
  pagination: {
    limit: number;
    offset: number;
    total?: number;
  };
}

export interface EventByVenueOutput {
  message: string;
  events: Event[];
}

export interface EventImagesOutput {
  message: string;
  event_id: string;
  event_images: EventImage[];
  image_url?: string;
  image_count: number;
}

// ============================================================================
// FOOD INTERFACES
// ============================================================================

export interface FoodCreateInput {
  foodname: string;
  quantity: number;
  foodprice: number;
  fooddescription?: string;
  event_id: string;
  foodimage?: File;
}

export interface FoodUpdateInput {
  foodname?: string;
  quantity?: number;
  foodprice?: number;
  fooddescription?: string;
  event_id?: string;
  foodimage?: File;
}

export interface Food {
  food_id: string;
  foodname: string;
  foodimage?: string;
  quantity: number;
  foodprice: number;
  fooddescription?: string;
  event_id: string;
  admin_id: string;
  Event?: Event;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodCreateOutput {
  message: string;
  food: Food;
}

export interface FoodUpdateOutput {
  message: string;
  food: Food;
}

export interface FoodDeleteOutput {
  message: string;
}

export interface FoodListOutput {
  message: string;
  foods: Food[];
}

export interface FoodDetailOutput {
  message: string;
  food: Food;
}

export interface FoodByEventOutput {
  message: string;
  foods: Food[];
  eventId: string;
  count: number;
}

export interface FoodGeneralOutput {
  message: string;
  foods: Food[];
  count: number;
}

// ============================================================================
// PAYMENT INTERFACES
// ============================================================================

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

export interface PaymentCreateInput {
  order_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id?: string;
  Order?: FoodOrder;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCreateOutput {
  message: string;
  payment: Payment;
}

export interface PaymentVerifyOutput {
  message: string;
  payment: Payment;
  verified: boolean;
}

// ============================================================================
// FOOD ORDER INTERFACES
// ============================================================================

export interface FoodOrderCreateInput {
  food_id: string;
  quantity: number;
  special_instructions?: string;
}

export interface FoodOrder {
  order_id: string;
  user_id: string;
  food_id: string;
  event_id: string;
  order_status: FoodOrderStatus;
  quantity?: number;
  special_instructions?: string;
  Food?: Food;
  User?: User;
  Event?: Event;
  createdAt?: string;
  updatedAt?: string;
}

export interface FoodOrderCreateOutput {
  message: string;
  order: FoodOrder;
}

export interface FoodOrderListOutput {
  message: string;
  orders: FoodOrder[];
  count: number;
}

export interface FoodOrderHistoryOutput {
  message: string;
  orders: FoodOrder[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FoodOrderEventOutput {
  message: string;
  orders: FoodOrder[];
  page: number;
  limit: number;
  total: number;
  [key: string]: any;
}

// ============================================================================
// ERROR RESPONSE INTERFACES
// ============================================================================

export interface ErrorResponse {
  error: string;
  details?: string;
  [key: string]: any;
}

export interface ValidationError {
  errors: [{
    msg: string;
    param: string;
    location: string;
    value?: any;
  }];
}

// ============================================================================
// PAGINATION INTERFACES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

// ============================================================================
// QUERY PARAMETERS INTERFACES
// ============================================================================

export interface EventQueryParams {
  limit?: number;
  offset?: number;
  upcomingOnly?: boolean;
}

export interface TicketAdminQueryParams {
  status?: string; // 'sold', 'all', or comma-separated statuses
  limit?: number;
  offset?: number;
}

export interface FoodOrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
}

// ============================================================================
// AUTHENTICATION INTERFACES
// ============================================================================

export interface AuthToken {
  token: string;
  expiresIn?: string;
}

export interface AuthContext {
  user: User;
  token: string;
}

// ============================================================================
// GENERIC API RESPONSE WRAPPER
// ============================================================================

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  [key: string]: any;
}

export interface ApiListResponse<T> {
  message?: string;
  data?: T[];
  items?: T[];
  count?: number;
  total?: number;
  pagination?: PaginationMeta;
  error?: string;
  [key: string]: any;
}
