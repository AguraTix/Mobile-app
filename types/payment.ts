import { User } from './auth';
import { FoodOrder } from './order';

// ============================================================================
// ENUMS
// ============================================================================

export enum PaymentStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled'
}

// ============================================================================
// PAYMENT INTERFACES
// ============================================================================

export interface PaymentCreateInput {
  order_id: string;
  amount: number;
  payment_method: string;
  transaction_id?: string;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_status: PaymentStatus;
  transaction_id?: string;
  Order?: FoodOrder;
  User?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentCreateOutput {
  message: string;
  payment: Payment;
}

export interface PaymentVerifyOutput {
  message: string;
  payment: Payment;
  verified: boolean;
}

// Legacy interfaces for backward compatibility
export interface PaymentResponse {
  message: string;
  payment: Payment;
  receipt_url?: string;
}