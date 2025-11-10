// API Configuration Constants

const SERVER_URL = 'http://10.12.74.188:5050'

export const API_CONFIG = {
  BASE_URL: SERVER_URL,
  API_VERSION: 'v1',
  TIMEOUT: 60000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    SIGNUP: '/auth/register',
    GOOGLE_REGISTER: '/auth/google/register',
    GOOGLE_LOGIN: '/auth/google/login',
  },
  PROJECT: {
    ALL: '/projects',
    DASHBOARD: '/projects/dashboard',
    CREATE: '/projects',
    BY_ID: (id: string) => `/projects/${id}`,
    MY_PROJECTS: '/projects/my',
    BY_CATEGORY: (category: string) => `/projects/category/${category}`,
    BY_STATUS: (status: string) => `/projects/status/${status}`,
    TRENDING: '/projects/trending',
    SPOTLIGHT: '/projects/spotlight',
    SEARCH: (title: string) => `/projects/search?title=${title}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
    STATISTICS: '/projects/statistics',
    OVERVIEW: '/projects/overview',
    UPLOAD: '/upload/projects',
    LIKE: (id: string) => `/projects/${id}/like`,
    DISLIKE: (id: string) => `/projects/${id}/unlike`,
    COMMENT: (id: string) => `/projects/${id}/comment`,
    SHARE: (id: string) => `/projects/${id}/share`,
    ADD_DONOR: (id: string) => `/projects/${id}/donor`,
    
  },
  USER: {
    ALL: '/users',
    ME: '/users/me',
    GRADUATE: '/users/graduates',
    SPONSORS: '/users/sponsors',
    CREATE: '/users',
    REPORTS: '/worker-reports',
    REPORT: (id: string) => `/worker-reports/${id}`,
    BY_ID: (id: string) => `/projects/workers/${id}`,
    UPDATE: (id: string) => `/projects/workers/${id}`,
    DELETE: (id: string) => `/projects/workers/${id}`,
  },

  ADMIN: {
    USER: {
      ALL: '/admin/users',
      CREATE: '/admin/users',
    },
    PROJECT: {
      ALL: '/admin/projects',
      ANALYTICS: '/admin/projects/analytics',
      BY_ID: (id: string) => `/admin/projects/${id}`,
      STATS: '/admin/projects/stats',
    }
  },
  UPLOAD: {
    BASE: '/upload/image'
  },
  
  USERS: {
    REGISTER: '/users/register',
    REGISTER_ADMIN: '/users/register-admin',
    LOGIN: '/users/login',
    UPDATE_ROLE: (id: string) => `/users/${id}/role`
  },
  
  EVENTS: {
    ALL: '/events',
    RECENT: '/events/recent',
    BY_ID: (id: string) => `/events/${id}`,
    BY_VENUE: (venueId: string) => `/events/venue/${venueId}`,
    IMAGES: (id: string) => `/events/${id}/images`
  },
  
  FOODS: {
    ALL: '/foods',
    BY_ID: (id: string) => `/foods/${id}`,
    BY_EVENT: (eventId: string) => `/foods/event/${eventId}`
  },
  
  TICKETS: {
    AVAILABLE: (eventId: string) => `/tickets/event/${eventId}/available`,
    BOOK: (ticketId: string) => `/tickets/${ticketId}/book`,
    MY_TICKETS: '/tickets/my-tickets',
    CANCEL: (ticketId: string) => `/tickets/${ticketId}/cancel`,
    ADMIN_BOOKED: '/tickets/admin/booked'
  },
  
  VENUES: {
    ALL: '/venues',
    BY_ID: (id: string) => `/venues/${id}`
  },
  
  ORDERS: {
    ALL: '/orders',
    MY_ORDERS: '/orders/my-orders',
    HISTORY: '/orders/history',
    BY_EVENT: (eventId: string) => `/orders/event/${eventId}`,
    BY_ID: (id: string) => `/orders/${id}`
  }
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