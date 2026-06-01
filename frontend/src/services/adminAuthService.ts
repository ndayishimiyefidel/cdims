/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../api';
import { type AxiosInstance } from 'axios';

interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: Role;
  active: boolean;
}

export interface AuthResponse {
  authenticated: any;
  twoFARequired: any;
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message: string;
}

interface LoginData {
  identifier: string; // can be email or phone
  password: string;
}

class AdminAuthService {
  private api: AxiosInstance = api;

  /**
   * Login with email or phone
   * Maps 'identifier' to 'email' for backend
   */
  async adminLogin(loginData: LoginData): Promise<AuthResponse> {
    try {
      const payload = {
        email: loginData.identifier, // backend expects "email"
        password: loginData.password,
      };

      const result = await this.api.post(
        '/auth/login',
        payload
      );

      return result as unknown as AuthResponse;
      // Note: interceptor returns { token, user }, not full AuthResponse — unused currently
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to login admin';
      throw new Error(msg);
    }
  }

  /**
   * Get currently logged-in user profile
   */
  async getAdminProfile(): Promise<User | null> {
    try {
      const result = await this.api.get('/auth/profile');

      return result.user;
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 401) return null;
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch admin profile';
      throw new Error(msg);
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<{ message: string }> {
    try {
      const result = await this.api.post('/auth/logout');
      localStorage.removeItem('auth_token');
      return result as { message: string };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to logout admin';
      throw new Error(msg);
    }
  }
}

const adminAuthService = new AdminAuthService();
export default adminAuthService;
export const { adminLogin, getAdminProfile, logout } = adminAuthService;
