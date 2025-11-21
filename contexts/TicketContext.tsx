import { TicketService } from "@/services/ticket";
import { Ticket, TicketGrouped } from "@/types/backend";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";

interface TicketContextType {
  availableTickets: TicketGrouped[];
  myTickets: Ticket[];
  isLoading: boolean;
  error: string | null;
  fetchAvailableTickets: (eventId: string) => Promise<void>;
  fetchMyTickets: () => Promise<void>;
  bookTicket: (ticketId: string) => Promise<Ticket>;
  cancelTicket: (ticketId: string) => Promise<void>;
  clearError: () => void;
}

const TicketContext = createContext<TicketContextType | null>(null);

export function TicketProvider({ children }: { children: ReactNode }) {
  const [availableTickets, setAvailableTickets] = useState<TicketGrouped[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailableTickets = useCallback(async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await TicketService.getAvailable(eventId);
      setAvailableTickets(response.groupedTickets);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch available tickets';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await TicketService.getMyTickets();
      setMyTickets(response.tickets);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch my tickets';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookTicket = useCallback(async (ticketId: string): Promise<Ticket> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await TicketService.book(ticketId);
      setMyTickets((prev) => [...prev, response.ticket]);
      return response.ticket;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book ticket';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cancelTicket = useCallback(async (ticketId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await TicketService.cancel(ticketId);
      setMyTickets((prev) => prev.filter((t) => t.ticket_id !== ticketId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel ticket';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: TicketContextType = {
    availableTickets,
    myTickets,
    isLoading,
    error,
    fetchAvailableTickets,
    fetchMyTickets,
    bookTicket,
    cancelTicket,
    clearError,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicket() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTicket must be used within a TicketProvider');
  }
  return context;
}
