import { FoodOrder } from "@/types/order";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface CartItem extends FoodOrder {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (orderId: string) => void;
  updateItemQuantity: (orderId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.order_id === item.order_id);
      if (existing) {
        return prev.map((i) =>
          i.order_id === item.order_id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((orderId: string) => {
    setItems((prev) => prev.filter((i) => i.order_id !== orderId));
  }, []);

  const updateItemQuantity = useCallback((orderId: string, quantity: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.order_id === orderId ? { ...i, quantity: Math.max(0, quantity) } : i
      ).filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = items.reduce((sum, item) => sum + (item.quantity * (item.Food?.foodprice || 0)), 0);

  const value: CartContextType = {
    items,
    totalPrice,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
