export interface Event {
  event_id: string;
  title: string;
  description: string;
  date: string;
  venue_id: string;
  artist_lineup: string[];
  event_images: EventImage[];
  image_url: string | null;
  tickets: TicketType[];
  ticketsCreated?: number;
}

export interface EventImage {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
}

export interface TicketType {
  type: string;
  price: number;
  quantity: number;
}

export interface PaginatedEvents {
  message: string;
  events: Event[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}