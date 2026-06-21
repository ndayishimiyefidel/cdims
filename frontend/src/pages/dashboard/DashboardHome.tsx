import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Filter,
  Calendar,
  RefreshCw,
  Building2,
  Package,
  MapPin,
  AlertTriangle,
  Box,
  Users,
  Plus,
  FileText,
  ArrowRight,
  ClipboardList,
  BarChart3,
  Activity,
  Briefcase,
  Truck,
  CheckCircle,
  Home,
  ChevronRight,
  ExternalLink,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { materialService, requisitionService, siteService, siteAssignmentService, stockService, storeService, userService } from '../../services';
import { useAuth } from '../../context';
import type { Material, MaterialRequisition, Site, SiteAssignment, Stock, StockMovement, Store, User } from '../../services/userService';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../../components/ui/StatCard';
import { Card } from '../../components/ui/Card';
import { Badge, StatusBadge } from '../../components/ui/Badge';
import { StatsGridSkeleton, CardSkeleton } from '../../components/ui/Skeleton';
import AccessRestricted from '../../components/dashboard/AccessRestricted';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';

interface DashboardData {
  materials: Material[];
  recentRequisitions: MaterialRequisition[];
  lowStockAlerts: Stock[];
  recentSiteAssignments: SiteAssignment[];
  recentStockArrivals: StockMovement[];
  recentMaterials: Material[];
  sites: Site[];
  stores: Store[];
  users: User[];
  assignedSites: Site[];
  stocks: Stock[];
  recentApprovals: Array<{ id: number; action: string; reviewer: string; requestId: number; siteName: string; date: string }>;
  stockInCount: number;
  stockOutCount: number;
  stats: {
    totalMaterials: number;
    pendingRequisitions: number;
    verifiedRequisitions: number;
    approvedRequisitions: number;
    issuedRequisitions: number;
    receivedRequisitions: number;
    closedRequisitions: number;
    totalSites: number;
    siteEngineers: number;
    lowStockAlerts: number;
    assignedSites: number;
    uniqueStores: number;
    totalStockItems: number;
  };
  previousStats: {
    totalMaterials: number;
    pendingRequisitions: number;
    verifiedRequisitions: number;
    approvedRequisitions: number;
    issuedRequisitions: number;
    receivedRequisitions: number;
    closedRequisitions: number;
    totalSites: number;
    siteEngineers: number;
    lowStockAlerts: number;
    assignedSites: number;
    uniqueStores: number;
    totalStockItems: number;
  };
}

interface FilterParams {
  date_from?: string;
  date_to?: string;
}

interface StatCardConfig {
  label: string;
  value: string | number;
  icon: React.ElementType;
  iconColor: string;
  iconBgColor: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  allowedRoles: string[];
  onClick?: () => void;
}



