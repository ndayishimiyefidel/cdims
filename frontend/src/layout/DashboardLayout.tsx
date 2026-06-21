import React, { useState, useMemo } from 'react';

import Header from '../components/dashboard/Header';

import Sidebar from '../components/dashboard/Sidebar';

import { Outlet, useLocation } from 'react-router-dom';

// Breadcrumb mapping for dashboard routes
const breadcrumbMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/dashboard/profile': 'Admin Profile',
  '/admin/dashboard/material-management': 'Material Management',
  '/admin/dashboard/category-management': 'Categories',
  '/admin/dashboard/units-management': 'Units',
  '/admin/dashboard/stock-management': 'Stock Management',
  '/admin/dashboard/stock-movement': 'Stock Movement',
  '/admin/dashboard/stock-history-management': 'Stock History',
  '/admin/dashboard/material-requisition': 'Material Requisition',
  '/admin/dashboard/issuable-materials': 'Issuable Materials',
  '/admin/dashboard/issuable-requests': 'Issuable Requests',
  '/admin/dashboard/site-management': 'Site Management',
  '/admin/dashboard/site-assign-management': 'Site Assignment',
  '/admin/dashboard/site-receipt-tracking': 'Site Receipt Tracking',
  '/admin/dashboard/client-management': 'Client Management',
  '/admin/dashboard/contract-management': 'Contract Management',
  '/admin/dashboard/store-management': 'Store Management',
  '/admin/dashboard/role-management': 'Roles',
  '/admin/dashboard/request-report': 'Requisitions Report',
  '/admin/dashboard/inventory-report': 'Inventory Report',
  '/admin/dashboard/stock-report': 'Stock Report',
  '/admin/dashboard/site-report': 'Site Report',
  '/admin/dashboard/user-report': 'User Report',
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const onToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  const breadcrumbs = useMemo(() => {
    const path = location.pathname;
    const crumbs: Array<{ label: string; path: string }> = [];

    // Always start with Dashboard
    if (path.startsWith('/admin/dashboard')) {
      crumbs.push({ label: 'Home', path: '/admin/dashboard' });
    }

    // Check for exact match
    if (breadcrumbMap[path]) {
      if (path !== '/admin/dashboard') {
        crumbs.push({ label: breadcrumbMap[path], path });
      }
    } else {
      // Handle dynamic routes like /material-requisition/:id
      const basePath = '/' + path.split('/').slice(0, 4).join('/');
      if (basePath && breadcrumbMap[basePath]) {
        crumbs.push({ label: breadcrumbMap[basePath], path: basePath });
      }
    }

    return crumbs;
  }, [location.pathname]);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      <Sidebar onToggle={onToggle} isOpen={sidebarOpen} collapsed={collapsed} onCollapse={onCollapse} />
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'lg:ml-[72px]' : 'lg:ml-0'}`}>
        <Header onToggle={onToggle} breadcrumbs={breadcrumbs} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;