export interface Notification {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'event' | 'ticket' | 'payment' | 'system';
  is_read: boolean;
  created_at: string;
  metadata?: {
    event_id?: string;
    ticket_id?: string;
    payment_id?: string;
  };
}

export interface NotificationResponse {
  message: string;
  notifications: Notification[];
  unread_count: number;
}