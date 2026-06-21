import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from '../../context';
import type { AuthContextType } from '../../context';
import {
  LayoutDashboard,
  Package,
  Layers,
  Ruler,
  Boxes,
  Truck,
  History,
  ClipboardList,
  FileCheck,
  Archive,
  FileText,
  Building2,
  MapPin,
  MapMinusIcon,
  Users,
  Briefcase,
  Store,
  Shield,
  UserCog,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  Church,
  Menu,
  LogOut,
  User,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onToggle: () => void;
  collapsed?: boolean;
  onCollapse?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
  children?: NavItem[];
  allowedRoles?: string[];
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onToggle, collapsed = false, onCollapse }) => {
  const { user } = useAuth() as AuthContextType;
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = user?.role?.name;

  const hasAccess = (allowedRoles?: string[]): boolean => {
    if (!allowedRoles || allowedRoles.length === 0) return true;
    if (!userRole) return false;
    return allowedRoles.includes(userRole);
  };

  // Auto-open dropdowns based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.children) {
          const hasActiveChild = item.children.some(
            (child) => child.path && currentPath === child.path
          );
          if (hasActiveChild) {
            setOpenDropdown(item.id);
            return;
          }
        }
      }
    }
    setOpenDropdown(null);
  }, [location.pathname]);

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const navGroups: NavGroup[] = [
    {
      label: "MAIN",
      items: [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          path: "/admin/dashboard",
        },
      ],
    },
    {
      label: "INVENTORY MANAGEMENT",
      items: [
        {
          id: "materialManagement",
          label: "Material Management",
          icon: Package,
          path: "/admin/dashboard/material-management",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
        {
          id: "categoryManagement",
          label: "Categories",
          icon: Layers,
          path: "/admin/dashboard/category-management",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
        {
          id: "unitsManagement",
          label: "Units",
          icon: Ruler,
          path: "/admin/dashboard/units-management",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
        {
          id: "stockManagement",
          label: "Stock Management",
          icon: Boxes,
          path: "/admin/dashboard/stock-management",
          allowedRoles: ["ADMIN", "STOREKEEPER", "PADIRI"],
        },
        {
          id: "stockMovement",
          label: "Stock Movement",
          icon: Truck,
          path: "/admin/dashboard/stock-movement",
          allowedRoles: ["ADMIN", "STOREKEEPER", "PADIRI"],
        },
        {
          id: "stockHistory",
          label: "Stock History",
          icon: History,
          path: "/admin/dashboard/stock-history-management",
          allowedRoles: ["ADMIN", "STOREKEEPER", "PADIRI"],
        },
      ],
    },
    {
      label: "REQUISITION MANAGEMENT",
      items: [
        {
          id: "materialRequisition",
          label: "Material Requisition",
          icon: ClipboardList,
          path: "/admin/dashboard/material-requisition",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER", "SITE_ENGINEER"],
        },
        {
          id: "requisitionTracking",
          label: "Requisition Tracking",
          icon: FileCheck,
          path: "/admin/dashboard/material-requisition",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER", "STOREKEEPER"],
        },
        {
          id: "issuableMaterials",
          label: "Issuable Materials",
          icon: Archive,
          path: "/admin/dashboard/issuable-materials",
          allowedRoles: ["ADMIN", "STOREKEEPER", "PADIRI"],
        },
        {
          id: "issuableRequests",
          label: "Issuable Requests",
          icon: FileCheck,
          path: "/admin/dashboard/issuable-requests",
          allowedRoles: ["ADMIN", "STOREKEEPER", "PADIRI"],
        },
      ],
    },
    {
      label: "SITE OPERATIONS",
      items: [
        {
          id: "siteManagement",
          label: "Site Management",
          icon: Building2,
          path: "/admin/dashboard/site-management",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
        {
          id: "siteAssign",
          label: "Site Assignment",
          icon: MapPin,
          path: "/admin/dashboard/site-assign-management",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
        {
          id: "siteReceiptTracking",
          label: "Site Receipt Tracking",
          icon: MapMinusIcon,
          path: "/admin/dashboard/site-receipt-tracking",
          allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
        },
      ],
    },
    {
      label: "BUSINESS MANAGEMENT",
      items: [
        {
          id: "clientManagement",
          label: "Clients",
          icon: Users,
          path: "/admin/dashboard/client-management",
          allowedRoles: ["PADIRI", "ADMIN"],
        },
        {
          id: "contractManagement",
          label: "Contracts",
          icon: Briefcase,
          path: "/admin/dashboard/contract-management",
        },
        {
          id: "storeManagement",
          label: "Stores",
          icon: Store,
          path: "/admin/dashboard/store-management",
          allowedRoles: ["PADIRI", "ADMIN", "STOREKEEPER"],
        },
      ],
    },
    {
      label: "ADMINISTRATION",
      items: [
        {
          id: "roleManagement",
          label: "Roles",
          icon: Shield,
          path: "/admin/dashboard/role-management",
          allowedRoles: ["ADMIN", "PADIRI"],
        },
        {
          id: "userManagement",
          label: "Users",
          icon: UserCog,
          path: "/admin/dashboard/client-management",
          allowedRoles: ["PADIRI", "ADMIN"],
        },
        {
          id: "adminProfile",
          label: "Admin Profile",
          icon: User,
          path: "/admin/dashboard/profile",
        },
      ],
    },
    {
      label: "REPORTS & ANALYTICS",
      items: [
        {
          id: "reports",
          label: "Reports",
          icon: FileText,
          children: [
            {
              id: "requestReport",
              label: "Requisitions Report",
              icon: FileText,
              path: "/admin/dashboard/request-report",
              allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
            },
            {
              id: "inventoryReport",
              label: "Inventory Report",
              icon: Package,
              path: "/admin/dashboard/inventory-report",
              allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
            },
            {
              id: "stockReport",
              label: "Stock Report",
              icon: BarChart3,
              path: "/admin/dashboard/stock-report",
              allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
            },
            {
              id: "siteReport",
              label: "Site Report",
              icon: Building2,
              path: "/admin/dashboard/site-report",
              allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
            },
            {
              id: "userReport",
              label: "User Report",
              icon: Users,
              path: "/admin/dashboard/user-report",
              allowedRoles: ["PADIRI", "ADMIN", "DIOCESAN_SITE_ENGINEER"],
            },
          ],
        },
      ],
    },
  ];

  // Filter groups based on user role
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (!hasAccess(item.allowedRoles)) return false;
        if (item.children) {
          const filteredChildren = item.children.filter((child) => hasAccess(child.allowedRoles));
          if (filteredChildren.length === 0) return false;
          item.children = filteredChildren;
        }
        return true;
      }),
    }))
    .filter((group) => group.items.length > 0);

  // Filter by search query
  const searchedGroups = searchQuery
    ? filteredGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => {
            const matches = (label: string) =>
              label.toLowerCase().includes(searchQuery.toLowerCase());
            if (matches(item.label)) return true;
            if (item.children) {
              const filteredChildren = item.children.filter((child) =>
                matches(child.label)
              );
              if (filteredChildren.length > 0) {
                setOpenDropdown(item.id);
                item.children = filteredChildren;
                return true;
              }
            }
            return false;
          }),
        }))
        .filter((group) => group.items.length > 0)
    : filteredGroups;

  const isActivePath = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (item: NavItem) => {
    if (item.children) {
      return item.children.some((child) => child.path && location.pathname === child.path);
    }
    return false;
  };

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const Icon = item.icon;
    const active = item.path ? isActivePath(item.path) : false;
    const parentActive = isParentActive(item);

    if (item.children) {
      const isOpen = openDropdown === item.id;
      return (
        <div key={item.id} className="space-y-0.5">
          <button
            onClick={() => toggleDropdown(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
              ${parentActive
                ? "bg-primary-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }
            `}
          >
            <Icon className={`w-4.5 h-4.5 shrink-0 ${parentActive ? "text-white" : "text-gray-400 group-hover:text-primary-500"}`} />
            {!collapsed && (
              <>
                <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  } ${parentActive ? "text-white" : "text-gray-400"}`}
                />
              </>
            )}
          </button>
          {isOpen && !collapsed && (
            <div className="ml-2 space-y-0.5 border-l-2 border-gray-100 pl-2">
              {item.children.map((child) => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <NavLink
        key={item.id}
        to={item.path!}
        end
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            isActive
              ? "bg-primary-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`
        }
        onClick={() => {
          if (window.innerWidth < 1024) onToggle();
        }}
      >
        <Icon
          className={`w-4.5 h-4.5 shrink-0 ${
            isActivePath(item.path)
              ? "text-white"
              : "text-gray-400 group-hover:text-primary-500"
          }`}
        />
        {!collapsed && (
          <span className="text-sm font-medium truncate">{item.label}</span>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile Overlay with fade transition */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen bg-white flex flex-col border-r border-gray-200 shadow-xl
          transform transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50
          lg:relative lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "w-[72px]" : "w-64"}
        `}
      >
        {/* Logo Section */}
        <div className={`
          flex items-center border-b border-gray-100
          ${collapsed ? "justify-center px-2 py-4" : "justify-between px-4 py-4"}
        `}>
          {collapsed ? (
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all"
              title="CDIMS - Home"
            >
              <Church className="w-5 h-5 text-white" />
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center gap-2.5 group"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all group-hover:scale-105">
                  <Church className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-tight">CDIMS</h2>
                  <p className="text-[10px] text-gray-400 leading-tight">Management System</p>
                </div>
              </button>
              <button
                onClick={onToggle}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </>
          )}
        </div>

        {/* Collapse toggle button - only for desktop */}
        <button
          onClick={onCollapse}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full items-center justify-center shadow-sm hover:shadow-md hover:border-primary-300 transition-all z-10 group"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
            {collapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-primary-500 transition-colors" />
            ) : (
              <ChevronLeft className="w-3 h-3 text-gray-500 group-hover:text-primary-500 transition-colors" />
            )}
          </div>
        </button>

        {/* Search */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-gray-400 transition-all"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-4 scrollbar-thin">
          {searchedGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <div className="px-3 mb-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {group.label}
                  </span>
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          ))}

          {searchedGroups.length === 0 && !collapsed && (
            <div className="text-center py-8">
              <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No menu items found</p>
            </div>
          )}
        </nav>

        {/* User Profile Footer */}
        <div className={`
          border-t border-gray-100 p-3
          ${collapsed ? "flex justify-center" : ""}
        `}>
          <button
            onClick={() => navigate("/admin/dashboard/profile")}
            className={`
              flex items-center gap-3 rounded-xl transition-all duration-200 hover:bg-gray-50
              ${collapsed ? "p-2 justify-center w-full" : "p-2.5 w-full"}
            `}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <User className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || "Admin User"}
                </p>
                <p className="text-[11px] text-gray-500 truncate">{userRole || "Administrator"}</p>
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
