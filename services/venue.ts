import {
    VenueCreateInput,
    VenueCreateOutput,
    VenueDeleteOutput,
    VenueDetailOutput,
    VenueListOutput,
    VenueUpdateInput,
    VenueUpdateOutput
} from '@/types/backend';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export const VenueService = {
  create: (data: VenueCreateInput): Promise<VenueCreateOutput> =>
    client.post<VenueCreateOutput>(API_ENDPOINTS.VENUES.CREATE, data),

  getAll: (): Promise<VenueListOutput> =>
    client.get<VenueListOutput>(API_ENDPOINTS.VENUES.ALL),

  getById: (venueId: string): Promise<VenueDetailOutput> =>
    client.get<VenueDetailOutput>(API_ENDPOINTS.VENUES.BY_ID(venueId)),

  update: (venueId: string, data: VenueUpdateInput): Promise<VenueUpdateOutput> =>
    client.put<VenueUpdateOutput>(API_ENDPOINTS.VENUES.UPDATE(venueId), data),

  delete: (venueId: string): Promise<VenueDeleteOutput> =>
    client.delete<VenueDeleteOutput>(API_ENDPOINTS.VENUES.DELETE(venueId)),
};
