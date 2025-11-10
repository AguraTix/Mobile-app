export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  role: 'Admin' | 'Attendee';
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}