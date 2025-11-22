import {
  User,
  UserRegisterInput,
  UserRegisterOutput,
  UserUpdateRoleInput,
  UserUpdateRoleOutput,
} from '@/types/auth';
import { client } from './client';
import { API_ENDPOINTS } from './constants';

export const UserService = {
  register: (data: UserRegisterInput): Promise<UserRegisterOutput> =>
    client.post<UserRegisterOutput>(API_ENDPOINTS.USERS.REGISTER, data),

  registerAdmin: (data: UserRegisterInput): Promise<UserRegisterOutput> =>
    client.post<UserRegisterOutput>(API_ENDPOINTS.USERS.REGISTER_ADMIN, data),

  getAll: (): Promise<{ message: string; users: User[] }> =>
    client.get<{ message: string; users: User[] }>(API_ENDPOINTS.USERS.ALL),

  getMe: (): Promise<{ message: string; user: User }> =>
    client.get<{ message: string; user: User }>(API_ENDPOINTS.USERS.ME),

  getById: (userId: string): Promise<{ message: string; user: User }> =>
    client.get<{ message: string; user: User }>(API_ENDPOINTS.USERS.BY_ID(userId)),

  updateRole: (userId: string, data: UserUpdateRoleInput): Promise<any> =>
    client.patch<UserUpdateRoleOutput>(API_ENDPOINTS.USERS.UPDATE_ROLE(userId), data),

  update: (userId: string, data: Partial<User>): Promise<{ message: string; user: User }> =>
    client.put<{ message: string; user: User }>(API_ENDPOINTS.USERS.UPDATE(userId), data),

  delete: (userId: string): Promise<{ message: string }> =>
    client.delete<{ message: string }>(API_ENDPOINTS.USERS.DELETE(userId)),
};
