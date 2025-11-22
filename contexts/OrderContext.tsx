import { OrderService } from "@/services/order";
import { FoodOrder, FoodOrderCreateInput } from "@/types/order";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface OrderContextType {
  orders: FoodOrder[];
  myOrders: FoodOrder[];
  currentOrder: FoodOrder | null;
  isLoading: boolean;
  error: string | null;
  fetchMyOrders: () => Promise<FoodOrder[]>;
  fetchOrderHistory: (page?: number, limit?: number) => Promise<FoodOrder[]>;
  fetchOrdersByEvent: (eventId: string, page?: number, limit?: number) => Promise<FoodOrder[]>;
  fetchOrder: (orderId: string) => Promise<FoodOrder>;
  getOrder: (orderId: string) => Promise<FoodOrder>;
  createOrder: (data: FoodOrderCreateInput) => Promise<FoodOrder>;
  updateOrder: (orderId: string, data: Partial<FoodOrder>) => Promise<FoodOrder>;
  deleteOrder: (orderId: string) => Promise<void>;
  clearError: () => void;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<FoodOrder[]>([]);
  const [myOrders, setMyOrders] = useState<FoodOrder[]>([]);
  const [currentOrder, setCurrentOrder] = useState<FoodOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMyOrders = useCallback(async (): Promise<FoodOrder[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getMyOrders();
      const orders = response.orders || [];
      setMyOrders(orders);
      return orders;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch my orders';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrder = useCallback(async (orderId: string): Promise<FoodOrder> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getById(orderId);
      const order = response.order;
      setCurrentOrder(order);
      return order;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrder = fetchOrder; // Alias for backward compatibility

  const createOrder = useCallback(async (data: FoodOrderCreateInput): Promise<FoodOrder> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.create(data);
      const order = response.order;
      setMyOrders(prev => [order, ...prev]);
      return order;
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
      const updatedOrder = response.order;
      setMyOrders(prev =>
        prev.map(order => order.order_id === orderId ? updatedOrder : order)
      );
      if (currentOrder?.order_id === orderId) {
        setCurrentOrder(updatedOrder);
      }
      return updatedOrder;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  const deleteOrder = useCallback(async (orderId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      await OrderService.delete(orderId);
      setMyOrders(prev => prev.filter(order => order.order_id !== orderId));
      if (currentOrder?.order_id === orderId) {
        setCurrentOrder(null);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete order';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentOrder]);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const fetchOrderHistory = useCallback(async (page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getHistory({ page, limit });
      return response.orders;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch order history';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchOrdersByEvent = useCallback(async (eventId: string, page = 1, limit = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await OrderService.getByEvent(eventId, { page, limit });
      return response.orders;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch event orders';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = {
    orders,
    myOrders,
    currentOrder,
    isLoading,
    error,
    fetchMyOrders,
    fetchOrderHistory,
    fetchOrdersByEvent,
    fetchOrder,
    getOrder,
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

export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
