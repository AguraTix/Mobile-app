import { authService } from "@/services/auth";
import { ApiError } from "@/types";
import { User, UserLoginInput, UserRegisterInput } from "@/types/auth";
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Keyboard } from "react-native";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserLoginInput) => Promise<void>;
  register: (data: UserRegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: UserLoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.token);
      await SecureStore.setItemAsync('auth_token', response.token);
      await SecureStore.setItemAsync('user', JSON.stringify(response.user));
      Keyboard.dismiss();
      await loadUserData();
    } catch (err) {
      const message = err as unknown as ApiError
      setError(message.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: UserRegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      Keyboard.dismiss();
      router.replace('/auth/categories')
    } catch (err) {
      const message = err as unknown as ApiError
      setError(message.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      setUser(null);
      setToken(null);
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user');
      await loadUserData();
    } catch (err) {
      const message = err as unknown as ApiError
      setError(message.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadUserData = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('auth_token');
      const storedUser = await SecureStore.getItemAsync('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser))
        router.replace('/home');
      } else router.replace('/welcome')
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };
  useEffect(() => {
    loadUserData();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}