import { User } from './auth';
import { Event } from './events';
import { Venue } from './venue';

// ============================================================================
// ENUMS
// ============================================================================

export enum TicketStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  USED = 'used',
  CANCELLED = 'cancelled'
}

export enum TicketType {
  REGULAR = 'Regular',
  VIP = 'VIP',
  VVIP = 'VVIP'
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
// QUERY PARAMETERS INTERFACES
// ============================================================================

export interface TicketAdminQueryParams {
  status?: string; // 'sold', 'all', or comma-separated statuses
  limit?: number;
  offset?: number;
}

// Legacy interfaces for backward compatibility
export interface GroupedTickets {
  sectionName: string;
  available: number;
  tickets: Ticket[];
}

export interface BookedTicketResponse {
  message: string;
  groupedTickets: GroupedTickets[];
}

export interface MyTicketsResponse {
  message: string;
  tickets: (Ticket & {
    Event: { event_id: string; title: string; date: string };
    Venue: { venue_id: string; name: string; location: string };
  })[];
}