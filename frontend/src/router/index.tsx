/* eslint-disable react-refresh/only-export-components */
import { type FC, lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
// Landing pages (public — no auth required)
import Home from '../pages/landing/Home';
import MainLayout from '../layout/MainLayout';
import AboutPage from '../pages/landing/AboutPage';
import ContactUs from '../pages/landing/ContactUs';
import ServicePage from '../pages/landing/ServicePage';
// Auth pages (public)
import AuthLayout from '../layout/AuthLayout';
import AdminLogin from '../pages/auth/Login';
import UnlockScreen from '../pages/auth/UnlockScreen';
// Dashboard / admin pages (protected by auth guard)
import DashboardLayout from '../layout/DashboardLayout';
import DashboardHome from '../pages/dashboard/DashboardHome';
import ProtectPrivateAdminRoute from '../components/protectors/ProtectPrivateAdminRoute';
import AdminProfile from '../pages/dashboard/AdminProfile';
import StoreManagement from '../pages/dashboard/StoreManagement';
import EmployeeFormExample from '../components/dashboard/employee/EmployeeForm';
import ContractDashboard from '../pages/dashboard/ContractManagement';
import ViewEmployee from '../components/dashboard/employee/EmployeeViewMorePage';
import SitesManagement from '../pages/dashboard/SitesManagement';
import ClientManagement from '../pages/dashboard/ClientManagement';
import MaterialManagement from '../pages/dashboard/MaterialManagement';
import CategoryDashboard from '../pages/dashboard/CategoryManagement';
import UnitDashboard from '../pages/dashboard/UnitManagement';
import RoleManagement from '../pages/dashboard/RoleManagement';
import RequestsReportManagement from '../pages/dashboard/report/RequestsReportManagement'
import UserReportManagement from '../pages/dashboard/report/UserReportManagement'
import StockReportManagement from '../pages/dashboard/report/StockReportManagement'
import InventoryReportManagement from '../pages/dashboard/report/InventoryReportManagement'
import SiteReportManagement from '../pages/dashboard/report/SiteReportManagement'

import MaterialRequisition from '../pages/dashboard/MaterialRequisition';
import SiteReceiptTracking from '../pages/dashboard/SiteReceiptTracking';

import SiteAssignmentDashboard from '../pages/dashboard/SiteAssignmentDashboard';
import MaterialRequisitionDetail from '../pages/dashboard/MaterialRequisitionDetail';
import StockMovementsDashboard from '../pages/dashboard/StockMovement';
import IssuableRequestsDashboard from '../pages/dashboard/IssuableRequestsDashboard';
import IssuableMaterialsDashboard from '../pages/dashboard/IssuableMaterialsDashboard';
import IssueMaterialPage from '../components/dashboard/MaterialRequest/IssueMaterialPage';
import StockHistory from '../pages/dashboard/StockHistory';

const StockManagement = lazy(() => import('../pages/dashboard/StockManagement'));


/**
 * Loading spinner component for Suspense fallback
 */
const LoadingSpinner: FC = () => (
  <div className="flex items-center justify-center h-screen bg-white">
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      </div>
      <span className="text-xl font-bold text-primary-600 animate-pulse">CDIMS</span>
    </div>
  </div>
);

/**
 * Suspense wrapper for lazy-loaded components
 * @param props - Component props with children
 */
interface SuspenseWrapperProps {
  children: React.ReactNode;
}

const SuspenseWrapper: FC<SuspenseWrapperProps> = ({ children }) => {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
};

/**
 * Application routes configuration
 *
 * Route access rules:
 *   /, /about, /contact  → PUBLIC (MainLayout, no auth required)
 *   /auth/*               → PUBLIC (login, unlock — no auth required)
 *   /admin/*              → PROTECTED (wrapped in ProtectPrivateAdminRoute)
 *   /*                     → catch-all → redirect to home (public)
 */
const routes = createBrowserRouter([
  // ── Public landing pages (no auth required) ──────────────────────
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactUs />,
      },
      {
        path: 'solutions',
        element: <ServicePage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
  // ── Public auth pages (no auth required) ─────────────────────────
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'admin/login',
        element: (
          <SuspenseWrapper>
            <AdminLogin />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'admin/unlock',
        element: (
          <SuspenseWrapper>
            <UnlockScreen />
          </SuspenseWrapper>
        ),
      },
    ],
  },
  // ── Protected admin / dashboard routes (auth required) ───────────
  {
    path: '/admin',
    element: (
      <SuspenseWrapper>
        <ProtectPrivateAdminRoute>
          <Outlet />
        </ProtectPrivateAdminRoute>
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            path: '',
            element: (
              <SuspenseWrapper>
                <DashboardHome />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <AdminProfile />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'stock-management',
            element: (
              <SuspenseWrapper>
                <StockManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'stock-history-management',
            element: (
              <SuspenseWrapper>
                <StockHistory />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'store-management',
            element: (
              <SuspenseWrapper>
                <StoreManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'employee-management/:id',
            element: (
              <SuspenseWrapper>
                <ViewEmployee />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'employee-management/create',
            element: (
              <SuspenseWrapper>
                <EmployeeFormExample />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'employee-management/update/:id',
            element: (
              <SuspenseWrapper>
                <EmployeeFormExample />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'material-management',
            element: (
              <SuspenseWrapper>
                <MaterialManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'category-management',
            element: (
              <SuspenseWrapper>
                <CategoryDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'units-management',
            element: (
              <SuspenseWrapper>
                <UnitDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'contract-management',
            element: (
              <SuspenseWrapper>
                <ContractDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'site-management',
            element: (
              <SuspenseWrapper>
                <SitesManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'site-assign-management',
            element: (
              <SuspenseWrapper>
                <SiteAssignmentDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'client-management',
            element: (
              <SuspenseWrapper>
                <ClientManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'request-report',
            element: (
              <SuspenseWrapper>
                <RequestsReportManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'site-report',
            element: (
              <SuspenseWrapper>
                <SiteReportManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'inventory-report',
            element: (
              <SuspenseWrapper>
                <InventoryReportManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'user-report',
            element: (
              <SuspenseWrapper>
                <UserReportManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'stock-report',
            element: (
              <SuspenseWrapper>
                <StockReportManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'role-management',
            element: (
              <SuspenseWrapper>
                <RoleManagement />
              </SuspenseWrapper>
            ),
          },
              {
            path: 'material-requisition',
            element: (
              <SuspenseWrapper>
                 <MaterialRequisition />
              </SuspenseWrapper>
            ),
          },
             {
            path: 'material-requisition/:id',
            element: (
              <SuspenseWrapper>
                 <MaterialRequisitionDetail />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'site-receipt-tracking',
            element: (
              <SuspenseWrapper>
                 <SiteReceiptTracking />
              </SuspenseWrapper>
            ),
          },
             {
            path: 'stock-movement',
            element: (
              <SuspenseWrapper>
                 <StockMovementsDashboard />
              </SuspenseWrapper>
            ),
          },
             {
            path: 'issuable-requests',
            element: (
              <SuspenseWrapper>
                 <IssuableRequestsDashboard />
              </SuspenseWrapper>
            ),
          },
             {
            path: 'issuable-materials',
            element: (
              <SuspenseWrapper>
                 <IssuableMaterialsDashboard />
              </SuspenseWrapper>
            ),
          },
             {
            path: 'issuable-materials/create',
            element: (
              <SuspenseWrapper>
                 <IssueMaterialPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
]);

export default routes;
