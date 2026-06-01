import { api } from '../api';

// Define interfaces for the requisition data structure
export interface MaterialRequisition {
  id: number;
  site_id: number;
  requested_by: number;
  notes: string;
  status:  'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITING_PADIRI_REVEIW';
  site: {
    id: number;
    code: string;
    name: string;
    location: string;
    created_at: string;
    updated_at: string;
  };
  requestedBy: {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    role: {
      id: number;
      name: string;
    };
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  items: {
    id: number;
    material_id: number;
    unit_id: number;
    qty_requested: number;
    qty_approved: number;
    material: {
      id: number;
      name: string;
      description: string;
      code: string;
      specifications: string;
      unit_price: number;
      category: {
        id: number;
        name: string;
      };
      unit?: {
        // Made unit optional to handle cases where it might be missing
        id: number;
        name: string;
        symbol?: string; // Made symbol optional to prevent undefined errors
      };
      created_at: string;
      updated_at: string;
    };
  }[];
  approvals: {
    id: number;
    level: 'DSE' | 'MANAGER' | 'DIRECTOR';
    action: 'APPROVED' | 'REJECTED' | 'PENDING';
    comment: string;
    reviewer: {
      id: number;
      full_name: string;
      email: string;
      phone: string;
      role: {
        id: number;
        name: string;
      };
      active: boolean;
      created_at: string;
      updated_at: string;
    };
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface CreateRequisitionInput {
  site_id: number;
  notes: string;
  items: {
    material_id: number;
    unit_id: number;
    qty_requested: number;
  }[];
}

export interface UpdateRequisitionInput {
  site_id?: number;
  notes?: string;
  status?: MaterialRequisition['status'];
  items?: {
    id?: number;
    material_id: number;
    unit_id: number;
    qty_requested: number;
    qty_approved?: number;
  }[];
}

export interface RequisitionResponse {
  success: boolean;
  data: {
    requests: MaterialRequisition[];
    pagination: {
      current_page: number;
      total_pages: number;
      total_items: number;
      items_per_page: number;
    };
  };
}

export interface ReceiveMaterialItem {
  request_item_id: number;
  qty_received: number;
  receipt_notes?: string;
  damage_notes?: string;
}

export interface ReceiveMaterialsResponse {
  success: boolean;
  data: {
    request_id: number;
    received_items: {
      request_item_id: number;
      material_name: string;
      qty_received: number;
      total_received: number;
    }[];
    request_status: 'RECEIVED' | 'PARTIALLY_RECEIVED';
    all_items_received: boolean;
  };
}


export interface ModifyRequestItem {
  request_item_id?: number; // optional for new items
  material_id?: number;
  unit_id?: number;
  qty_requested?: number;
  qty_approved?: number;
}

export interface ModifyRequestInput {
  notes?: string;
  item_modifications?: ModifyRequestItem[];
  items_to_add?: ModifyRequestItem[];
  items_to_remove?: number[]; // request_item_id array
  modification_reason?: string;
}

export interface ModifyRequestResponse {
  success: boolean;
  data: {
    request: MaterialRequisition;
    modifications: {
      items_modified: number;
      items_added: number;
      items_removed: number;
      new_status: string;
    };
  };
}

export interface ApproveRequestItemModification {
  request_item_id: number;
  material_id?: number;
  unit_id?: number;
  qty_approved?: number;
  notes?: string;
}

export interface ApproveRequestPayload {
  level: 'DSE' | 'PADIRI' | 'ADMIN';
  comment: string;
  item_modifications?: ApproveRequestItemModification[];
  items_to_add?: ApproveRequestItemModification[];
  items_to_remove?: number[]; // request_item_id array
  modification_reason?: string;
}

export interface ApproveRequestResponse {
  success: boolean;
  data: {
    request: MaterialRequisition;
  };
  message: string;
}

const requisitionService = {
  // Fetch all requisitions with pagination
  getAllRequisitions: async (): Promise<RequisitionResponse> => {
    try {
      const result: any = await api.get('/requests');
      if (!result?.requests) {
        throw new Error('Invalid response structure');
      }
      return { success: true, data: result };
    } catch (error: unknown) {
      console.error('Error fetching requisitions:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch requisitions');
    }
  },

    getAllMyRequisitions: async (): Promise<RequisitionResponse> => {
    try {
      const result: any = await api.get('/requests/my-requests');
      if (!result?.requests) {
        throw new Error('Invalid response structure');
      }
      return { success: true, data: result };
    } catch (error: unknown) {
      console.error('Error fetching requisitions:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch requisitions');
    }
  },


  // Fetch a single requisition by ID
  getRequisitionById: async (id: string): Promise<MaterialRequisition> => {
    if (!id) {
      throw new Error('Requisition ID is required');
    }
    try {
      const result: any = await api.get(`/requests/${id}`);
      const request = result.request || result;
      // Validate that the material unit exists to prevent undefined errors
      request.items?.forEach((item: any) => {
        if (!item.material.unit) {
          console.warn(`Missing unit for material ID ${item.material_id}`);
          item.material.unit = { id: item.unit_id, name: 'Unknown', symbol: '' };
        }
      });
      return request;
    } catch (error: unknown) {
      console.error('Error fetching requisition:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to fetch requisition');
    }
  },
// Approve a requisition
approveRequisition:  async (
  requestId: string,
  level: 'DSE' | 'PADIRI' | 'ADMIN',
  comment: string,
  modifications?: {
    item_modifications?: ApproveRequestItemModification[];
    items_to_add?: ApproveRequestItemModification[];
    items_to_remove?: number[];
  }
): Promise<ApproveRequestResponse> => {
  if (!requestId) throw new Error('Request ID is required');
  if (!level) throw new Error('Approval level is required');
  if (!comment) throw new Error('Approval comment is required');

  try {
    const payload: ApproveRequestPayload = {
      level,
      comment,
      ...modifications,
    };

    const result: any = await api.post(
      `/requests/${requestId}/approve`,
      payload
    );

    if (!result?.request) {
      throw new Error('Invalid response structure from server');
    }

    return { success: true, data: { request: result.request }, message: 'Approved' };
  } catch (error: unknown) {
    console.error('Error approving request:', error);
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to approve request');
  }
},

  // Create a new requisition
  createRequisition: async (data: CreateRequisitionInput): Promise<MaterialRequisition> => {
    try {
      const result: any = await api.post('/requests', data);
      return result.request || result;
    } catch (error: unknown) {
      console.error('Error creating requisition:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create requisition');
    }
  },

  // Update an existing requisition
  updateRequisition: async (id: string, data: UpdateRequisitionInput): Promise<MaterialRequisition> => {
    if (!id) {
      throw new Error('Requisition ID is required');
    }
    try {
      const result: any = await api.put(`/requests/${id}`, data);
      return result.request || result;
    } catch (error: unknown) {
      console.error('Error updating requisition:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to update requisition');
    }
  },
  

  // Reject a requisition
rejectRequisition: async (
  id: string,
  level: string,
  reason: string,
  comment?: string
): Promise<MaterialRequisition> => {
  if (!id) {
    throw new Error('Requisition ID is required');
  }
  if (!reason) {
    throw new Error('Rejection reason is required');
  }

  try {
    const result: any = await api.post(
      `/requests/${id}/reject`,
      { level, reason, comment }
    );

    if (!result?.request) {
      throw new Error('Invalid response structure from server');
    }

    return result.request;
  } catch (error: unknown) {
    console.error('Error rejecting requisition:', error);
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to reject requisition');
  }
},

 receiveMaterials : async  (
  requestId: string,
  items: ReceiveMaterialItem[]
): Promise<ReceiveMaterialsResponse> => {
  if (!requestId) {
    throw new Error('Request ID is required');
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Items array is required and cannot be empty');
  }

  try {
    const result: any = await api.post(
      `/requests/${requestId}/receive`,
      { items }
    );

    if (!result) {
      throw new Error('Invalid response structure from server');
    }

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Error receiving materials:', error);
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to receive materials');
  }
},

// Close a requisition
closeRequisition: async (id: string, comment?: string): Promise<{ request_id: number; status: string }> => {
  if (!id) throw new Error('Requisition ID is required');

  try {
    const result: any = await api.post(
      `/requests/${id}/close`,
      { comment }
    );

    if (!result) {
      throw new Error('Invalid response structure from server');
    }

    return result;
  } catch (error: unknown) {
    console.error('Error closing requisition:', error);
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to close requisition');
  }
},

modifyRequest : async (
  requestId: string,
  payload: ModifyRequestInput
): Promise<ModifyRequestResponse> => {
  if (!requestId) {
    throw new Error('Request ID is required');
  }

  try {
    const result: any = await api.put(
      `/requests/${requestId}/modify`,
      payload
    );

    if (!result) {
      throw new Error('Invalid response structure from server');
    }

    return { success: true, data: result };
  } catch (error: unknown) {
    console.error('Error modifying request:', error);
    throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to modify request');
  }
},



  // Delete a requisition
  deleteRequisition: async (id: string): Promise<void> => {
    if (!id) {
      throw new Error('Requisition ID is required');
    }
    try {
      await api.delete(`/requests/${id}`);
      return;
    } catch (error: unknown) {
      console.error('Error deleting requisition:', error);
      throw new Error((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to delete requisition');
    }
  },

  getReceiptHistory: async (requestId: string, filters?: { page?: number; limit?: number; date_from?: string; date_to?: string }): Promise<unknown> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      
      const result = await api.get(`/requests/${requestId}/receipt-history?${params.toString()}`);
      return result;
    } catch (error: unknown) {
      console.error('Error fetching receipt history:', error);
      throw error;
    }
  },

  getSiteReceiptHistory: async (filters?: { 
    page?: number; 
    limit?: number; 
    site_id?: number; 
    site_engineer_id?: number; 
    date_from?: string; 
    date_to?: string; 
    material_id?: number; 
    has_losses?: boolean; 
  }): Promise<unknown> => {
    try {
      const params = new URLSearchParams();
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.site_id) params.append('site_id', filters.site_id.toString());
      if (filters?.site_engineer_id) params.append('site_engineer_id', filters.site_engineer_id.toString());
      if (filters?.date_from) params.append('date_from', filters.date_from);
      if (filters?.date_to) params.append('date_to', filters.date_to);
      if (filters?.material_id) params.append('material_id', filters.material_id.toString());
      if (filters?.has_losses !== undefined) params.append('has_losses', filters.has_losses.toString());
      
      const result = await api.get(`/requests/site-receipt-history?${params.toString()}`);
      return result;
    } catch (error: unknown) {
      console.error('Error fetching site receipt history:', error);
      throw error;
    }
  },


};

export default requisitionService;