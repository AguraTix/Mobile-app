import {
    Payment,
    PaymentCreateInput,
    PaymentCreateOutput,
    PaymentVerifyOutput,
} from '@/types/backend';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export const PaymentService = {
  create: (data: PaymentCreateInput): Promise<PaymentCreateOutput> =>
    client.post<PaymentCreateOutput>(API_ENDPOINTS.PAYMENTS.CREATE, data),

  verify: (paymentId: string): Promise<PaymentVerifyOutput> =>
    client.post<PaymentVerifyOutput>(API_ENDPOINTS.PAYMENTS.VERIFY(paymentId)),

  getById: (paymentId: string): Promise<{ message: string; payment: Payment }> =>
    client.get<{ message: string; payment: Payment }>(API_ENDPOINTS.PAYMENTS.BY_ID(paymentId)),

  getHistory: (params?: { page?: number; limit?: number }): Promise<{ message: string; payments: Payment[] }> =>
    client.get<{ message: string; payments: Payment[] }>(API_ENDPOINTS.PAYMENTS.HISTORY, params as Record<string, unknown>),
};
