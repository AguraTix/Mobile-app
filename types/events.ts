import { User } from './auth';
import { TicketTypeConfig } from './ticket';
import { Venue } from './venue';

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
  description: string;
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
  User: User;
  createdAt: string;
  updatedAt: string;
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
// QUERY PARAMETERS INTERFACES
// ============================================================================

export interface EventQueryParams {
  limit?: number;
  offset?: number;
  upcomingOnly?: boolean;
}

// Legacy interfaces for backward compatibility
export interface PaginatedEvents {
  message: string;
  events: Event[];
  pagination?: {
    total: number;
    limit: number;
    offset: number;
  };
}