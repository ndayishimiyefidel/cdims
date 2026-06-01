import { api } from '../api';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role_id: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role_id: number;
  active: boolean;
}

export interface UpdateUserInput {
  full_name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role_id?: number;
  active?: boolean;
}

const userService = {
  getAllUsers: async (): Promise<User[]> => {
    try {
      const result: any = await api.get('/users');
      return result.users || result;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getUserById: async (id: string): Promise<User> => {
    try {
      const result: any = await api.get(`/users/${id}`);
      return result.user || result;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  createUser: async (data: CreateUserInput): Promise<User> => {
    try {
      const result: any = await api.post('/users', data);
      return result.user || result;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  updateUser: async (id: string, data: UpdateUserInput): Promise<User> => {
    try {
      const result: any = await api.put(`/users/${id}`, data);
      return result.user || result;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  deleteUser: async (id: string): Promise<void> => {
    try {
      await api.delete(`/users/${id}`);
      return;
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },
};

export default userService;
