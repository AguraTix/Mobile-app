import {
    PasswordResetInput,
    PasswordResetOutput,
    PasswordResetRequestInput,
    PasswordResetRequestOutput,
    PasswordResetVerifyInput,
    PasswordResetVerifyOutput,
    UserLoginInput,
    UserLoginOutput,
    UserRegisterInput,
    UserRegisterOutput,
} from '@/types/backend';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export class AuthService {
  async login(data: UserLoginInput): Promise<UserLoginOutput> {
    return await client.post<UserLoginOutput>(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  async register(data: UserRegisterInput): Promise<UserRegisterOutput> {
    return await client.post<UserRegisterOutput>(API_ENDPOINTS.AUTH.SIGNUP, data);
  }

  async requestPasswordReset(data: PasswordResetRequestInput): Promise<PasswordResetRequestOutput> {
    return await client.post<PasswordResetRequestOutput>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET_REQUEST,
      data
    );
  }

  async verifyPasswordReset(data: PasswordResetVerifyInput): Promise<PasswordResetVerifyOutput> {
    return await client.post<PasswordResetVerifyOutput>(
      API_ENDPOINTS.AUTH.PASSWORD_RESET_VERIFY,
      data
    );
  }

  async resetPassword(data: PasswordResetInput): Promise<PasswordResetOutput> {
    return await client.post<PasswordResetOutput>(API_ENDPOINTS.AUTH.PASSWORD_RESET, data);
  }

  async logout(): Promise<void> {
    return await client.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }
}

export const authService = new AuthService();