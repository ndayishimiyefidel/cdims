import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Package as PackageIcon,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Settings,
} from "lucide-react";
import materialService, { type CreateMaterialInput, type ValidationResult, type Material, type Category, type Unit } from "../../services/materialsService";
import DataTable, { type Column, type ExportMeta } from "../../components/ui/DataTable";
import useAuth from "../../context/AuthContext";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";

type ViewMode = 'table' | 'grid' | 'list';

const MaterialManagement: React.FC = () => {
  const [allMaterials, setAllMaterials] = useState<Material[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dataPage, setDataPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [deleteConfirm, setDeleteConfirm] = useState<Material | null>(null);
  const [deleteConfirmBulk, setDeleteConfirmBulk] = useState<boolean>(false);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string | number>>(new Set());
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState<CreateMaterialInput>({
    code: '',
    name: '',
    specification: '',
    category_id: undefined,
    unit_id: undefined,
    active: true,
  });
  const [formError, setFormError] = useState<string>('');
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  // Reset pagination when search, date filters, or page size change
  useEffect(() => {
    setDataPage(1);
  }, [searchTerm, startDate, endDate, pageSize]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mats, cats, uns] = await Promise.all([
        materialService.getAllMaterials(),
        materialService.getAllCategories(),
        materialService.getAllUnits(),
      ]);
      setAllMaterials(mats || []);
      setCategories(cats || []);
      setUnits(uns || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    let filtered = [...allMaterials];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name?.toLowerCase().includes(term) ||
          m.specification?.toLowerCase().includes(term) ||
          m.code?.toLowerCase().includes(term)
      );
    }
    if (startDate || endDate) {
      filtered = filtered.filter((m) => {
        const createdAt = m.createdAt ? new Date(m.createdAt) : null;
        if (!createdAt) return false;
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);
        if (start && end) return createdAt >= start && createdAt <= end;
        if (start) return createdAt >= start;
        if (end) return createdAt <= end;
        return true;
      });
    }
    return filtered;
  }, [allMaterials, searchTerm, startDate, endDate]);

  const totalMaterials = filteredMaterials.length;

  const generateCode = (name: string): string => {
    const prefix = name.trim().slice(0, 3).toUpperCase() || 'MAT';
    const number = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${number}`;
  };

  const handleAddMaterial = () => {
    setFormData({
      code: '',
      name: '',
      specification: '',
      category_id: undefined,
      unit_id: undefined,
      unit_price: undefined,
      active: true,
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (name === 'category_id' || name === 'unit_id') {
      newValue = value ? parseInt(value) : undefined;
    } else if (name === 'unit_price') {
      newValue = value ? parseFloat(value) : undefined;
    } else if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    }

    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const dataToValidate = { ...formData };
    if (!dataToValidate.code) {
      dataToValidate.code = generateCode(dataToValidate.name || 'MATERIAL');
    }

    const validation: ValidationResult = materialService.validateMaterialData(dataToValidate);
    if (!validation.isValid) {
      setFormError(validation.errors.join(', '));
      return;
    }

    try {
      setOperationLoading(true);
      const newMaterial = await materialService.createMaterial(dataToValidate);
      setShowAddModal(false);
      setFormData({
        code: '',
        name: '',
        specification: '',
        category_id: undefined,
        unit_id: undefined,
        active: true,
      });
      await loadData();
      setDataPage(1);
      success(`${newMaterial.name} created successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to create material");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleEditMaterial = (material: Material) => {
    if (!material?.id) return;
    setSelectedMaterial(material);
    setFormData({
      code: material.code || '',
      name: material.name || '',
      specification: material.specification || '',
      category_id: material.category_id,
      unit_id: material.unit_id,
      unit_price: material.unit_price,
      active: material.active ?? true,
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation: ValidationResult = materialService.validateMaterialData(formData);
    if (!validation.isValid) {
      setFormError(validation.errors.join(', '));
      return;
    }

    if (!selectedMaterial?.id) {
      setFormError("Invalid material ID");
      return;
    }

    try {
      setOperationLoading(true);
      await materialService.updateMaterial(selectedMaterial.id, formData);
      setShowUpdateModal(false);
      setSelectedMaterial(null);
      setFormData({
        code: '',
        name: '',
        specification: '',
        category_id: undefined,
        unit_id: undefined,
        active: true,
      });
      await loadData();
      setDataPage(1);
      success(`${formData.name} updated successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to update material");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleViewMaterial = (material: Material) => {
    if (!material?.id) return;
    setSelectedMaterial(material);
    setShowViewModal(true);
  };

  const handleDeleteMaterial = async (material: Material) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await materialService.deleteMaterial(material.id);
      await loadData();
      setDataPage(1);
      success(`${material.name} deleted successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to delete material");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setOperationLoading(true);
      setDeleteConfirmBulk(false);
      const ids = Array.from(selectedRowIds);
      let deletedCount = 0;
      for (const id of ids) {
        try {
          await materialService.deleteMaterial(Number(id));
          deletedCount++;
        } catch (err) {
          // Continue deleting others even if one fails
        }
      }
      setSelectedRowIds(new Set());
      await loadData();
      setDataPage(1);
      success(`${deletedCount} material${deletedCount !== 1 ? 's' : ''} deleted successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to delete materials");
    } finally {
      setOperationLoading(false);
    }
  };

  const formatDate = (date?: Date | string): string => {
    if (!date) return new Date().toLocaleDateString("en-GB");
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date?: Date | string): string => {
    if (!date) return new Date().toLocaleString("en-GB");
    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const exportMeta: ExportMeta = {
    systemName: "DIOCESE CATHOLIQUE CYANGUGU",
    systemContact: "ECONOMAT GENERAL — SDEID",
    systemAddress: "BP: 05 CYANGUGU",
    generatedBy: user?.full_name || user?.email || "Unknown",
    logoUrl: "/hello.jpg",
  };


  const renderDataTable = () => {
    const columns: Column<Material>[] = [
      { key: 'name', header: 'Name', sortable: true, render: (_, row) => <span className="font-medium text-gray-900">{row.name}</span> },
      { key: 'code', header: 'Code', sortable: true, hidden: false, render: (_, row) => row.code || <span className="text-gray-400 italic">N/A</span> },
      { key: 'specification', header: 'Specification', sortable: true, hidden: true },
      { key: 'category_id', header: 'Category', sortable: true, render: (_, row) => row.category_id ? categories.find(c => c.id === row.category_id)?.name || <span className="text-gray-400">N/A</span> : <span className="text-gray-400">None</span>, getValue: (row) => row.category_id ? categories.find(c => c.id === row.category_id)?.name || 'N/A' : 'None' },
      { key: 'unit_id', header: 'Unit', sortable: true, render: (_, row) => row.unit_id ? units.find(u => u.id === row.unit_id)?.name || <span className="text-gray-400">N/A</span> : <span className="text-gray-400">None</span>, getValue: (row) => row.unit_id ? units.find(u => u.id === row.unit_id)?.name || 'N/A' : 'None' },
      { key: 'createdAt', header: 'Created', sortable: true, render: (_, row) => formatDate(row.createdAt), getValue: (row) => formatDateTime(row.createdAt) },
      {
        key: 'actions',
        header: 'Actions',
        exportable: false,
        width: '120px',
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleViewMaterial(row)} className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="View Material">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleEditMaterial(row)} className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors" title="Edit Material">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeleteConfirm(row)} className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" title="Delete Material">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ];

    return (
      <DataTable<Material>
        columns={columns}
        data={filteredMaterials}
        keyExtractor={(row) => row.id ?? Math.random()}
        loading={loading}
        error={error}
        onRetry={loadData}
        selectable
        selectedRows={selectedRowIds}
        onSelectionChange={setSelectedRowIds}
        bulkActions={[
          {
            label: 'Delete Selected',
            icon: Trash2,
            variant: 'danger',
            onClick: () => setDeleteConfirmBulk(true),
          },
        ]}
        searchable
        searchPlaceholder="Search materials..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortable
        defaultSortColumn="createdAt"
        defaultSortDirection="desc"
        exportable
        exportFilename="materials_export"
        exportMeta={exportMeta}
        columnVisibility
        pagination={{
          page: dataPage,
          pageSize: pageSize,
          total: filteredMaterials.length,
          onPageChange: setDataPage,
          onPageSizeChange: setPageSize,
        }}
      />
    );
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredMaterials.slice((dataPage - 1) * pageSize, dataPage * pageSize).map((material) => {
        const categoryName = material.category_id
          ? categories.find(c => c.id === material.category_id)?.name
          : null;
        const unitName = material.unit_id
          ? units.find(u => u.id === material.unit_id)?.name
          : null;
        return (
          <div
            key={material.id}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden flex flex-col"
          >
            {/* Card header with icon, name, code, status */}
            <div className="p-3.5 pb-2 flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <PackageIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-semibold text-gray-900 text-sm truncate">{material.name}</h4>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full flex-shrink-0 ${
                    material.active !== false
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${material.active !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {material.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {material.code ? (
                  <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary-700 bg-primary-50 rounded-md">
                    {material.code}
                  </span>
                ) : (
                  <span className="text-[10px] text-gray-400 italic">No code</span>
                )}
              </div>
            </div>

            {/* Details section */}
            <div className="px-3.5 py-2 flex-1 space-y-1.5">
              {material.specification && (
                <div className="flex items-start gap-1.5">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex-shrink-0 mt-0.5">Spec:</span>
                  <span className="text-xs text-gray-600 line-clamp-2">{material.specification}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Cat:</span>
                  <span>{categoryName || <span className="text-gray-300 italic">None</span>}</span>
                </div>
                <span className="text-gray-200">|</span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Unit:</span>
                  <span>{unitName || <span className="text-gray-300 italic">None</span>}</span>
                </div>
              </div>
              <div className="text-[10px] text-gray-400">
                Created: {formatDate(material.createdAt)}
              </div>
            </div>

            {/* Actions footer */}
            <div className="px-3.5 py-2.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleViewMaterial(material)}
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Material"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleEditMaterial(material)}
                  className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                  title="Edit Material"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirm(material)}
                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Material"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* List header */}
      <div className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 flex-shrink-0" /> {/* spacer for icon */}
          <span className="min-w-[140px]">Name &amp; Code</span>
          <span className="w-24">Category</span>
          <span className="w-20">Unit</span>
          <span className="flex-1">Specification</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="w-20 text-center">Status</span>
          <span className="w-24 text-center">Created</span>
          <span className="w-24 text-center">Actions</span>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {filteredMaterials.slice((dataPage - 1) * pageSize, dataPage * pageSize).map((material) => {
          const categoryName = material.category_id
            ? categories.find(c => c.id === material.category_id)?.name
            : null;
          const unitName = material.unit_id
            ? units.find(u => u.id === material.unit_id)?.name
            : null;
          return (
            <div
              key={material.id}
              className="px-5 py-3 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center gap-3">
                {/* Icon + name column */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <PackageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{material.name}</h4>
                    </div>
                    {material.code ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium text-primary-700 bg-primary-50 rounded-md">
                        {material.code}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 italic">No code</span>
                    )}
                  </div>
                </div>

                {/* Data columns — hidden on small screens */}
                <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xl">
                  <span className="w-24 text-xs text-gray-600 truncate">{categoryName || <span className="text-gray-300 italic">None</span>}</span>
                  <span className="w-20 text-xs text-gray-600 truncate">{unitName || <span className="text-gray-300 italic">None</span>}</span>
                  <span className="flex-1 text-xs text-gray-500 truncate">{material.specification || <span className="text-gray-300 italic">N/A</span>}</span>
                </div>

                {/* Status + Date + Actions */}
                <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                  {/* Status badge */}
                  <span className={`w-20 inline-flex items-center justify-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full ${
                    material.active !== false
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1 h-1 rounded-full ${material.active !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {material.active !== false ? 'Active' : 'Inactive'}
                  </span>
                  <span className="w-24 text-[10px] text-gray-400 text-center">{formatDate(material.createdAt)}</span>
                  {/* Action buttons */}
                  <div className="w-24 flex items-center justify-center gap-0.5">
                    <button
                      onClick={() => handleViewMaterial(material)}
                      className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Material"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEditMaterial(material)}
                      className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit Material"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(material)}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mobile actions row */}
                <div className="flex lg:hidden items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleViewMaterial(material)}
                    className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEditMaterial(material)}
                    className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(material)}
                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Mobile info row */}
              <div className="flex lg:hidden items-center gap-3 mt-2 pl-[52px]">
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                  material.active !== false
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className={`w-1 h-1 rounded-full ${material.active !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {material.active !== false ? 'Active' : 'Inactive'}
                </span>
                <span className="text-[10px] text-gray-400">{categoryName || 'No cat'}</span>
                <span className="text-gray-200">|</span>
                <span className="text-[10px] text-gray-400">{unitName || 'No unit'}</span>
                <span className="text-gray-200">|</span>
                <span className="text-[10px] text-gray-400">{formatDate(material.createdAt)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const totalPages = Math.ceil(filteredMaterials.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Material Management"
        subtitle="Manage your materials"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleAddMaterial}
              disabled={operationLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Material
            </button>
          </div>
        }
      />

      <div className="px-4 lg:px-6 py-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <PackageIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Materials</p>
                <p className="text-xl font-bold text-gray-900">{totalMaterials}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <PackageIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Active</p>
                <p className="text-xl font-bold text-gray-900">{allMaterials.filter(m => m.active !== false).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Categories</p>
                <p className="text-xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Units</p>
                <p className="text-xl font-bold text-gray-900">{units.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters bar */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${
                showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="List View"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Date Filter Section */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear Dates
                </button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'table' && renderDataTable()}

        {viewMode === 'grid' && (
          <>
            {filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
                {searchTerm || startDate || endDate ? 'No materials found matching your criteria' : 'No materials found'}
              </div>
            ) : (
              <>
                {renderGridView()}
                {/* Simple pagination for grid/list */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 mt-3">
                    <div className="text-xs text-gray-500">
                      Showing {((dataPage - 1) * pageSize) + 1}-{Math.min(dataPage * pageSize, filteredMaterials.length)} of {filteredMaterials.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDataPage(Math.max(1, dataPage - 1))}
                        disabled={dataPage === 1}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1.5 text-xs text-gray-600">
                        Page {dataPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setDataPage(Math.min(totalPages, dataPage + 1))}
                        disabled={dataPage === totalPages}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {viewMode === 'list' && (
          <>
            {filteredMaterials.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 text-sm">
                {searchTerm || startDate || endDate ? 'No materials found matching your criteria' : 'No materials found'}
              </div>
            ) : (
              <>
                {renderListView()}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3 mt-3">
                    <div className="text-xs text-gray-500">
                      Showing {((dataPage - 1) * pageSize) + 1}-{Math.min(dataPage * pageSize, filteredMaterials.length)} of {filteredMaterials.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setDataPage(Math.max(1, dataPage - 1))}
                        disabled={dataPage === 1}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1.5 text-xs text-gray-600">
                        Page {dataPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setDataPage(Math.min(totalPages, dataPage + 1))}
                        disabled={dataPage === totalPages}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Loading overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-red-100 animate-modal-in" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 border-2 border-red-100">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Material</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-800 text-center">
                Are you sure you want to delete{' '}
                <span className="font-semibold">"{deleteConfirm.name}"</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMaterial(deleteConfirm)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmBulk && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setDeleteConfirmBulk(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-red-100 animate-modal-in" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4 border-2 border-red-100">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Materials</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <p className="text-sm text-amber-800 text-center">
                Are you sure you want to delete{' '}
                <span className="font-semibold">{selectedRowIds.size} selected material{selectedRowIds.size !== 1 ? 's' : ''}</span>?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmBulk(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 active:bg-red-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/30 shadow-lg shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => { setShowAddModal(false); setFormError(''); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 animate-modal-in overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Add New Material</h3>
                  <p className="text-sm text-primary-100">Fill in the details below</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter material name"
                />
              </div>

              {/* Specification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specification</label>
                <textarea
                  name="specification"
                  value={formData.specification}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 resize-none"
                  placeholder="Enter material specification (optional)"
                />
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit_id"
                    value={formData.unit_id || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      code: '',
                      name: '',
                      specification: '',
                      category_id: undefined,
                      unit_id: undefined,
                      active: true,
                    });
                    setFormError('');
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500/30 shadow-lg shadow-primary-500/20"
                >
                  {operationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => { setShowUpdateModal(false); setFormError(''); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 animate-modal-in overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Update Material</h3>
                  <p className="text-sm text-amber-100">Editing: {selectedMaterial.name}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter material name"
                />
              </div>

              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Code</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400"
                  placeholder="Enter material code"
                />
              </div>

              {/* Specification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Specification</label>
                <textarea
                  name="specification"
                  value={formData.specification}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 placeholder:text-gray-400 resize-none"
                  placeholder="Enter material specification (optional)"
                />
              </div>

              {/* Two column layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select
                    name="category_id"
                    value={formData.category_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="unit_id"
                    value={formData.unit_id || ''}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200 bg-white"
                  >
                    <option value="">Select a unit</option>
                    {units.map(unit => (
                      <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active toggle */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${formData.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <label className="text-sm font-medium text-gray-700">Active Status</label>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, active: !formData.active })}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/20 ${
                    formData.active ? 'bg-primary-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                      formData.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedMaterial(null);
                    setFormData({
                      code: '',
                      name: '',
                      specification: '',
                      category_id: undefined,
                      unit_id: undefined,
                      active: true,
                    });
                    setFormError('');
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 active:bg-amber-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-lg shadow-amber-500/20"
                >
                  {operationLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4" />
                      Update Material
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => { setShowViewModal(false); setSelectedMaterial(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 animate-modal-in overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Material Details</h3>
                  <p className="text-sm text-blue-100">Viewing: {selectedMaterial.name}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Material Name</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedMaterial.name || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Code</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-sm font-mono font-medium text-primary-700 bg-primary-50 rounded-lg">
                      {selectedMaterial.code || '-'}
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Specification</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.specification || '-'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Category</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.category_id ? categories.find(c => c.id === selectedMaterial.category_id)?.name || '-' : <span className="text-gray-400 italic">None</span>}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Unit</p>
                  <p className="text-sm text-gray-900">{selectedMaterial.unit_id ? units.find(u => u.id === selectedMaterial.unit_id)?.name || '-' : <span className="text-gray-400 italic">None</span>}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-sm font-medium rounded-lg ${
                    selectedMaterial.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedMaterial.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                    {selectedMaterial.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedMaterial.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Updated At</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(selectedMaterial.updated_at)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedMaterial(null);
                  }}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialManagement;