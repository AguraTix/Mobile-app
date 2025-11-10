import { client } from './client';
import { API_ENDPOINTS } from './constants';
import { User } from '@/types/auth';

type RegisterData = {
  email: string;
  password: string;
  name: string;
  phone_number?: string;
};

type LoginData = {
  identifier: string;
  password: string;
};

type RoleUpdate = {
  role: 'Admin' | 'Attendee';
};

export const UserService = {
  register: (data: RegisterData) => 
    client.post<{ message: string; user_id: string }>(API_ENDPOINTS.USERS.REGISTER, data),
  
  registerAdmin: (data: RegisterData) => 
    client.post<{ message: string; user_id: string }>(API_ENDPOINTS.USERS.REGISTER_ADMIN, data),
  
  login: (data: LoginData) => 
    client.post<{ message: string; token: string; user: User }>(API_ENDPOINTS.USERS.LOGIN, data),
  
  updateRole: (userId: string, data: RoleUpdate) => 
    client.patch<{ message: string; user: User }>(API_ENDPOINTS.USERS.UPDATE_ROLE(userId), data)
};
