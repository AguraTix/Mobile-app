export interface Venue {
  venue_id: string;
  name: string;
  location: string;
  hasSections: boolean;
  capacity: number;
  sections: VenueSection[];
  admin_id: string;
}

export interface VenueSection {
  name: string;
  capacity: number;
}