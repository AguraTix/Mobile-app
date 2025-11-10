import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { Ticket, GroupedTickets } from '@/types/ticket';
import { AdminTicketResponse, TicketBookingResponse } from '@/types/response';

interface EventPreview {
  event_id: string;
  title: string;
  date: string;
}

interface VenuePreview {
  venue_id: string;
  name: string;
  location: string;
}

type AdminTicketParams = {
  status?: string;
  limit?: number;
  offset?: number;
};

export const TicketService = {
  getAvailable: (eventId: string) => 
    client.get<{ message: string; groupedTickets: GroupedTickets[] }>(API_ENDPOINTS.TICKETS.AVAILABLE(eventId)),
  
  book: (ticketId: string) => 
    client.post<TicketBookingResponse>(API_ENDPOINTS.TICKETS.BOOK(ticketId)),
  
  getMyTickets: () => 
    client.get<{ message: string; tickets: (Ticket & { Event: EventPreview; Venue: VenuePreview })[] }>(API_ENDPOINTS.TICKETS.MY_TICKETS),
  
  cancel: (ticketId: string) => 
    client.delete<{ message: string }>(API_ENDPOINTS.TICKETS.CANCEL(ticketId)),
  
  getAdminBooked: (params?: AdminTicketParams) => 
    client.get<AdminTicketResponse>(API_ENDPOINTS.TICKETS.ADMIN_BOOKED, params)
};
