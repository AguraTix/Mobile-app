export interface ApiResponse<T = unknown> {
    success: boolean
    data: T
    message: string
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}


export interface ApiError {
    status: number
    message: string
    errors?: Record<string, string[]>
}

export interface DownloadResponse {
    data:string; 
    filename: string;
    contentType: string;
}