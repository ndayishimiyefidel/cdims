import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Package,
  RefreshCw,
  Filter,
  Grid3X3,
  List,
  Settings,
  Check,
  ChevronDown,
} from "lucide-react";
import stockService, { type CreateStockInput, type ValidationResult, type Stock, type SetLowStockThresholdInput } from "../../services/stockService";
import materialService, { type Material } from "../../services/materialsService";
import storeService, { type Store } from "../../services/storeService";
import DataTable, { type Column } from "../../components/ui/DataTable";
import { PageHeader } from "../../components/ui/PageHeader";
import { Card } from "../../components/ui/Card";
import { useToast } from "../../components/ui/Toast";

type ViewMode = 'table' | 'grid' | 'list';

interface AlertFilterParams {
  date_from?: string;
  date_to?: string;
}

const StockDashboard: React.FC = () => {
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [alerts, setAlerts] = useState<Stock[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [alertsLoading, setAlertsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [alertSearchTerm, setAlertSearchTerm] = useState<string>("");
  const [dataPage, setDataPage] = useState<number>(1);
  const [alertsPage, setAlertsPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [deleteConfirm, setDeleteConfirm] = useState<Stock | null>(null);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showFilters, setShowFilters] = useState(false);
  const [stockFilters, setStockFilters] = useState<AlertFilterParams>({ date_from: '', date_to: '' });
  const [alertFilters, setAlertFilters] = useState<AlertFilterParams>({ date_from: '', date_to: '' });
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedAlertStore, setSelectedAlertStore] = useState("");
  const [selectedAlertMaterial, setSelectedAlertMaterial] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [showAlerts, setShowAlerts] = useState(true);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [selectedThresholdStock, setSelectedThresholdStock] = useState<Stock | null>(null);
  const [formData, setFormData] = useState<CreateStockInput>({
    material_id: 0,
    store_id: 0,
    qty_on_hand: 0,
    unit_price: 0,
    low_stock_threshold: 0,
  });
  const [additionalQty, setAdditionalQty] = useState<number>(0);
  const [thresholdFormData, setThresholdFormData] = useState<SetLowStockThresholdInput>({
    low_stock_threshold: 0,
  });
  const [formError, setFormError] = useState<string>('');
  const [thresholdFormError, setThresholdFormError] = useState<string>('');

  const { success, error: toastError } = useToast();

  useEffect(() => {
    loadData();
  }, [stockFilters, alertFilters]);

  // Reset main data pagination when search/filters change
  useEffect(() => {
    setDataPage(1);
  }, [searchTerm, selectedStore, stockFilters]);

  // Reset alerts pagination when search/filters change
  useEffect(() => {
    setAlertsPage(1);
  }, [alertSearchTerm, selectedAlertStore, selectedAlertMaterial, alertFilters]);

  const loadData = async () => {
    try {
      setLoading(true);
      setAlertsLoading(true);
      const [stockResponse, materialsResponse, storesResponse, alertsResponse] = await Promise.all([
        stockService.getAllStock(stockFilters),
        materialService.getAllMaterials(),
        storeService.getAllStores(),
        stockService.getLowStockAlerts({ page: 1, limit: 1000, ...alertFilters }),
      ]);
      setAllStocks(stockResponse.stock || []);
      setMaterials(materialsResponse || []);
      setStores(storesResponse.stores || []);
      setAlerts(alertsResponse.lowStockItems || []);
      setError(null);
      setAlertsError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      setAlertsError(err.message || "Failed to load alerts");
    } finally {
      setLoading(false);
      setAlertsLoading(false);
    }
  };

  // Client-side filtered stocks
  const filteredStocks = useMemo(() => {
    let filtered = [...allStocks];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.material?.name?.toLowerCase().includes(term) ||
          s.store?.name?.toLowerCase().includes(term)
      );
    }
    if (selectedStore) {
      filtered = filtered.filter(s => s.store?.name?.toLowerCase() === selectedStore.toLowerCase());
    }
    const start = stockFilters.date_from ? new Date(stockFilters.date_from) : null;
    const end = stockFilters.date_to ? new Date(stockFilters.date_to) : null;
    if (end) end.setHours(23, 59, 59, 999);
    if (start || end) {
      filtered = filtered.filter((s) => {
        const d = s.createdAt ? new Date(s.createdAt) : null;
        if (!d) return false;
        if (start && end) return d >= start && d <= end;
        if (start) return d >= start;
        if (end) return d <= end;
        return true;
      });
    }
    return filtered;
  }, [allStocks, searchTerm, selectedStore, stockFilters]);

  // Client-side filtered alerts
  const filteredAlerts = useMemo(() => {
    let filtered = [...alerts];
    if (alertSearchTerm.trim()) {
      const term = alertSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.material?.name?.toLowerCase().includes(term) ||
          a.store?.name?.toLowerCase().includes(term)
      );
    }
    if (selectedAlertStore) {
      filtered = filtered.filter(a => a.store?.name?.toLowerCase() === selectedAlertStore.toLowerCase());
    }
    if (selectedAlertMaterial) {
      filtered = filtered.filter(a => a.material?.name?.toLowerCase() === selectedAlertMaterial.toLowerCase());
    }
    const start = alertFilters.date_from ? new Date(alertFilters.date_from) : null;
    const end = alertFilters.date_to ? new Date(alertFilters.date_to) : null;
    if (end) end.setHours(23, 59, 59, 999);
    if (start || end) {
      filtered = filtered.filter((a) => {
        const d = a.createdAt ? new Date(a.createdAt) : null;
        if (!d) return false;
        if (start && end) return d >= start && d <= end;
        if (start) return d >= start;
        if (end) return d <= end;
        return true;
      });
    }
    return filtered;
  }, [alerts, alertSearchTerm, selectedAlertStore, selectedAlertMaterial, alertFilters]);

  const handleAddStock = () => {
    setFormData({
      material_id: 0,
      store_id: 0,
      qty_on_hand: 0,
      unit_price: 0,
      low_stock_threshold: 0,
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "additional_qty") {
      const qty = parseInt(value) || 0;
      if (qty < 0) {
        setFormError("Additional quantity cannot be negative");
        return;
      }
      setAdditionalQty(qty);
    } else {
      setFormData({
        ...formData,
        [name]: name === "material_id" || name === "store_id" || name === "low_stock_threshold" ? parseInt(value) : value,
      });
    }
  };

  const handleThresholdInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setThresholdFormData({ low_stock_threshold: parseInt(value) || 0 });
  };

  const handleStockFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AlertFilterParams
  ) => {
    setStockFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleAlertFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof AlertFilterParams
  ) => {
    setAlertFilters((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation: ValidationResult = stockService.validateStockData(formData);
    if (!validation.isValid) {
      setFormError(validation.errors.join(', '));
      return;
    }

    try {
      setOperationLoading(true);
      const newStock = await stockService.createStock(formData);
      setShowAddModal(false);
      setFormData({
        material_id: 0,
        store_id: 0,
        qty_on_hand: 0,
        low_stock_threshold: 0,
      });
      loadData();
      success(`Stock created successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to create stock");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedStock?.id) {
      setFormError("Invalid stock ID");
      return;
    }

    const currentQty = Number(selectedStock.qty_on_hand) || 0;
    const totalQty = currentQty + additionalQty;

    const updatedFormData = {
      qty_on_hand: totalQty,
      low_stock_threshold: Number(formData.low_stock_threshold) || 0,
      unit_price: Number(formData.unit_price) || undefined,
    };

    const validation: ValidationResult = stockService.validateStockData({
      ...updatedFormData,
      material_id: Number(selectedStock.material_id) || 0,
      store_id: Number(selectedStock.store_id) || 0,
    });
    if (!validation.isValid) {
      setFormError(validation.errors.join(', '));
      return;
    }

    try {
      setOperationLoading(true);
      await stockService.updateStock(selectedStock.id, updatedFormData);
      setShowUpdateModal(false);
      setSelectedStock(null);
      setAdditionalQty(0);
      setFormData({
        material_id: 0,
        store_id: 0,
        qty_on_hand: 0,
        unit_price: 0,
        low_stock_threshold: 0,
      });
      loadData();
      success(`Stock updated successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to update stock");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleThresholdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setThresholdFormError('');

    if (!selectedThresholdStock?.id) {
      setThresholdFormError("Invalid stock ID");
      return;
    }

    if (thresholdFormData.low_stock_threshold < 0) {
      setThresholdFormError("Low stock threshold must be non-negative");
      return;
    }

    try {
      setOperationLoading(true);
      await stockService.setLowStockThreshold(selectedThresholdStock.id, thresholdFormData);
      setShowThresholdModal(false);
      setSelectedThresholdStock(null);
      setThresholdFormData({ low_stock_threshold: 0 });
      loadData();
      success(`Low stock threshold updated!`);
    } catch (err: any) {
      setThresholdFormError(err.message || "Failed to set low stock threshold");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleAcknowledgeAlert = async (stock: Stock) => {
    if (!stock?.id) return;

    try {
      setOperationLoading(true);
      await stockService.acknowledgeLowStockAlert(stock.id);
      loadData();
      success(`Low stock alert acknowledged!`);
    } catch (err: any) {
      toastError(err.message || "Failed to acknowledge low stock alert");
    } finally {
      setOperationLoading(false);
    }
  };

  const handleSetThreshold = (stock: Stock) => {
    if (!stock?.id) return;
    setSelectedThresholdStock(stock);
    setThresholdFormData({ low_stock_threshold: stock.low_stock_threshold || 0 });
    setThresholdFormError('');
    setShowThresholdModal(true);
  };

  const handleEditStock = (stock: Stock) => {
    if (!stock?.id) return;
    const currentQty = Number(stock.qty_on_hand) || 0;
    setSelectedStock(stock);
    setFormData({
      material_id: Number(stock.material_id) || 0,
      store_id: Number(stock.store_id) || 0,
      qty_on_hand: currentQty,
      unit_price: Number(stock.unit_price) || 0,
      low_stock_threshold: Number(stock.low_stock_threshold) || 0,
    });
    setAdditionalQty(0);
    setFormError('');
    setShowUpdateModal(true);
  };

  const handleViewStock = (stock: Stock) => {
    if (!stock?.id) return;
    setSelectedStock(stock);
    setShowViewModal(true);
  };

  const handleDeleteStock = async (stock: Stock) => {
    try {
      setOperationLoading(true);
      setDeleteConfirm(null);
      await stockService.updateStock(stock.id, { qty_on_hand: 0 });
      loadData();
      success(`Stock deleted successfully!`);
    } catch (err: any) {
      toastError(err.message || "Failed to delete stock");
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

  const renderStockTable = () => {
    const columns: Column<Stock>[] = [
      { key: 'material_id', header: 'Material', sortable: true, render: (_, row) => <span className="font-medium text-gray-900">{row.material?.name || 'N/A'}</span> },
      { key: 'store_id', header: 'Store', sortable: true, render: (_, row) => row.store?.name || 'N/A' },
      { key: 'qty_on_hand', header: 'Qty on Hand', sortable: true, render: (_, row) => <span className="font-medium">{row.qty_on_hand}</span> },
      { key: 'unit_price', header: 'Unit Price', sortable: true, render: (_, row) => `RWF ${(row.unit_price || 0).toLocaleString()}` },
      { key: 'total_price', header: 'Total Price', sortable: false, render: (_, row) => `RWF ${((row.unit_price || 0) * (row.qty_on_hand || 0)).toLocaleString()}` },
      { key: 'createdAt', header: 'Created', sortable: true, render: (_, row) => formatDate(row.createdAt) },
      {
        key: 'actions',
        header: 'Actions',
        width: '160px',
        render: (_, row) => (
          <div className="flex items-center gap-1">
            <button onClick={() => handleViewStock(row)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleEditStock(row)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => handleSetThreshold(row)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Set Threshold">
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeleteConfirm(row)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ];

    return (
      <DataTable<Stock>
        columns={columns}
        data={filteredStocks}
        keyExtractor={(row) => row.id ?? Math.random()}
        loading={loading}
        error={error}
        onRetry={loadData}
        searchable
        searchPlaceholder="Search stock..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortable
        exportable
        exportFilename="stock_export"
        columnVisibility
        pagination={{
          page: dataPage,
          pageSize: pageSize,
          total: filteredStocks.length,
          onPageChange: setDataPage,
        }}
      />
    );
  };

  const renderAlertsTable = () => {
    const columns: Column<Stock>[] = [
      { key: 'material_id', header: 'Material', sortable: true, render: (_, row) => <span className="font-medium text-gray-900">{row.material?.name || 'N/A'}</span> },
      { key: 'store_id', header: 'Store', sortable: true, render: (_, row) => row.store?.name || 'N/A' },
      { key: 'qty_on_hand', header: 'Qty on Hand', sortable: true, render: (_, row) => <span className="text-red-600 font-semibold">{row.qty_on_hand}</span> },
      { key: 'unit_price', header: 'Unit Price', sortable: true, render: (_, row) => `RWF ${(row.unit_price || 0).toLocaleString()}` },
      { key: 'low_stock_threshold', header: 'Threshold', sortable: true },
      {
        key: 'actions',
        header: 'Actions',
        width: '100px',
        render: (_, row) => (
          <div className="flex items-center gap-1">
            {row.low_stock_alert && (
              <button onClick={() => handleAcknowledgeAlert(row)} className="p-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors" title="Acknowledge Alert">
                <Check className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={() => handleViewStock(row)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="View">
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        ),
      },
    ];

    return (
      <DataTable<Stock>
        columns={columns}
        data={filteredAlerts}
        keyExtractor={(row) => row.id ?? Math.random()}
        loading={alertsLoading}
        error={alertsError}
        onRetry={loadData}
        searchable
        searchPlaceholder="Search alerts..."
        searchTerm={alertSearchTerm}
        onSearchChange={setAlertSearchTerm}
        sortable
        exportable={false}
        exportFilename="low_stock_alerts"
        pagination={{
          page: alertsPage,
          pageSize: pageSize,
          total: filteredAlerts.length,
          onPageChange: setAlertsPage,
        }}
      />
    );
  };

  // Keep grid/list view with pagination
  const stockTotalPages = Math.ceil(filteredStocks.length / pageSize);
  const gridViewData = filteredStocks.slice((dataPage - 1) * pageSize, dataPage * pageSize);

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {gridViewData.map((stock) => (
        <div key={stock.id} className="bg-white rounded border border-gray-200 p-3 hover:shadow-sm transition-shadow">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <Package className="w-4 h-4 text-primary-700" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-xs truncate">{stock.material?.name || 'N/A'}</div>
              <div className="text-gray-500 text-xs truncate">{stock.store?.name || 'N/A'}</div>
            </div>
          </div>
          <div className="space-y-1 mb-3">
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Package className="w-3 h-3" />
              <span>Qty: {stock.qty_on_hand}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <button onClick={() => handleViewStock(stock)} className="text-gray-400 hover:text-primary-600 p-1" title="View">
                <Eye className="w-3 h-3" />
              </button>
              <button onClick={() => handleEditStock(stock)} className="text-gray-400 hover:text-primary-600 p-1" title="Edit">
                <Edit className="w-3 h-3" />
              </button>
              <button onClick={() => handleSetThreshold(stock)} className="text-gray-400 hover:text-primary-600 p-1" title="Set Threshold">
                <Settings className="w-3 h-3" />
              </button>
            </div>
            <button onClick={() => setDeleteConfirm(stock)} className="text-gray-400 hover:text-red-600 p-1" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
      {gridViewData.map((stock) => (
        <div key={stock.id} className="px-4 py-3 hover:bg-gray-25">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary-700" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm truncate">{stock.material?.name || 'N/A'}</div>
                <div className="text-gray-500 text-xs truncate">{stock.store?.name || 'N/A'}</div>
              </div>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4 text-xs text-gray-600 flex-1 max-w-xl px-4">
              <span className="truncate">Qty: {stock.qty_on_hand}</span>
              <span>{formatDate(stock.createdAt)}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <button onClick={() => handleViewStock(stock)} className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors" title="View Stock">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => handleEditStock(stock)} className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors" title="Edit Stock">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleSetThreshold(stock)} className="text-gray-400 hover:text-primary-600 p-1.5 rounded-full hover:bg-primary-50 transition-colors" title="Set Threshold">
                <Settings className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteConfirm(stock)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors" title="Delete Stock">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSimplePagination = (page: number, totalPages: number, onPageChange: (p: number) => void) => (
    <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 px-4 py-3">
      <div className="text-xs text-gray-500">
        Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, filteredStocks.length)} of {filteredStocks.length}
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous
        </button>
        <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Next
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Stock Management"
        subtitle="Manage your organization's stock"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={loadData} disabled={loading || alertsLoading} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading || alertsLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button onClick={handleAddStock} disabled={operationLoading} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 shadow-sm">
              <Plus className="w-4 h-4" />
              Add Stock
            </button>
          </div>
        }
      />

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Stock Items</p>
                <p className="text-xl font-bold text-gray-900">{allStocks.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Unique Stores</p>
                <p className="text-xl font-bold text-gray-900">{[...new Set(allStocks.map(s => s.store?.name))].filter(Boolean).length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Filter className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Materials</p>
                <p className="text-xl font-bold text-gray-900">{materials.length}</p>
              </div>
            </div>
          </Card>
          {alerts.length > 0 && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Low Stock Alerts</p>
                  <p className="text-xl font-bold text-gray-900">{alerts.length}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Alerts section - collapsible */}
        {alerts.length > 0 && (
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <h2 className="text-sm font-semibold text-gray-900">Low Stock Alerts</h2>
              </div>
              <button onClick={() => setShowAlerts(!showAlerts)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors" title={showAlerts ? 'Hide Alerts' : 'Show Alerts'}>
                <ChevronDown className={`w-4 h-4 transition-transform ${showAlerts ? 'rotate-180' : ''}`} />
              </button>
            </div>
            {showAlerts && <div className="p-4">{renderAlertsTable()}</div>}
          </Card>
        )}

        {/* Main stock table with filter toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)} className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('table')} className={`p-2 transition-colors ${viewMode === 'table' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`} title="Table View"><List className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`} title="Grid View"><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`} title="List View"><Settings className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Date filter section */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Store</label>
                <select value={selectedStore} onChange={(e) => setSelectedStore(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500">
                  <option value="">All Stores</option>
                  {stores.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                <input type="date" value={stockFilters.date_from || ''} onChange={(e) => handleStockFilterChange(e, 'date_from')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                <input type="date" value={stockFilters.date_to || ''} onChange={(e) => handleStockFilterChange(e, 'date_to')} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
            {(selectedStore || stockFilters.date_from || stockFilters.date_to) && (
              <button onClick={() => { setSelectedStore(""); setStockFilters({ date_from: '', date_to: '' }); }} className="shrink-0 px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Clear All</button>
            )}
          </div>
        )}

        {/* Stock content */}
        {viewMode === 'table' && renderStockTable()}

        {viewMode === 'grid' && (
          <>
            {filteredStocks.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 text-sm">No stock found</div>
            ) : (
              <>
                {renderGridView()}
                {stockTotalPages > 1 && renderSimplePagination(dataPage, stockTotalPages, setDataPage)}
              </>
            )}
          </>
        )}

        {viewMode === 'list' && (
          <>
            {filteredStocks.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500 text-sm">No stock found</div>
            ) : (
              <>
                {renderListView()}
                {stockTotalPages > 1 && renderSimplePagination(dataPage, stockTotalPages, setDataPage)}
              </>
            )}
          </>
        )}
      </div>

      {/* Loading overlay */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded p-4 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 text-xs font-medium">Processing...</span>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-4 w-full max-w-sm">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Delete Stock</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs text-gray-700">
                Are you sure you want to delete stock for{" "}
                <span className="font-semibold">{deleteConfirm.material?.name || 'N/A'}</span>
                ?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-3 py-1.5 text-xs text-gray-700 border border-gray-200 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteStock(deleteConfirm)}
                className="px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Add New Stock</h3>
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Material *</label>
                <select
                  name="material_id"
                  value={formData.material_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="0">Select Material</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>{material.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Store *</label>
                <select
                  name="store_id"
                  value={formData.store_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="0">Select Store</option>
                  {stores.map((store) => (
                    <option key={store.id} value={store.id}>{store.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity on Hand *</label>
                <input
                  type="number"
                  name="qty_on_hand"
                  value={formData.qty_on_hand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price *</label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter unit price"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter low stock threshold"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      material_id: 0,
                      store_id: 0,
                      qty_on_hand: 0,
                      low_stock_threshold: 0,
                    });
                    setFormError('');
                  }}
                  className="px-4 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="px-4 py-2 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {operationLoading ? 'Creating...' : 'Create Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Update Stock</h3>
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-4">
                {formError}
              </div>
            )}
            <form onSubmit={handleUpdateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                <p className="text-xs text-gray-900">{selectedStock.material?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Store</label>
                <p className="text-xs text-gray-900">{selectedStock.store?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Quantity on Hand</label>
                <p className="text-xs text-gray-900">{Number(selectedStock.qty_on_hand) || 0}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Current Unit Price</label>
                <p className="text-xs text-gray-900">{selectedStock.unit_price ? `RWF ${selectedStock.unit_price.toLocaleString()}` : 'Not set'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Additional Quantity *</label>
                <input
                  type="number"
                  name="additional_qty"
                  value={additionalQty}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter additional quantity"
                />
                <p className="text-xs text-gray-500 mt-1">
                  New Total Quantity: {(Number(selectedStock.qty_on_hand) || 0) + additionalQty}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price *</label>
                <input
                  type="number"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter unit price"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={formData.low_stock_threshold}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter low stock threshold"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedStock(null);
                    setAdditionalQty(0);
                    setFormData({
                      material_id: 0,
                      store_id: 0,
                      qty_on_hand: 0,
                      low_stock_threshold: 0,
                    });
                    setFormError('');
                  }}
                  className="px-4 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="px-4 py-2 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {operationLoading ? 'Updating...' : 'Update Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showThresholdModal && selectedThresholdStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Set Low Stock Threshold</h3>
            {thresholdFormError && (
              <div className="bg-red-50 border border-red-200 rounded p-2 text-red-700 text-xs mb-4">
                {thresholdFormError}
              </div>
            )}
            <form onSubmit={handleThresholdSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                <p className="text-xs text-gray-900">{selectedThresholdStock.material?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Store</label>
                <p className="text-xs text-gray-900">{selectedThresholdStock.store?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold *</label>
                <input
                  type="number"
                  name="low_stock_threshold"
                  value={thresholdFormData.low_stock_threshold}
                  onChange={handleThresholdInputChange}
                  required
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="Enter low stock threshold"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowThresholdModal(false);
                    setSelectedThresholdStock(null);
                    setThresholdFormData({ low_stock_threshold: 0 });
                    setThresholdFormError('');
                  }}
                  className="px-4 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={operationLoading}
                  className="px-4 py-2 text-xs bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {operationLoading ? 'Updating...' : 'Set Threshold'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showViewModal && selectedStock && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Stock Details</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                <p className="text-xs text-gray-900">{selectedStock.material?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Store</label>
                <p className="text-xs text-gray-900">{selectedStock.store?.name || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Quantity on Hand</label>
                <p className="text-xs text-gray-900">{selectedStock.qty_on_hand || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                <p className="text-xs text-gray-900">{selectedStock.unit_price ? `RWF ${selectedStock.unit_price.toLocaleString()}` : '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                <p className="text-xs text-gray-900">{selectedStock.low_stock_threshold || '-'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Low Stock Alert</label>
                <p className="text-xs text-gray-900">{selectedStock.low_stock_alert ? 'Active' : 'Inactive'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Created At</label>
                <p className="text-xs text-gray-900">{formatDate(selectedStock.createdAt)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Updated At</label>
                <p className="text-xs text-gray-900">{formatDate(selectedStock.updated_at)}</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedStock(null);
                }}
                className="px-4 py-2 text-xs border border-gray-200 rounded hover:bg-gray-50 text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDashboard;