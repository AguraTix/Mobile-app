// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  ATTENDEE = 'Attendee',
  ADMIN = 'Admin'
}

// ============================================================================
// USER INTERFACES
// ============================================================================

export interface UserRegisterInput {
  email: string;
  password: string;
  name: string;
  phone_number: string;
}

export interface UserLoginInput {
  identifier: string; // Email or phone number
  password: string;
}

export interface UserUpdateRoleInput {
  role: UserRole;
}

export interface User {
  user_id: string;
  email: string;
  phone_number: string;
  name: string;
  profile_photo?: string;
  role: UserRole;
  preferences?: Record<string, any>;
  verificationCode?: string;
  codeExpiresAt?: string;
}

export interface UserRegisterOutput {
  message: string;
  user_id: string;
}

export interface UserLoginOutput {
  message: string;
  token: string;
  user: User;
}

export interface UserUpdateRoleOutput {
  message: string;
  user: User;
}

// ============================================================================
// PASSWORD RESET INTERFACES
// ============================================================================

export interface PasswordResetRequestInput {
  identifier: string; // Email or phone number
}

export interface PasswordResetRequestOutput {
  message: string;
  [key: string]: any;
}

export interface PasswordResetVerifyInput {
  identifier: string;
  verification_code: string;
}

export interface PasswordResetVerifyOutput {
  message: string;
  [key: string]: any;
}

export interface PasswordResetInput {
  identifier: string;
  verification_code: string;
  new_password: string;
}

export interface PasswordResetOutput {
  message: string;
  [key: string]: any;
}

// ============================================================================
// AUTHENTICATION INTERFACES
// ============================================================================

export interface AuthToken {
  token: string;
  expiresIn?: string;
}

export interface AuthContext {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}