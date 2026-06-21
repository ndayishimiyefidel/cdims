import { type AxiosInstance } from 'axios'; // Type-only imports for verbatimModuleSyntax
import { api } from '../api'; // Adjust the import path as needed

// When fetching all records, override backend's default pagination limit (10) to get everything
const FETCH_ALL_LIMIT = 99999;

// Interface for Material
export interface Material {
  id: number;
  code?: string;
  name: string;
  specification?: string;
  category_id?: number;
  unit_id: number;
  active?: boolean;
  createdAt?: Date;
  updated_at?: Date;
  category?: Category;
  unit?: Unit;
}

// Interface for Category
export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

// Interface for Unit
export interface Unit {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

// Interface for Material Price
export interface MaterialPrice {
  id: number;
  material_id: number;
  unit_price: number;
  effective_date: string;
  created_at?: Date;
}

// Interfaces for input data
export type CreateMaterialInput = Omit<Material, 'id' | 'created_at' | 'updated_at' | 'category' | 'unit'>;
export type UpdateMaterialInput = Partial<CreateMaterialInput>;

export type CreateCategoryInput = Omit<Category, 'id' | 'created_at' | 'updated_at'>;
export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export type CreateUnitInput = Omit<Unit, 'id' | 'created_at' | 'updated_at'>;
export type UpdateUnitInput = Partial<CreateUnitInput>;

export type CreateMaterialPriceInput = Omit<MaterialPrice, 'id' | 'created_at'>;

// Interface for filtering
export interface FilterParams {
  search?: string;
  category_id?: number;
  active?: boolean;
  limit?: number;
}

// Interface for validation result
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Interface for delete response
interface DeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Material Service
 * Handles all material, category, and unit-related API calls
 */
class MaterialService {
  private api: AxiosInstance = api; // Reference to axios instance

  // =============== MATERIAL METHODS ===============

