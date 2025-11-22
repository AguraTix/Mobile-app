import { Event, EventImage } from "./events";
import { Ticket } from "./ticket";

export interface EventServiceResponse {
  message: string;
  event?: Event;
  events?: Event[];
  error?: string;
}

export interface EventUpdateData {
  title?: string;
  description?: string;
  date?: string;
  venue_id?: string;
  artist_lineup?: string[];
  event_images?: EventImage[];
  image_url?: string;
}

export interface AdminTicketResponse {
  message: string;
  total: number;
  limit: number;
  offset: number;
  tickets: (Ticket & {
    Event: { event_id: string; title: string; date: string };
    Venue: { venue_id: string; name: string; location: string; hasSections: boolean };
    User: { user_id: string; name: string; email: string };
  })[];
}

export interface TicketBookingResponse {
  message: string;
  ticket: {
    ticket_id: string;
    eventId: string;
    venueId: string;
    sectionName: string | null;
    seatNumber: string | null;
    price: number;
    status: string;
    qrCodeUrl?: string;
  };
}