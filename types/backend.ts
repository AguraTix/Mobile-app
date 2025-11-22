/**
 * Backend API Response and Generic Types
 * Core response wrappers and pagination interfaces
 */

// ============================================================================
// PAGINATION INTERFACES
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

// ============================================================================
// GENERIC API LIST RESPONSE WRAPPER
// ============================================================================

export interface ApiListResponse<T> {
  message?: string;
  data?: T[];
  items?: T[];
  count?: number;
  total?: number;
  pagination?: PaginationMeta;
  error?: string;
  [key: string]: any;
}
