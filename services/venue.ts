import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { Venue, VenueSection } from '@/types/venue';

type CreateVenueData = {
  name: string;
  location: string;
  hasSections: boolean;
  capacity: number;
  sections?: VenueSection[];
};

type UpdateVenueData = Partial<CreateVenueData>;

export const VenueService = {
  create: (data: CreateVenueData) => 
    client.post<{ message: string; venue: Venue }>(API_ENDPOINTS.VENUES.ALL, data),
  
  getAll: () => 
    client.get<{ message: string; venues: Venue[] }>(API_ENDPOINTS.VENUES.ALL),
  
  getById: (venueId: string) => 
    client.get<{ message: string; venue: Venue }>(API_ENDPOINTS.VENUES.BY_ID(venueId)),
  
  update: (venueId: string, data: UpdateVenueData) => 
    client.put<{ message: string; venue: Venue }>(API_ENDPOINTS.VENUES.BY_ID(venueId), data),
  
  delete: (venueId: string) => 
    client.delete<{ message: string }>(API_ENDPOINTS.VENUES.BY_ID(venueId))
};
