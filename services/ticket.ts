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

export const TicketService = {
  getAvailable: (eventId: string): Promise<TicketAvailableOutput> =>
    client.get<TicketAvailableOutput>(API_ENDPOINTS.TICKETS.AVAILABLE(eventId)),

  book: (ticketId: string): Promise<TicketBookOutput> =>
    client.post<TicketBookOutput>(API_ENDPOINTS.TICKETS.BOOK(ticketId)),

  getMyTickets: (): Promise<TicketMyListOutput> =>
    client.get<TicketMyListOutput>(API_ENDPOINTS.TICKETS.MY_TICKETS),

  cancel: (ticketId: string): Promise<TicketCancelOutput> =>
    client.delete<TicketCancelOutput>(API_ENDPOINTS.TICKETS.CANCEL(ticketId)),

  getAdminBooked: (params?: TicketAdminQueryParams): Promise<TicketAdminListOutput> =>
    client.get<TicketAdminListOutput>(API_ENDPOINTS.TICKETS.ADMIN_BOOKED, params as Record<string, unknown>),
};
