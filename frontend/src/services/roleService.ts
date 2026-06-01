import { api } from '../api';

export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface CreateRoleInput {
  name: string;
  description: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

const roleService = {
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const result: any = await api.get('/users/roles');
      return result.roles || result;
    } catch (error: any) {
      console.error('Error fetching roles:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },

  getRoleById: async (id: number): Promise<Role> => {
    try {
      const result: any = await api.get(`/users/roles/${id}`);
      return result.role || result;
    } catch (error: any) {
      console.error('Error fetching role:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch role');
    }
  },

  createRole: async (data: CreateRoleInput): Promise<Role> => {
    try {
      const result: any = await api.post('/users/roles', data);
      return result.role || result;
    } catch (error: any) {
      console.error('Error creating role:', error);
      throw new Error(error.response?.data?.message || 'Failed to create role');
    }
  },

  updateRole: async (id: number, data: UpdateRoleInput): Promise<Role> => {
    try {
      const result: any = await api.put(`/users/roles/${id}`, data);
      return result.role || result;
    } catch (error: any) {
      console.error('Error updating role:', error);
      throw new Error(error.response?.data?.message || 'Failed to update role');
    }
  },

  deleteRole: async (id: number): Promise<void> => {
    try {
      await api.delete(`/users/roles/${id}`);
      return;
    } catch (error: any) {
      console.error('Error deleting role:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete role');
    }
  },
};

export default roleService;
