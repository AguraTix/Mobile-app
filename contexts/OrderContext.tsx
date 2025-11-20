import { OrderService } from "@/services/order";
import { FoodOrder, FoodOrderCreateInput } from "@/types/backend";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface OrderContextType {
  orders: FoodOrder[];
  myOrders: FoodOrder[];
  isLoading: boolean;
  error: string | null;
  fetchMyOrders: () => Promise<void>;
  fetchOrderHistory: (page?: number, limit?: number) => Promise<void>;
  fetchOrdersByEvent: (eventId: string, page?: number, limit?: number) => Promise<void>;
  createOrder: (data: FoodOrderCreateInput) => Promise<FoodOrder>;
  updateOrder: (orderId: string, data: Partial<FoodOrder>) => Promise<FoodOrder>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [myOrders, setMyOrders] = useState<FoodOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getMyOrders();
      setMyOrders(response.orders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch my orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrderHistory = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getHistory({ page, limit });
      setMyOrders(response.orders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order history';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrdersByEvent = useCallback(async (eventId: string, page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getByEvent(eventId, { page, limit });
      setOrders(response.orders);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event orders';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (data: FoodOrderCreateInput): Promise<FoodOrder> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.create(data);
      setMyOrders((prev) => [...prev, response.order]);
      return response.order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId: string, data: Partial<FoodOrder>): Promise<FoodOrder> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.update(orderId, data);
      setMyOrders((prev) =>
        prev.map((o) => (o.order_id === orderId ? response.order : o))
      );
      return response.order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await OrderService.delete(orderId);
      setMyOrders((prev) => prev.filter((o) => o.order_id !== orderId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: OrderContextType = {
    orders,
    myOrders,
    isLoading,
    error,
    fetchMyOrders,
    fetchOrderHistory,
    fetchOrdersByEvent,
    createOrder,
    updateOrder,
    deleteOrder,
    clearError,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
