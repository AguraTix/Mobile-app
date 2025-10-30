import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { ApiResponse, AuthResponse, LoginRequest, SignupRequest, GoogleAuthRequest } from "@/types";

export class AuthService {
    async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    }

    async signup(data: SignupRequest): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>(API_ENDPOINTS.AUTH.SIGNUP, data)
    }

    async googleRegister(data: GoogleAuthRequest): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_REGISTER, data)
    }

    async googleLogin(data: string): Promise<ApiResponse<AuthResponse>> {
        return await client.post<AuthResponse>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: data })
    }

}

export const authService = new AuthService()