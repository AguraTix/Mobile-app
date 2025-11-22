import { User } from './auth';

// ============================================================================
// VENUE INTERFACES
// ============================================================================

export interface VenueSection {
  name: string;
  capacity: number;
}

export interface VenueCreateInput {
  name: string;
  location: string;
  capacity: number;
  hasSections: boolean;
  sections?: VenueSection[];
}

export interface VenueUpdateInput {
  name?: string;
  location?: string;
  capacity?: number;
  hasSections?: boolean;
  sections?: VenueSection[];
}

export interface Venue {
  venue_id: string;
  name: string;
  location: string;
  capacity: number;
  hasSections: boolean;
  sections: VenueSection[];
  admin_id: string;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface VenueCreateOutput {
  message: string;
  venue: Venue;
}

export interface VenueUpdateOutput {
  message: string;
  venue: Venue;
}

export interface VenueDeleteOutput {
  message: string;
}

export interface VenueListOutput {
  message: string;
  venues: Venue[];
}

export interface VenueDetailOutput {
  message: string;
  venue: Venue;
}