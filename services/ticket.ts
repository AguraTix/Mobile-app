import {
  TicketAdminListOutput,
  TicketAdminQueryParams,
  TicketAvailableOutput,
  TicketBookOutput,
  TicketCancelOutput,
  TicketMyListOutput
} from '@/types/ticket';
import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { TicketBookingRequest } from '@/types';

export const TicketService = {
  getAvailable: (eventId: string): Promise<TicketAvailableOutput> =>
    client.get<TicketAvailableOutput>(API_ENDPOINTS.TICKETS.AVAILABLE(eventId)),

  book: (data: TicketBookingRequest): Promise<TicketBookOutput> =>
    client.post<TicketBookOutput>(API_ENDPOINTS.TICKETS.BOOK(data.eventId), { ticketType: data.ticketType }),

  getMyTickets: (): Promise<TicketMyListOutput> =>
    client.get<TicketMyListOutput>(API_ENDPOINTS.TICKETS.MY_TICKETS),

  cancel: (ticketId: string): Promise<TicketCancelOutput> =>
    client.delete<TicketCancelOutput>(API_ENDPOINTS.TICKETS.CANCEL(ticketId)),

  getAdminBooked: (params?: TicketAdminQueryParams): Promise<TicketAdminListOutput> =>
    client.get<TicketAdminListOutput>(API_ENDPOINTS.TICKETS.ADMIN_BOOKED, params as Record<string, unknown>),
};