const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const userRole = user?.role?.name;
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    materials: [],
    recentRequisitions: [],
    lowStockAlerts: [],
    recentSiteAssignments: [],
    recentStockArrivals: [],
    recentMaterials: [],
    sites: [],
    stores: [],
    users: [],
    assignedSites: [],
    stocks: [],
    stats: {
      totalMaterials: 0, pendingRequisitions: 0, verifiedRequisitions: 0, approvedRequisitions: 0,
      issuedRequisitions: 0, receivedRequisitions: 0, closedRequisitions: 0, totalSites: 0,
      siteEngineers: 0, lowStockAlerts: 0, assignedSites: 0, uniqueStores: 0, totalStockItems: 0,
    },
    previousStats: {
      totalMaterials: 0, pendingRequisitions: 0, verifiedRequisitions: 0, approvedRequisitions: 0,
      issuedRequisitions: 0, receivedRequisitions: 0, closedRequisitions: 0, totalSites: 0,
      siteEngineers: 0, lowStockAlerts: 0, assignedSites: 0, uniqueStores: 0, totalStockItems: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>({ date_from: '', date_to: '' });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const hasAccess = useCallback((allowedRoles: string[]): boolean => {
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  }, [userRole]);

  const adminRoles = ['PADIRI', 'ADMIN'];
  const siteEngineerRole = ['SITE_ENGINEER'];
  const storekeeperRole = ['STOREKEEPER'];
  const diocesanSiteEngineerRole = ['DIOCESAN_SITE_ENGINEER'];
  const allAllowedRoles = [...adminRoles, ...siteEngineerRole, ...storekeeperRole, ...diocesanSiteEngineerRole];

  const sectionVisibility = useMemo(() => ({
    recentRequisitions: hasAccess(allAllowedRoles),
    lowStockAlerts: hasAccess([...adminRoles, ...storekeeperRole]),
    storesOverview: hasAccess([...adminRoles, ...storekeeperRole]),
    recentSiteAssignments: hasAccess([...adminRoles, ...siteEngineerRole, ...diocesanSiteEngineerRole]),
    recentStockArrivals: hasAccess([...adminRoles, ...storekeeperRole]),
    recentMaterials: hasAccess([...adminRoles, ...diocesanSiteEngineerRole]),
    stockLevels: hasAccess([...adminRoles, ...storekeeperRole]),
    assignedSites: hasAccess(siteEngineerRole),
    recentApprovals: hasAccess(allAllowedRoles),
  }), [hasAccess, adminRoles, siteEngineerRole, storekeeperRole, diocesanSiteEngineerRole]);

  const calculatePercentageChange = useCallback((current: number, previous: number): { change: string; trend: 'up' | 'down' | 'neutral' } => {
    if (previous === 0) {
      return { change: current > 0 ? 'New' : '0%', trend: current > 0 ? 'up' : 'neutral' };
    }
    const change = ((current - previous) / previous) * 100;
    const formattedChange = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
    return { change: formattedChange, trend: change >= 0 ? 'up' : 'down' };
  }, []);

  const statCardsConfig: StatCardConfig[] = useMemo(() => [
    {
      label: 'Total Materials', value: dashboardData.stats.totalMaterials,
      icon: Box, iconColor: 'text-indigo-600', iconBgColor: 'bg-indigo-50',
      trend: calculatePercentageChange(dashboardData.stats.totalMaterials, dashboardData.previousStats.totalMaterials).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.totalMaterials, dashboardData.previousStats.totalMaterials).change,
      allowedRoles: [...adminRoles, ...diocesanSiteEngineerRole],
    },
    {
      label: 'Pending Requests', value: dashboardData.stats.pendingRequisitions,
      icon: Clock, iconColor: 'text-amber-600', iconBgColor: 'bg-amber-50',
      trend: calculatePercentageChange(dashboardData.stats.pendingRequisitions, dashboardData.previousStats.pendingRequisitions).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.pendingRequisitions, dashboardData.previousStats.pendingRequisitions).change,
      allowedRoles: allAllowedRoles,
    },
    {
      label: 'Approved Requests', value: dashboardData.stats.approvedRequisitions,
      icon: ClipboardList, iconColor: 'text-emerald-600', iconBgColor: 'bg-emerald-50',
      trend: calculatePercentageChange(dashboardData.stats.approvedRequisitions, dashboardData.previousStats.approvedRequisitions).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.approvedRequisitions, dashboardData.previousStats.approvedRequisitions).change,
      allowedRoles: allAllowedRoles,
    },
    {
      label: 'Low Stock Alerts', value: dashboardData.stats.lowStockAlerts,
      icon: AlertTriangle, iconColor: 'text-red-600', iconBgColor: 'bg-red-50',
      trend: calculatePercentageChange(dashboardData.stats.lowStockAlerts, dashboardData.previousStats.lowStockAlerts).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.lowStockAlerts, dashboardData.previousStats.lowStockAlerts).change,
      allowedRoles: [...adminRoles, ...storekeeperRole],
    },
    {
      label: 'Total Sites', value: dashboardData.stats.totalSites,
      icon: Building2, iconColor: 'text-primary-600', iconBgColor: 'bg-primary-50',
      trend: calculatePercentageChange(dashboardData.stats.totalSites, dashboardData.previousStats.totalSites).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.totalSites, dashboardData.previousStats.totalSites).change,
      allowedRoles: adminRoles,
    },
    {
      label: 'Active Contracts', value: 0,
      icon: Briefcase, iconColor: 'text-amber-600', iconBgColor: 'bg-amber-50',
      allowedRoles: adminRoles,
    },
    {
      label: 'Site Engineers', value: dashboardData.stats.siteEngineers,
      icon: Users, iconColor: 'text-teal-600', iconBgColor: 'bg-teal-50',
      trend: calculatePercentageChange(dashboardData.stats.siteEngineers, dashboardData.previousStats.siteEngineers).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.siteEngineers, dashboardData.previousStats.siteEngineers).change,
      allowedRoles: [...adminRoles, ...diocesanSiteEngineerRole],
    },
    {
      label: 'Assigned Sites', value: dashboardData.stats.assignedSites,
      icon: MapPin, iconColor: 'text-purple-600', iconBgColor: 'bg-purple-50',
      trend: calculatePercentageChange(dashboardData.stats.assignedSites, dashboardData.previousStats.assignedSites).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.assignedSites, dashboardData.previousStats.assignedSites).change,
      allowedRoles: siteEngineerRole,
    },
    {
      label: 'Total Stock Items', value: dashboardData.stats.totalStockItems,
      icon: Package, iconColor: 'text-cyan-600', iconBgColor: 'bg-cyan-50',
      trend: calculatePercentageChange(dashboardData.stats.totalStockItems, dashboardData.previousStats.totalStockItems).trend,
      trendValue: calculatePercentageChange(dashboardData.stats.totalStockItems, dashboardData.previousStats.totalStockItems).change,
      allowedRoles: storekeeperRole,
    },
    {
      label: 'Total Clients', value: dashboardData.users.length,
      icon: Users, iconColor: 'text-rose-600', iconBgColor: 'bg-rose-50',
      allowedRoles: [...adminRoles, ...storekeeperRole],
    },
  ], [dashboardData, calculatePercentageChange, adminRoles, diocesanSiteEngineerRole, allAllowedRoles, siteEngineerRole, storekeeperRole]);

  const visibleStatCards = statCardsConfig.filter(stat => hasAccess(stat.allowedRoles));

  const getPreviousPeriodFilters = (filters: FilterParams): FilterParams => {
    const toDate = filters.date_to ? new Date(filters.date_to) : new Date();
    const fromDate = filters.date_from ? new Date(filters.date_from) : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const periodLength = toDate.getTime() - fromDate.getTime();
    const prevToDate = new Date(fromDate.getTime() - 1000);
    const prevFromDate = new Date(prevToDate.getTime() - periodLength);
    return { date_from: prevFromDate.toISOString().split('T')[0], date_to: prevToDate.toISOString().split('T')[0] };
  };

  const fetchData = async () => {
    if (!hasAccess(allAllowedRoles)) {
      setError('Access restricted to authorized roles');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const prevFilters = getPreviousPeriodFilters(filters);

      const currentPromises: Promise<any>[] = [];
      const previousPromises: Promise<any>[] = [];

      if (hasAccess([...adminRoles, ...storekeeperRole, ...diocesanSiteEngineerRole])) {
        currentPromises.push(requisitionService.getAllRequisitions(filters));
        previousPromises.push(requisitionService.getAllRequisitions(prevFilters));
      } else if (hasAccess(siteEngineerRole)) {
        currentPromises.push(requisitionService.getAllMyRequisitions());
        previousPromises.push(requisitionService.getAllMyRequisitions());
      } else {
        currentPromises.push(Promise.resolve({ data: { requests: [] } }));
        previousPromises.push(Promise.resolve({ data: { requests: [] } }));
      }

      if (hasAccess(siteEngineerRole)) {
        currentPromises.push(siteAssignmentService.getUserAssignedSites());
        previousPromises.push(siteAssignmentService.getUserAssignedSites());
      } else if (hasAccess([...adminRoles, ...diocesanSiteEngineerRole])) {
        currentPromises.push(siteAssignmentService.getAllSiteAssignments({ limit: 3, ...filters }));
        previousPromises.push(siteAssignmentService.getAllSiteAssignments({ limit: 3, ...prevFilters }));
      } else {
        currentPromises.push(Promise.resolve({ assignments: [] }));
        previousPromises.push(Promise.resolve({ assignments: [] }));
      }

      if (hasAccess([...adminRoles, ...storekeeperRole, ...diocesanSiteEngineerRole])) {
        currentPromises.push(materialService.getAllMaterials(filters), siteService.getAllSites(), userService.getAllUsers());
        previousPromises.push(materialService.getAllMaterials(prevFilters), siteService.getAllSites(), userService.getAllUsers());
      } else {
        currentPromises.push(Promise.resolve([]), Promise.resolve({ sites: [] }), Promise.resolve({ data: { users: [] } }));
        previousPromises.push(Promise.resolve([]), Promise.resolve({ sites: [] }), Promise.resolve({ data: { users: [] } }));
      }

      if (hasAccess([...adminRoles, ...storekeeperRole])) {
        currentPromises.push(stockService.getLowStockAlerts(filters), storeService.getAllStores(), stockService.getStockHistory({ limit: 3, movement_type: 'IN', ...filters }), stockService.getAllStock());
        previousPromises.push(stockService.getLowStockAlerts(prevFilters), storeService.getAllStores(), stockService.getStockHistory({ limit: 3, movement_type: 'IN', ...prevFilters }), stockService.getAllStock());
      } else {
        currentPromises.push(Promise.resolve({ lowStockItems: [] }), Promise.resolve({ stores: [] }), Promise.resolve({ history: [] }), Promise.resolve([]));
        previousPromises.push(Promise.resolve({ lowStockItems: [] }), Promise.resolve({ stores: [] }), Promise.resolve({ history: [] }), Promise.resolve([]));
      }

      const [[requisitionsResponse, siteAssignmentsResponse, materialsResponse, sitesResponse, usersResponse, lowStockResponse, storesResponse, stockHistoryResponse, stocksResponse],
        [prevRequisitionsResponse, prevSiteAssignmentsResponse, prevMaterialsResponse, prevSitesResponse, prevUsersResponse, prevLowStockResponse, prevStoresResponse, prevStockHistoryResponse, prevStocksResponse]] = await Promise.all([Promise.all(currentPromises), Promise.all(previousPromises)]);

      const materials = materialsResponse || [];
      const recentRequisitions = requisitionsResponse?.data?.requests?.slice(0, 5) || [];
      const sites = sitesResponse?.sites || [];
      const lowStockAlerts = lowStockResponse?.lowStockItems || [];
      const stores = storesResponse?.stores || [];
      const recentSiteAssignments = hasAccess(siteEngineerRole) ? siteAssignmentsResponse?.map((site: Site) => ({ id: site.id, site_id: site.id, user_id: user?.id || 0, assigned_at: site.created_at || new Date().toISOString(), status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE', site, user: { id: user?.id || 0, full_name: user?.full_name || 'N/A' } })) || [] : siteAssignmentsResponse?.assignments || [];
      const recentStockArrivals = stockHistoryResponse?.history || [];
      const stocks = stocksResponse?.stock || [];
      const users = usersResponse?.data?.users || [];
      const assignedSites = hasAccess(siteEngineerRole) ? siteAssignmentsResponse || [] : [];
      const recentMaterials = materials.sort((a: Material, b: Material) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()).slice(0, 4);

      const recentApprovals = recentRequisitions
        .flatMap((req: MaterialRequisition) => (req.approvals || []).map((a: any) => ({
          id: a.id,
          action: a.action,
          reviewer: a.reviewer?.full_name || 'N/A',
          requestId: req.id,
          siteName: req.site?.name || 'N/A',
          date: a.created_at,
        })))
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const prevMaterials = prevMaterialsResponse || [];
      const prevRequisitions = prevRequisitionsResponse?.data?.requests || [];
      const prevSites = prevSitesResponse?.sites || [];
      const prevLowStockAlerts = prevLowStockResponse?.lowStockItems || [];
      const prevStores = prevStoresResponse?.stores || [];
      const prevUsers = prevUsersResponse?.data?.users || [];
      const prevAssignedSites = hasAccess(siteEngineerRole) ? prevSiteAssignmentsResponse || [] : [];
      const prevStocks = prevStocksResponse?.stock || [];

      setDashboardData({
        materials, recentRequisitions, lowStockAlerts, recentSiteAssignments, recentStockArrivals, recentMaterials, sites, stores, users, assignedSites, stocks,
        recentApprovals,
        stockInCount: 0,
        stockOutCount: 0,
        stats: {
          totalMaterials: Number(materials.length), pendingRequisitions: Number(recentRequisitions.filter(req => req.status === 'PENDING').length),
          verifiedRequisitions: Number(recentRequisitions.filter(req => req.status === 'WAITING_PADIRI_REVIEW').length),
          approvedRequisitions: Number(recentRequisitions.filter(req => req.status === 'APPROVED').length),
          issuedRequisitions: Number(recentRequisitions.filter(req => req.status === 'ISSUED').length),
          receivedRequisitions: Number(recentRequisitions.filter(req => req.status === 'RECEIVED').length),
          closedRequisitions: Number(recentRequisitions.filter(req => req.status === 'CLOSED').length),
          totalSites: Number(sites.length), siteEngineers: Number(users.filter(u => u.role?.name === 'SITE_ENGINEER').length),
          lowStockAlerts: Number(lowStockAlerts.length), assignedSites: Number(assignedSites.length),
          uniqueStores: Number(stores.length), totalStockItems: Number(stocks.length),
        },
        previousStats: {
          totalMaterials: Number(prevMaterials.length), pendingRequisitions: Number(prevRequisitions.filter(req => req.status === 'PENDING').length),
          verifiedRequisitions: Number(prevRequisitions.filter(req => req.status === 'WAITING_PADIRI_REVIEW').length),
          approvedRequisitions: Number(prevRequisitions.filter(req => req.status === 'APPROVED').length),
          issuedRequisitions: Number(prevRequisitions.filter(req => req.status === 'ISSUED').length),
          receivedRequisitions: Number(prevRequisitions.filter(req => req.status === 'RECEIVED').length),
          closedRequisitions: Number(prevRequisitions.filter(req => req.status === 'CLOSED').length),
          totalSites: Number(prevSites.length), siteEngineers: Number(prevUsers.filter(u => u.role?.name === 'SITE_ENGINEER').length),
          lowStockAlerts: Number(prevLowStockAlerts.length), assignedSites: Number(prevAssignedSites.length),
          uniqueStores: Number(prevStores.length), totalStockItems: Number(prevStocks.length),
        },
      });
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [userRole, filters]);

  const formatDate = (date?: Date | string): string => {
    if (!date) return new Date().toLocaleDateString('en-GB');
    return new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatRelativeTime = (date?: Date | string): string => {
    if (!date) return '';
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(date);
  };

  const quickActions = [
    { label: 'Add Material', icon: Plus, onClick: () => navigate('/admin/dashboard/material-management'), color: 'from-indigo-500 to-indigo-600' },
    { label: 'Create Requisition', icon: ClipboardList, onClick: () => navigate('/admin/dashboard/material-requisition'), color: 'from-emerald-500 to-emerald-600' },
    { label: 'Add Stock', icon: Package, onClick: () => navigate('/admin/dashboard/stock-management'), color: 'from-purple-500 to-purple-600' },
    { label: 'Assign Site', icon: MapPin, onClick: () => navigate('/admin/dashboard/site-assign-management'), color: 'from-teal-500 to-teal-600' },
    { label: 'Generate Report', icon: FileText, onClick: () => navigate('/admin/dashboard/request-report'), color: 'from-orange-500 to-orange-600' },
  ];

  // Requisition status colors for DonutChart
  const requisitionStatusSegments = [
    { label: 'Pending', value: dashboardData.stats.pendingRequisitions, color: '#f59e0b' },
    { label: 'Review', value: dashboardData.stats.verifiedRequisitions, color: '#f97316' },
    { label: 'Approved', value: dashboardData.stats.approvedRequisitions, color: '#22c55e' },
    { label: 'Issued', value: dashboardData.stats.issuedRequisitions, color: '#3b82f6' },
    { label: 'Received', value: dashboardData.stats.receivedRequisitions, color: '#8b5cf6' },
    { label: 'Closed', value: dashboardData.stats.closedRequisitions, color: '#9ca3af' },
  ];

  // Stock level bars for chart
  const topStockBars = dashboardData.stocks
    .slice(0, 8)
    .map((s) => ({
      label: s.material?.name?.substring(0, 8) || 'N/A',
      value: Number(s.qty_on_hand) || 0,
      color: Number(s.qty_on_hand) > (s.low_stock_threshold || 0) ? '#22c55e' : '#ef4444',
    }));

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-5 bg-gray-200 rounded w-48" />
            <div className="h-3 bg-gray-200 rounded w-72" />
          </div>
        </div>
        <StatsGridSkeleton count={visibleStatCards.length || 4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button onClick={fetchData} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess(allAllowedRoles)) {
    return <AccessRestricted />;
  }

  const totalRequisitions = dashboardData.stats.pendingRequisitions + dashboardData.stats.approvedRequisitions +
    dashboardData.stats.issuedRequisitions + dashboardData.stats.receivedRequisitions + dashboardData.stats.closedRequisitions;

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 lg:p-8 text-white shadow-xl">
        <nav className="flex items-center gap-1.5 text-sm text-primary-100 mb-3">
          <Home className="w-3.5 h-3.5" />
          <ChevronRight className="w-3 h-3" />
          <span className="text-white font-medium">Dashboard</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Executive Dashboard</h1>
            <p className="text-primary-100 mt-1.5 text-sm lg:text-base">
              Real-time overview of diocese infrastructure and inventory operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all border border-white/10"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl backdrop-blur-sm transition-all border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ── Date Filters ── */}
      {showFilters && (
        <Card padding="md" className="animate-slide-down">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="date" value={filters.date_from || ''} onChange={(e) => setFilters(prev => ({ ...prev, date_from: e.target.value }))}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input type="date" value={filters.date_to || ''} onChange={(e) => setFilters(prev => ({ ...prev, date_to: e.target.value }))}
                  className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" />
              </div>
            </div>
            {(filters.date_from || filters.date_to) && (
              <button onClick={() => setFilters({ date_from: '', date_to: '' })}
                className="px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 mt-5">Clear</button>
            )}
          </div>
        </Card>
      )}

      {/* ── Quick Actions ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            className={`inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r ${action.color} text-white text-sm font-medium rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-sm active:scale-[0.98]`}
          >
            <action.icon className="w-4 h-4" />
            {action.label}
          </button>
        ))}
      </div>

      {/* ── KPI Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {visibleStatCards.slice(0, 10).map((stat, i) => (
          <StatCard key={i} {...stat} animate />
        ))}
      </div>

      {/* ── Requisition Trend Line Chart ── */}
      {sectionVisibility.recentRequisitions && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Requisition Trends (30-Day)</h3>
              <p className="text-xs text-gray-500 mt-0.5">Daily request activity</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={(() => {
                  const days = Array.from({ length: 30 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (29 - i));
                    return d.toISOString().split('T')[0];
                  });
                  const reqCount: Record<string, number> = {};
                  dashboardData.recentRequisitions.forEach((r: any) => {
                    const day = r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '';
                    if (day) reqCount[day] = (reqCount[day] || 0) + 1;
                  });
                  return days.map((day) => ({
                    date: day.slice(5),
                    requests: reqCount[day] || 0,
                    fill: (reqCount[day] || 0) > 0 ? '#6366f1' : '#e5e7eb',
                  }));
                })()}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [value, 'Requests']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="url(#trendGradient)" strokeWidth={2} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* ── Analytics Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requisition Status Distribution - Donut Chart */}
        {sectionVisibility.recentRequisitions && (
          <Card padding="md" className="lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Requisition Status</h3>
                <p className="text-xs text-gray-500 mt-0.5">Distribution overview</p>
              </div>
              <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
            </div>              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-[180px] mx-auto">
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={requisitionStatusSegments.filter(s => s.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1200}
                        animationEasing="ease-out"
                      >
                        {requisitionStatusSegments.filter(s => s.value > 0).map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [value, name]}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                          fontSize: '13px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">{totalRequisitions}</p>
                      <p className="text-[10px] text-gray-500 -mt-0.5">Total</p>
                    </div>
                  </div>
                </div>
                <div className="w-full mt-4 space-y-1.5">
                  {requisitionStatusSegments.filter(s => s.value > 0).map((seg, i) => (
                    <div key={i} className="flex items-center justify-between text-xs group cursor-default">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: seg.color }} />
                        <span className="text-gray-600">{seg.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{seg.value}</span>
                    </div>
                  ))}
                </div>
              </div>
          </Card>
        )}

        {/* Stock Level Bar Chart */}
        {(hasAccess([...adminRoles, ...storekeeperRole])) && (
          <Card padding="md" className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Stock Level Overview</h3>
                <p className="text-xs text-gray-500 mt-0.5">Top materials by quantity on hand</p>
              </div>
              <button onClick={() => navigate('/admin/dashboard/stock-management')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View All</button>
            </div>
            {topStockBars.length > 0 ? (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <ReBarChart data={topStockBars} barCategoryGap="20%" margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(value: number) => [value.toLocaleString(), 'Qty on Hand']}
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1000} animationEasing="ease-out">
                      {topStockBars.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </ReBarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-sm text-gray-400">No stock data available</p>
              </div>
            )}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                Adequate Stock
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Low Stock
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── Key Metrics & Stock Movement ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Key Metrics */}
        {(hasAccess([...adminRoles, ...storekeeperRole])) && (
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Key Performance Indicators</h3>
                <p className="text-xs text-gray-500 mt-0.5">Stock &amp; site metrics</p>
              </div>
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="space-y-5">
              {/* Stock Fill Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Stock Fill Rate</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {dashboardData.stats.totalStockItems > 0
                      ? Math.round((dashboardData.stocks.filter(s => Number(s.qty_on_hand) > (s.low_stock_threshold || 0)).length / Math.max(dashboardData.stats.totalStockItems, 1)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${dashboardData.stats.totalStockItems > 0 ? Math.min((dashboardData.stocks.filter(s => Number(s.qty_on_hand) > (s.low_stock_threshold || 0)).length / Math.max(dashboardData.stats.totalStockItems, 1)) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              {/* Site Utilization */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Site Utilization</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {dashboardData.stats.totalSites > 0 ? Math.round((dashboardData.stats.assignedSites / dashboardData.stats.totalSites) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all duration-700"
                    style={{ width: `${dashboardData.stats.totalSites > 0 ? (dashboardData.stats.assignedSites / dashboardData.stats.totalSites) * 100 : 0}%` }}
                  />
                </div>
              </div>
              {/* Low Stock Alert Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">Low Stock Alert Rate</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {dashboardData.stats.totalStockItems > 0 ? Math.round((dashboardData.stats.lowStockAlerts / dashboardData.stats.totalStockItems) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-700"
                    style={{ width: `${dashboardData.stats.totalStockItems > 0 ? Math.min((dashboardData.stats.lowStockAlerts / dashboardData.stats.totalStockItems) * 100, 100) : 0}%` }}
                  />
                </div>
              </div>
              {/* Stock Movement Summary */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Movement</span>
                  <span className="text-[10px] text-gray-400">30-day trend</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Truck className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-xs text-gray-500">Stock In</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">{dashboardData.recentStockArrivals.length}</p>
                  </div>
                  <div className="flex-1 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-lg p-3 border border-orange-100">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Package className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs text-gray-500">Stock Out</span>
                    </div>
                    <p className="text-lg font-bold text-orange-700">0</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Activity Feed - takes 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Requisitions */}
          {sectionVisibility.recentRequisitions && (
            <Card padding="none">
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Recent Requisitions</h3>
                    <p className="text-[10px] text-gray-500">Latest material requests</p>
                  </div>
                </div>
                <button onClick={() => navigate('/admin/dashboard/material-requisition')}
                  className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {dashboardData.recentRequisitions.length === 0 ? (
                  <div className="text-center py-10">
                    <ClipboardList className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No requisitions yet</p>
                  </div>
                ) : (
                  dashboardData.recentRequisitions.slice(0, 4).map((req) => (
                    <div key={req.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/admin/dashboard/material-requisition/${req.id}`)}>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                          <ClipboardList className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{req.site?.name || 'N/A'}</p>
                          <p className="text-xs text-gray-500 truncate">by {req.requestedBy?.full_name || 'N/A'} &middot; {formatRelativeTime(req.created_at)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={req.status || 'PENDING'} size="sm" />
                        <ExternalLink className="w-3.5 h-3.5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          )}

          {/* Combined: Stock Arrivals + Low Stock + Approvals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Stock Arrivals */}
            {sectionVisibility.recentStockArrivals && (
              <Card padding="none">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Stock Arrivals</h3>
                      <p className="text-[10px] text-gray-500">Latest additions</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/admin/dashboard/stock-history-management')}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {dashboardData.recentStockArrivals.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No arrivals yet</p>
                    </div>
                  ) : (
                    dashboardData.recentStockArrivals.slice(0, 3).map((arrival) => (
                      <div key={arrival.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{arrival.material?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">Qty: {Number(arrival.quantity) || 0}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(arrival.created_at)}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

            {/* Low Stock Alerts */}
            {sectionVisibility.lowStockAlerts && (
              <Card padding="none">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Low Stock Alerts</h3>
                      <p className="text-[10px] text-gray-500">Items below threshold</p>
                    </div>
                  </div>
                  <Badge variant="danger" size="sm">{dashboardData.stats.lowStockAlerts} alerts</Badge>
                </div>
                <div className="divide-y divide-gray-50">
                  {dashboardData.lowStockAlerts.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No alerts</p>
                    </div>
                  ) : (
                    dashboardData.lowStockAlerts.slice(0, 3).map((stock) => (
                      <div key={stock.id} className="flex items-center justify-between px-4 py-2.5 bg-red-50/30 hover:bg-red-50 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{stock.material?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{Number(stock.qty_on_hand) || 0} remaining</p>
                          </div>
                        </div>
                        <Badge variant="danger" size="sm">Low</Badge>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ── Second Row: Additional Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Recent Materials */}
        {sectionVisibility.recentMaterials && (
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Box className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Recent Materials</h3>
                  <p className="text-[10px] text-gray-500">Latest catalog additions</p>
                </div>
              </div>
              <button onClick={() => navigate('/admin/dashboard/material-management')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
            </div>
            <div className="divide-y divide-gray-50">
              {dashboardData.recentMaterials.length === 0 ? (
                <div className="text-center py-8">
                  <Box className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No materials yet</p>
                </div>
              ) : (
                dashboardData.recentMaterials.slice(0, 4).map((material) => (
                  <div key={material.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                        <Box className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{material.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate">{material.category?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(material.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Recent Approvals */}
        {sectionVisibility.recentApprovals && (
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Recent Approvals</h3>
                  <p className="text-[10px] text-gray-500">Latest activity</p>
                </div>
              </div>
              <button onClick={() => navigate('/admin/dashboard/material-requisition')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
            </div>
            <div className="divide-y divide-gray-50">
              {dashboardData.recentApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No approvals yet</p>
                </div>
              ) : (
                dashboardData.recentApprovals.slice(0, 4).map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        approval.action === 'APPROVED' ? 'bg-emerald-50' : approval.action === 'REJECTED' ? 'bg-red-50' : 'bg-amber-50'
                      }`}>
                        <CheckCircle className={`w-4 h-4 ${
                          approval.action === 'APPROVED' ? 'text-emerald-600' : approval.action === 'REJECTED' ? 'text-red-600' : 'text-amber-600'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{approval.reviewer}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {approval.siteName} &middot; {approval.action === 'APPROVED' ? 'Approved' : approval.action === 'REJECTED' ? 'Rejected' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(approval.date)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Stores Overview */}
        {sectionVisibility.storesOverview && (
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Stores</h3>
                  <p className="text-[10px] text-gray-500">{dashboardData.stores.length} active stores</p>
                </div>
              </div>
              <button onClick={() => navigate('/admin/dashboard/store-management')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
            </div>
            <div className="p-4">
              {dashboardData.stores.length === 0 ? (
                <div className="text-center py-6">
                  <Building2 className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No stores configured</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {dashboardData.stores.slice(0, 6).map((store) => (
                    <div key={store.id} className="p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="w-6 h-6 bg-primary-50 rounded-md flex items-center justify-center">
                          <Building2 className="w-3 h-3 text-primary-600" />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 truncate">{store.name}</p>
                      </div>
                      <p className="text-[10px] text-gray-500 ml-8 truncate">{store.location || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* ── Stock Levels Detail Section ── */}
      {sectionVisibility.stockLevels && dashboardData.stocks.length > 0 && (
        <Card padding="none">
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Stock Levels</h3>
                <p className="text-[10px] text-gray-500">Current inventory quantities &amp; thresholds</p>
              </div>
            </div>
            <button onClick={() => navigate('/admin/dashboard/stock-management')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium">View All</button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dashboardData.stocks.slice(0, 6).map((stock) => {
                const qty = Number(stock.qty_on_hand) || 0;
                const threshold = Number(stock.low_stock_threshold) || 0;
                const isLow = qty <= threshold && threshold > 0;
                return (
                  <div key={stock.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isLow ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isLow ? 'bg-red-100' : 'bg-cyan-50'}`}>
                        <Package className={`w-4.5 h-4.5 ${isLow ? 'text-red-600' : 'text-cyan-600'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{stock.material?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate">{stock.store?.name || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className={`text-sm font-bold ${isLow ? 'text-red-700' : 'text-gray-900'}`}>{qty}</p>
                      <p className="text-[10px] text-gray-400">Threshold: {threshold}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* ── Third Row: Site-related cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Site Assignments */}
        {sectionVisibility.recentSiteAssignments && (
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Site Assignments</h3>
                  <p className="text-[10px] text-gray-500">Latest allocations</p>
                </div>
              </div>
              <button onClick={() => navigate('/admin/dashboard/site-assign-management')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
            </div>
            <div className="divide-y divide-gray-50">
              {dashboardData.recentSiteAssignments.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No assignments yet</p>
                </div>
              ) : (
                dashboardData.recentSiteAssignments.slice(0, 4).map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {hasAccess(siteEngineerRole) ? assignment.site?.name : assignment.user?.full_name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{assignment.site?.location || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatRelativeTime(assignment.assigned_at)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}

        {/* Assigned Sites (for site engineers) */}
        {sectionVisibility.assignedSites && (
          <Card padding="none">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">My Assigned Sites</h3>
                  <p className="text-[10px] text-gray-500">Sites assigned to you</p>
                </div>
              </div>
              <button onClick={() => navigate('/admin/dashboard/site-assign-management')}
                className="text-xs text-primary-600 hover:text-primary-700 font-medium">View</button>
            </div>
            <div className="divide-y divide-gray-50">
              {dashboardData.assignedSites.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No sites assigned</p>
                </div>
              ) : (
                dashboardData.assignedSites.slice(0, 4).map((site) => (
                  <div key={site.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-teal-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{site.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500 truncate">{site.location || 'N/A'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{formatDate(site.created_at)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
