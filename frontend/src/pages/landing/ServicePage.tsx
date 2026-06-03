import { useState } from "react";
import { 
  Warehouse,
  Building2,
  ClipboardList,
  ShoppingCart,
  Truck,
  FileBarChart,
  Users,
  ShieldCheck,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  Award,
  Church,
  Settings
} from "lucide-react";
import HeaderBanner from "../../components/landing/HeaderBanner";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('core');

  const coreServices = [
    {
      icon: <Warehouse className="w-8 h-8" />,
      title: "Material Management",
      description: "Comprehensive material catalog for all diocese construction needs",
      features: ["Material catalog with categories", "Unit & price management", "Supplier catalog", "Material requests & approvals"]
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Stock & Inventory Control",
      description: "Real-time stock tracking with automated low-stock alerts",
      features: ["Multi-store inventory", "Stock movement tracking", "Low stock thresholds", "Stock history & audit"]
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Site Management",
      description: "Manage construction sites and parish facilities with detailed tracking",
      features: ["Site profiles & records", "Material allocation", "Site receipts tracking", "Project status monitoring"]
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Procurement",
      description: "End-to-end procurement from requisition to purchase order",
      features: ["Requisition submission", "Approval workflow", "Purchase order generation", "Supplier management"]
    }
  ];

  const advancedServices = [
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Request & Approval Workflow",
      description: "Multi-level approval process for material requisitions",
      features: ["Material requisitions", "DSE & Padiri approvals", "Status tracking", "Approval history"]
    },
    {
      icon: <FileBarChart className="w-8 h-8" />,
      title: "Reports & Analytics",
      description: "Real-time reporting and data visualization dashboard",
      features: ["Inventory reports", "Stock movement analysis", "User activity logs", "Export capabilities"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "User & Role Management",
      description: "Role-based access control with granular permissions",
      features: ["Role-based access", "User profiles", "Site assignments", "Activity auditing"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with complete audit trail",
      features: ["Audit logging", "Data encryption", "Access control", "Session management"]
    }
  ];

  const whyChoose = [
    {
      icon: <Church className="w-12 h-12" />,
      title: "Diocese-Specific",
      description: "Built for the Catholic Diocese of Cyangugu's infrastructure needs"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Quick Implementation",
      description: "Fast deployment with minimal disruption to operations"
    },
    {
      icon: <ShieldCheck className="w-12 h-12" />,
      title: "Data Security",
      description: "Enterprise-grade security with audit trails"
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "24/7 Support",
      description: "Dedicated technical support for all diocese staff"
    }
  ];

  const testimonials = [
    { name: "Fr. Jean Baptiste", parish: "Our Lady of Fatima Parish", rating: 5, comment: "CDIMS has transformed how we manage construction materials across our parishes." },
    { name: "Emmanuel Habimana", position: "Diocese Project Manager", rating: 5, comment: "The stock management and procurement workflow have significantly reduced waste." },
    { name: "Alice Mukamana", position: "Diocese Storekeeper", rating: 5, comment: "Real-time stock visibility helps us maintain optimal inventory levels at all times." }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <HeaderBanner title="Infrastructure Management Solutions" subtitle="Home / Solutions" backgroundStyle="image" icon={<Building2 className="w-10 h-10" />} />
      <section id="services" className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-primary-500 to-gray-800 bg-clip-text text-transparent mb-4">Our Solutions</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive infrastructure and materials management for the Diocese of Cyangugu</p>
          </div>
          <div className="flex justify-center mb-12">
            <div className="bg-primary-50 p-2 rounded-xl flex space-x-2">
              <button onClick={() => setActiveTab('core')}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${activeTab === 'core' ? 'bg-primary-600 text-white shadow-lg' : 'text-primary-700 hover:bg-primary-100'}`}>
                <Warehouse className="w-5 h-5" /><span>Core Modules</span>
              </button>
              <button onClick={() => setActiveTab('advanced')}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${activeTab === 'advanced' ? 'bg-primary-600 text-white shadow-lg' : 'text-primary-700 hover:bg-primary-100'}`}>
                <Settings className="w-5 h-5" /><span>Advanced Features</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(activeTab === 'core' ? coreServices : advancedServices).map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-primary-200 hover:-translate-y-2">
                <div className="text-primary-600 mb-6 group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h4>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3"><CheckCircle className="w-5 h-5 text-primary-500" /><span className="text-gray-700">{feature}</span></li>
                  ))}
                </ul>
                <button className="mt-6 w-full bg-primary-50 text-primary-700 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-primary-600 group-hover:text-white">
                  <span>Learn More</span><ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CDIMS?</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Built for the Diocese of Cyangugu</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChoose.map((item, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <div className="text-primary-600">{item.icon}</div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
