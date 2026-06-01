/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '../api';

interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: Role;
  active?: boolean;
  first_login?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  requires_password_change?: boolean;
  data?: {
    token: string;
    user: User;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    user: User;
  };
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const result: any = await api.post(
        '/auth/login',
        loginData
      );

      if (result?.token) {
        localStorage.setItem('auth_token', result.token);
      }

      return {
        success: true,
        message: 'Login successful',
        data: result,
      };
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Login failed';
      throw new Error(msg);
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User | null> {
    try {
      const result = await api.get('/auth/profile');

      return result.user;
    } catch (error: any) {
      // Handle 403 for password change required
      if (error.response?.status === 403 && error.response?.data?.requires_password_change) {
        return error.response.data.user || null;
      }
      if (error.response?.status === 401) return null;
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch profile';
      throw new Error(msg);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    try {
      const result = await api.put('/auth/profile', updates);

      return result.user;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to update profile';
      throw new Error(msg);
    }
  }

  /**
   * Change password
   */
  async changePassword(
    current_password: string,
    new_password: string
  ): Promise<string> {
    try {
      const result = await api.put(
        '/auth/change-password',
        { current_password, new_password }
      );

      return result.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to change password';
      throw new Error(msg);
    }
  }

  /**
   * Reset password (request reset link)
   */
  async resetPassword(email: string): Promise<string> {
    try {
      const result = await api.post('/auth/reset-password', { email });

      return result.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to reset password';
      throw new Error(msg);
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password: string): Promise<string> {
    try {
      const result = await api.delete('/auth/delete-account', {
        data: { password },
      });

      localStorage.removeItem('auth_token');
      return result.message;
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to delete account';
      throw new Error(msg);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<string> {
    try {
      const result = await api.post('/auth/logout', {});

      localStorage.removeItem('auth_token');
      return result.message;
    } catch (error: any) {
      localStorage.removeItem('auth_token');
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Failed to logout';
      throw new Error(msg);
    }
  }
}

const authService = new AuthService();
export default authService;