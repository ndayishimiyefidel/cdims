import React from 'react';
import { 
  Warehouse,
  Building2,
  ClipboardList,
  ShoppingCart,
  Truck,
  FileBarChart,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface Category {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  name: string;
  description: string;
}

const Categories: React.FC = () => {
  const categories: Category[] = [
    { icon: Warehouse, name: 'Material Management', description: 'Complete material catalog with categories, units, and pricing for all diocese construction needs' },
    { icon: Building2, name: 'Site Management', description: 'Manage construction sites and parish facilities with detailed tracking across 50+ sites' },
    { icon: ClipboardList, name: 'Request Tracking', description: 'Multi-level approval workflow for material requisitions with full status visibility' },
    { icon: ShoppingCart, name: 'Procurement', description: 'End-to-end procurement from requisition to purchase order with supplier management' },
    { icon: Truck, name: 'Stock Control', description: 'Real-time inventory tracking with automated low-stock alerts and audit trail' },
    { icon: FileBarChart, name: 'Reports & Analytics', description: 'Comprehensive reporting with data export, activity logs, and performance analytics' },
    { icon: Users, name: 'User Management', description: 'Role-based access control with granular permissions and site assignments' },
    { icon: ShieldCheck, name: 'Approval Workflow', description: 'Multi-level approval process connecting parishes, engineers, and administration' },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-white" id="services">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-5 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200/50">
            <Sparkles size={14} className="text-primary-500" />
            <span>Comprehensive Diocese Management</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            System <span className="gradient-text-primary">Modules</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive suite of infrastructure management modules designed to optimize 
            every aspect of diocese resource management and operational efficiency
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="group relative"
            >
              <div className="relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 overflow-hidden text-center">
                <div className="mb-5 flex justify-center">
                  <div className="p-3.5 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-all duration-300 group-hover:scale-110">
                    <category.icon size={32} className="text-primary-600" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {category.description}
                </p>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-primary-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span>Learn more</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;