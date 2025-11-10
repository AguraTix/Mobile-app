export interface Payment {
  payment_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'mobile_money' | 'bank_transfer';
  transaction_id?: string;
  user_id: string;
  timestamp: string;
}

export interface PaymentResponse {
  message: string;
  payment: Payment;
  receipt_url?: string;
}