  /**
   * Get all materials with optional filtering
   * @param params - Query parameters for filtering
   * @returns Array of materials
   */
  async getAllMaterials(params?: FilterParams): Promise<Material[]> {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.category_id) queryParams.append('category_id', params.category_id.toString());
      if (params?.active !== undefined) queryParams.append('active', params.active.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      // Default to fetching all records if no explicit limit is provided
      if (!params?.limit) queryParams.append('limit', FETCH_ALL_LIMIT.toString());

      const result: any = await this.api.get(`/materials?${queryParams.toString()}`);
      return result.materials;
    } catch (error:unknown) {
      console.error('Error fetching materials:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch materials';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get material by ID
   * @param id - Material ID
   * @returns Material or null if not found
   */
  async getMaterialById(id: number | string): Promise<Material | null> {
    try {
      const result: any = await this.api.get(`/materials/${id}`);
      return result.material || result;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      console.error('Error fetching material by ID:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch material';
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new material
   * @param materialData - Material data
   * @returns Created material
   */
  async createMaterial(materialData: CreateMaterialInput): Promise<Material> {
    try {
      const result: any = await this.api.post('/materials', materialData);
      return result.material || result;
    } catch (error: unknown) {
      console.error('Error creating material:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to create material';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a material
   * @param id - Material ID
   * @param updateData - Data to update
   * @returns Updated material
   */
  async updateMaterial(id: number | string, updateData: UpdateMaterialInput): Promise<Material> {
    try {
      const result: any = await this.api.put(`/materials/${id}`, updateData);
      return result.material || result;
    } catch (error: unknown) {
      console.error('Error updating material:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to update material';
      throw new Error(errorMessage);
    }
  }

  /**
   * Bulk create materials from an array
   * @param materials - Array of material data to create
   * @returns Response with created count and any errors
   */
  async bulkCreateMaterials(materials: CreateMaterialInput[]): Promise<{ created: number; failed: number; errors: any[] }> {
    try {
      const result: any = await this.api.post('/materials/bulk', { materials });
      return result;
    } catch (error: unknown) {
      console.error('Error bulk creating materials:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to bulk create materials';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a material (soft delete)
   * @param id - Material ID
   * @returns Response with success message
   */
  async deleteMaterial(id: number | string): Promise<DeleteResponse> {
    try {
      const result = await this.api.delete(`/materials/${id}`);
      return result;
    } catch (error: unknown) {
      console.error('Error deleting material:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to delete material';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get material prices
   * @param id - Material ID
   * @returns Array of material prices
   */
  async getMaterialPrices(id: number | string): Promise<MaterialPrice[]> {
    try {
      const result: any = await this.api.get(`/materials/${id}/prices`);
      return result;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return [];
      }
      console.error('Error fetching material prices:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch material prices';
      throw new Error(errorMessage);
    }
  }

  /**
   * Add material price
   * @param id - Material ID
   * @param priceData - Price data
   * @returns Added price
   */
  async addMaterialPrice(id: number | string, priceData: CreateMaterialPriceInput): Promise<MaterialPrice> {
    try {
      const result: any = await this.api.post(`/materials/${id}/prices`, priceData);
      return result.price || result;
    } catch (error: unknown) {
      console.error('Error adding material price:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to add material price';
      throw new Error(errorMessage);
    }
  }

  // =============== CATEGORY METHODS ===============

  /**
   * Get all categories
   * @returns Array of categories
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const result: any = await this.api.get('/materials/categories');
      return result.categories;
    } catch (error: unknown) {
      console.error('Error fetching categories:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch categories';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get category by ID
   * @param id - Category ID
   * @returns Category or null if not found
   */
  async getCategoryById(id: number | string): Promise<Category | null> {
    try {
      const result: any = await this.api.get(`/materials/categories/${id}`);
      return result.category || result;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      console.error('Error fetching category by ID:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch category';
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new category
   * @param categoryData - Category data
   * @returns Created category
   */
  async createCategory(categoryData: CreateCategoryInput): Promise<Category> {
    try {
      const result: any = await this.api.post('/materials/categories', categoryData);
      return result.category || result;
    } catch (error: unknown) {
      console.error('Error creating category:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to create category';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param updateData - Data to update
   * @returns Updated category
   */
  async updateCategory(id: number | string, updateData: UpdateCategoryInput): Promise<Category> {
    try {
      const result: any = await this.api.put(`/materials/categories/${id}`, updateData);
      return result.category || result;
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to update category';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a category
   * @param id - Category ID
   * @returns Response with success message
   */
  async deleteCategory(id: number | string): Promise<DeleteResponse> {
    try {
      const result = await this.api.delete(`/materials/categories/${id}`);
      return result;
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to delete category';
      throw new Error(errorMessage);
    }
  }

  // =============== UNIT METHODS ===============

  /**
   * Get all units
   * @returns Array of units
   */
  async getAllUnits(): Promise<Unit[]> {
    try {
      const result: any = await this.api.get('/materials/units');
      return result.units;
    } catch (error: unknown) {
      console.error('Error fetching units:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch units';
      throw new Error(errorMessage);
    }
  }

  /**
   * Get unit by ID
   * @param id - Unit ID
   * @returns Unit or null if not found
   */
  async getUnitById(id: number | string): Promise<Unit | null> {
    try {
      const result: any = await this.api.get(`/materials/units/${id}`);
      return result.unit || result;
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 404) {
        return null;
      }
      console.error('Error fetching unit by ID:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to fetch unit';
      throw new Error(errorMessage);
    }
  }

  /**
   * Create a new unit
   * @param unitData - Unit data
   * @returns Created unit
   */
  async createUnit(unitData: CreateUnitInput): Promise<Unit> {
    try {
      const result: any = await this.api.post('/materials/units', unitData);
      return result.unit || result;
    } catch (error: unknown) {
      console.error('Error creating unit:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to create unit';
      throw new Error(errorMessage);
    }
  }

  /**
   * Update a unit
   * @param id - Unit ID
   * @param updateData - Data to update
   * @returns Updated unit
   */
  async updateUnit(id: number | string, updateData: UpdateUnitInput): Promise<Unit> {
    try {
      const result: any = await this.api.put(`/materials/units/${id}`, updateData);
      return result.unit || result;
    } catch (error: unknown) {
      console.error('Error updating unit:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to update unit';
      throw new Error(errorMessage);
    }
  }

  /**
   * Delete a unit
   * @param id - Unit ID
   * @returns Response with success message
   */
  async deleteUnit(id: number | string): Promise<DeleteResponse> {
    try {
      const result = await this.api.delete(`/materials/units/${id}`);
      return result;
    } catch (error: unknown) {
      console.error('Error deleting unit:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
        (error as { message?: string }).message || 'Failed to delete unit';
      throw new Error(errorMessage);
    }
  }

  // =============== VALIDATION METHODS ===============

  /**
   * Validate material data
   * @param data - Material data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  validateMaterialData(data: CreateMaterialInput): ValidationResult {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('Material name is required');
    }
    if (!data.unit_id) {
      errors.push('Unit ID is required');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate category data
   * @param data - Category data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  validateCategoryData(data: CreateCategoryInput): ValidationResult {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('Category name is required');
    }
    
    return { isValid: errors.length === 0, errors };
  }

  /**
   * Validate unit data
   * @param data - Unit data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  validateUnitData(data: CreateUnitInput): ValidationResult {
    const errors: string[] = [];
    
    if (!data.name?.trim()) {
      errors.push('Unit name is required');
    }
    if (!data.symbol?.trim()) {
      errors.push('Unit symbol is required');
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

// Singleton instance
const materialService = new MaterialService();
export default materialService;

// Named exports for individual methods
export const {
  // Material methods
  getAllMaterials,
  getMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialPrices,
  addMaterialPrice,
  // Category methods
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  // Unit methods
  getAllUnits,
  getUnitById,
  createUnit,
  updateUnit,
  deleteUnit,
  // Validation methods
  validateMaterialData,
  validateCategoryData,
  validateUnitData,
} = materialService;