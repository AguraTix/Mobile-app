export interface ValidationError {
  field: string;
  message: string;
}

export interface DetailedErrorResponse extends ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  validationErrors?: ValidationError[];
}

export interface ErrorResponse {
  error: string;
  details?: string;
}