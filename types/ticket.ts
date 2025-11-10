export interface Ticket {
  ticket_id: string;
  eventId: string;
  venueId: string;
  sectionName: string | null;
  seatNumber: string | null;
  price: number;
  status: 'available' | 'sold' | 'reserved' | 'used';
  qrCodeUrl?: string;
}

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