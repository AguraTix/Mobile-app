// API Configuration Constants

const SERVER_URL = 'https://agurabackend.onrender.com'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  TIMEOUT: 60000,
};

export const API_ENDPOINTS = {
  // ============================================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================================
  AUTH: {
    LOGIN: '/users/login',
    LOGOUT: '/users/logout',
    SIGNUP: '/users/register',
    GOOGLE_REGISTER: '/auth/google/register',
    GOOGLE_LOGIN: '/auth/google/login',
    PASSWORD_RESET_REQUEST: '/auth/password-reset/request',
    PASSWORD_RESET_VERIFY: '/auth/password-reset/verify',
    PASSWORD_RESET: '/auth/password-reset',
  },

  // ============================================================================
  // USER ENDPOINTS
  // ============================================================================
  USERS: {
    REGISTER: '/users/register',
    REGISTER_ADMIN: '/users/register-admin',
    LOGIN: '/users/login',
    UPDATE_ROLE: (id: string) => `/users/${id}/role`,
    ALL: '/users',
    ME: '/users/me',
    BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // ============================================================================
  // VENUE ENDPOINTS
  // ============================================================================
  VENUES: {
    ALL: '/venues',
    CREATE: '/venues',
    BY_ID: (id: string) => `/venues/${id}`,
    UPDATE: (id: string) => `/venues/${id}`,
    DELETE: (id: string) => `/venues/${id}`,
  },

  // ============================================================================
  // EVENT ENDPOINTS
  // ============================================================================
  EVENTS: {
    ALL: '/events',
    CREATE: '/events',
    RECENT: '/events/recent',
    UPCOMING:'/events/upcoming',
    FEATURED:'/events/upcoming',
    BY_ID: (id: string) => `/events/${id}`,
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
    BY_VENUE: (venueId: string) => `/events/venue/${venueId}`,
    IMAGES: (id: string) => `/events/${id}/images`,
  },

  // ============================================================================
  // TICKET ENDPOINTS
  // ============================================================================
  TICKETS: {
    AVAILABLE: (eventId: string) => `/tickets/event/${eventId}/available`,
    BOOK: (eventId: string) => `/tickets/event/${eventId}/purchase`,
    MY_TICKETS: '/tickets/my',
    CANCEL: (ticketId: string) => `/tickets/${ticketId}/cancel`,
    ADMIN_BOOKED: '/tickets/admin/booked',
    TICKET_QR: (ticketId: string) => `/tickets/${ticketId}/qrcode`,
  },

  // ============================================================================
  // FOOD ENDPOINTS
  // ============================================================================
  FOODS: {
    ALL: '/foods',
    GENERAL:'/foods/general',
    CREATE: '/foods',
    BY_ID: (id: string) => `/foods/${id}`,
    UPDATE: (id: string) => `/foods/${id}`,
    DELETE: (id: string) => `/foods/${id}`,
    BY_EVENT: (eventId: string) => `/foods/event/${eventId}`,
  },

  // ============================================================================
  // FOOD ORDER ENDPOINTS
  // ============================================================================
  FOOD_ORDERS: {
    ALL: '/food-orders',
    CREATE: '/food-orders',
    MY_ORDERS: '/food-orders/my-orders',
    HISTORY: '/food-orders/history',
    BY_EVENT: (eventId: string) => `/food-orders/event/${eventId}`,
    BY_ID: (id: string) => `/food-orders/${id}`,
    UPDATE: (id: string) => `/food-orders/${id}`,
    DELETE: (id: string) => `/food-orders/${id}`,
  },

  // ============================================================================
  // PAYMENT ENDPOINTS
  // ============================================================================
  PAYMENTS: {
    ALL: '/payments',
    CREATE: '/payments',
    VERIFY: (paymentId: string) => `/payments/${paymentId}/verify`,
    BY_ID: (paymentId: string) => `/payments/${paymentId}`,
    HISTORY: '/payments/history',
  },

  // ============================================================================
  // UPLOAD ENDPOINTS
  // ============================================================================
  UPLOAD: {
    BASE: '/upload/image',
    EVENT_IMAGE: '/upload/event-image',
    FOOD_IMAGE: '/upload/food-image',
  },
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
}