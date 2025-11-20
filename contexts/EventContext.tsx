import { EventService } from "@/services/event";
import { Event, EventCreateInput, EventUpdateInput } from "@/types/backend";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface EventContextType {
  events: Event[];
  currentEvent: Event | null;
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  fetchRecentEvents: (limit?: number, offset?: number) => Promise<void>;
  fetchEventById: (eventId: string) => Promise<void>;
  fetchEventsByVenue: (venueId: string) => Promise<void>;
  createEvent: (data: EventCreateInput) => Promise<Event>;
  updateEvent: (eventId: string, data: EventUpdateInput) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<void>;
  clearError: () => void;
}

const EventContext = createContext<EventContextType | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.getAll();
      setEvents(response.events!);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch events';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentEvents = useCallback(async (limit = 10, offset = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.getRecent({ limit, offset });
      setEvents(response.events!);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch recent events';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEventById = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.getById(eventId);
      setCurrentEvent(response.event!);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchEventsByVenue = useCallback(async (venueId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.getByVenue(venueId);
      setEvents(response.events!);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch venue events';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (data: EventCreateInput): Promise<Event> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.create(data);
      if (response.event) {
        setEvents((prev) => [...prev, response.event!]);
        return response.event!;
      }
      throw new Error('Failed to create event: event is undefined');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create event';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId: string, data: EventUpdateInput): Promise<Event> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await EventService.update(eventId, data);
      if (response.event) {
        setEvents((prev) =>
          prev.map((e) => (e.event_id === eventId ? response.event! : e))
        );
        if (currentEvent?.event_id === eventId) {
          setCurrentEvent(response.event!);
        }
        return response.event!;
      }
      throw new Error('Failed to update event: event is undefined');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update event';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEvent]);

  const deleteEvent = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await EventService.delete(eventId);
      setEvents((prev) => prev.filter((e) => e.event_id !== eventId));
      if (currentEvent?.event_id === eventId) {
        setCurrentEvent(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete event';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentEvent]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: EventContextType = {
    events,
    currentEvent,
    isLoading,
    error,
    fetchEvents,
    fetchRecentEvents,
    fetchEventById,
    fetchEventsByVenue,
    createEvent,
    updateEvent,
    deleteEvent,
    clearError,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvent() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
