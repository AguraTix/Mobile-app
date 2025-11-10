import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { Event, EventImage, TicketType } from '@/types/events';
import { EventServiceResponse } from '@/types/response';

type EventData = {
  title: string;
  description: string;
  date: string;
  venue_id: string;
  artist_lineup: string[];
  tickets: TicketType[]; // Fix type reference
  event_image?: File;
  event_images?: File[];
};

type EventUpdateData = Partial<EventData>;

type PaginationParams = {
  limit?: number;
  offset?: number;
  upcomingOnly?: boolean;
};

export const EventService = {
  create: (data: EventData) => 
    client.post<EventServiceResponse>(API_ENDPOINTS.EVENTS.ALL, data),
  
  getAll: () => 
    client.get<EventServiceResponse>(API_ENDPOINTS.EVENTS.ALL),
  
  getRecent: (params?: PaginationParams) => 
    client.get<{ message: string; events: Event[]; pagination: { total: number } }>(API_ENDPOINTS.EVENTS.RECENT, params),
  
  getById: (eventId: string) => 
    client.get<EventServiceResponse>(API_ENDPOINTS.EVENTS.BY_ID(eventId)),
  
  update: (eventId: string, data: EventUpdateData) => 
    client.put<EventServiceResponse>(API_ENDPOINTS.EVENTS.BY_ID(eventId), data),
  
  delete: (eventId: string) => 
    client.delete<{ message: string }>(API_ENDPOINTS.EVENTS.BY_ID(eventId)),
  
  getByVenue: (venueId: string) => 
    client.get<EventServiceResponse>(API_ENDPOINTS.EVENTS.BY_VENUE(venueId)),
  
  getImages: (eventId: string) => 
    client.get<{ message: string; event_images: EventImage[]; image_url?: string; image_count: number }>(API_ENDPOINTS.EVENTS.IMAGES(eventId))
};
