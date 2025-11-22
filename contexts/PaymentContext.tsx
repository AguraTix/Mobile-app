import { PaymentService } from '@/services/payment';
import { Payment, PaymentCreateInput } from '@/types/payment';
import React, { createContext, useCallback, useContext, useState } from 'react';

interface PaymentContextType {
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  createPayment: (data: PaymentCreateInput) => Promise<Payment>;
  verifyPayment: (paymentId: string) => Promise<Payment>;
  getPayment: (paymentId: string) => Promise<Payment>;
  clearError: () => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(async (data: PaymentCreateInput): Promise<Payment> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PaymentService.create(data);
      const payment = response.payment;
      setCurrentPayment(payment);
      return payment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create payment';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifyPayment = useCallback(async (paymentId: string): Promise<Payment> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PaymentService.verify(paymentId);
      const payment = response.payment;
      setCurrentPayment(payment);
      return payment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify payment';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPayment = useCallback(async (paymentId: string): Promise<Payment> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await PaymentService.getById(paymentId);
      const payment = response.payment;
      setCurrentPayment(payment);
      return payment;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch payment';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: PaymentContextType = {
    currentPayment,
    isLoading,
    error,
    createPayment,
    verifyPayment,
    getPayment,
    clearError,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
