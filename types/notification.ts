export interface Notification {
  notification_id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
  data?: {
    event_id?: string;
    ticket_id?: string;
    payment_id?: string;
    [key: string]: any;
  };
}

export interface NotificationResponse {
  message?: string;
  notifications: Notification[];
  unread_count?: number;
  pagination?: {
    hasMore: boolean;
    limit: number;
    offset: number;
    total: number;
  };
}