import { Event } from "./events";
import { Venue } from "./venue";
import { User } from "./auth";

export interface SearchResult {
  events: Event[];
  venues: Venue[];
  users?: User[];
}

export interface SearchParams {
  query: string;
  limit?: number;
  type?: 'event' | 'venue' | 'all';
}