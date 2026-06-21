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
  ArrowRight,
  Zap,
  Award,
  Church,
  Settings,
  ChevronDown,
  Star,
  Mail,
  Phone,
  HelpCircle,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import HeaderBanner from "../../components/landing/HeaderBanner";

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('core');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const coreServices = [
    {
      icon: <Warehouse className="w-7 h-7" />,
      title: "Material Management",
      description: "Comprehensive material catalog for all diocese construction needs",
      features: ["Material catalog with categories", "Unit & price management", "Supplier catalog", "Material requests & approvals"],
      color: "from-primary-400 to-primary-600"
    },
    {
      icon: <Truck className="w-7 h-7" />,
      title: "Stock & Inventory Control",
      description: "Real-time stock tracking with automated low-stock alerts",
      features: ["Multi-store inventory", "Stock movement tracking", "Low stock thresholds", "Stock history & audit"],
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: <Building2 className="w-7 h-7" />,
      title: "Site Management",
      description: "Manage construction sites and parish facilities with detailed tracking",
      features: ["Site profiles & records", "Material allocation", "Site receipts tracking", "Project status monitoring"],
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <ShoppingCart className="w-7 h-7" />,
      title: "Procurement",
      description: "End-to-end procurement from requisition to purchase order",
      features: ["Requisition submission", "Approval workflow", "Purchase order generation", "Supplier management"],
      color: "from-purple-400 to-purple-600"
    }
  ];

  const advancedServices = [
    {
      icon: <ClipboardList className="w-7 h-7" />,
      title: "Request & Approval Workflow",
      description: "Multi-level approval process for material requisitions",
      features: ["Material requisitions", "DSE & Padiri approvals", "Status tracking", "Approval history"],
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: <FileBarChart className="w-7 h-7" />,
      title: "Reports & Analytics",
      description: "Real-time reporting and data visualization dashboard",
      features: ["Inventory reports", "Stock movement analysis", "User activity logs", "Export capabilities"],
      color: "from-red-400 to-rose-500"
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "User & Role Management",
      description: "Role-based access control with granular permissions",
      features: ["Role-based access", "User profiles", "Site assignments", "Activity auditing"],
      color: "from-indigo-400 to-indigo-600"
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with complete audit trail",
      features: ["Audit logging", "Data encryption", "Access control", "Session management"],
      color: "from-teal-400 to-teal-600"
    }
  ];

  const whyChoose = [
    { icon: <Church className="w-8 h-8" />, title: "Diocese-Specific", description: "Built for the Catholic Diocese of Cyangugu's infrastructure needs" },
    { icon: <Zap className="w-8 h-8" />, title: "Quick Implementation", description: "Fast deployment with minimal disruption to operations" },
    { icon: <ShieldCheck className="w-8 h-8" />, title: "Data Security", description: "Enterprise-grade security with audit trails" },
    { icon: <Award className="w-8 h-8" />, title: "24/7 Support", description: "Dedicated technical support for all diocese staff" }
  ];

  const workflowSteps = [
    { step: "01", title: "Submit Request", description: "Parishes submit material requisitions through the system" },
    { step: "02", title: "Review & Approve", description: "Multi-level approval workflow with full visibility" },
    { step: "03", title: "Process Order", description: "Procurement team generates purchase orders for suppliers" },
    { step: "04", title: "Track & Deliver", description: "Real-time tracking from order to delivery at site" }
  ];

  const faqs = [
    { q: "What is CDIMS and who is it for?", a: "CDIMS is a comprehensive digital platform designed for the Catholic Diocese of Cyangugu to manage infrastructure projects, construction materials, stock inventory, and procurement." },
    { q: "How do I get access to the system?", a: "Contact your parish administrator or the diocese IT department to request user access. You will be assigned a role with appropriate permissions." },
    { q: "What training is available for new users?", a: "We provide comprehensive training sessions for all users, including documentation, video tutorials, and hands-on workshops." },
    { q: "Is my data secure?", a: "Yes. CDIMS uses enterprise-grade security measures including data encryption, role-based access control, and complete audit logging." },
    { q: "Can I access CDIMS on mobile devices?", a: "Yes, CDIMS is fully responsive and works on all devices including smartphones and tablets." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeaderBanner title="Infrastructure Management Solutions" subtitle="Home / Solutions" backgroundStyle="image" icon={<Building2 className="w-10 h-10" />} />
      
      <section className="section-padding bg-white" id="services">
        <div className="container-custom">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200/50">
              <Sparkles size={14} />
              <span>Comprehensive Solutions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our <span className="gradient-text-primary">Solutions</span></h2>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">Comprehensive infrastructure and materials management for the Diocese of Cyangugu</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1.5 rounded-xl flex gap-1">
              <button onClick={() => setActiveTab('core')}
                className={"px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 " + (activeTab === 'core' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
                <Warehouse className="w-4 h-4 inline mr-2" />Core Modules
              </button>
              <button onClick={() => setActiveTab('advanced')}
                className={"px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 " + (activeTab === 'advanced' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600 hover:text-gray-900')}>
                <Settings className="w-4 h-4 inline mr-2" />Advanced Features
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'core' ? coreServices : advancedServices).map((service, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 hover:-translate-y-1 transition-all duration-300">
                <div className={"w-12 h-12 bg-gradient-to-br " + service.color + " rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300"}>
                  <div className="text-white">{service.icon}</div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h4>
                <p className="text-gray-500 text-sm mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={14} className="text-primary-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose <span className="gradient-text-primary">CDIMS</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Built specifically for the Catholic Diocese of Cyangugu</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChoose.map((item, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">{item.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It <span className="gradient-text-primary">Works</span></h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Simple 4-step workflow from request to delivery</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => (
              <motion.div key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="max-md:hidden absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-300 to-primary-100" />
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Frequently Asked <span className="gradient-text-primary">Questions</span></h2>
            <p className="text-lg text-gray-500">Everything you need to know about CDIMS</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={"text-gray-400 shrink-0 transition-transform duration-200 " + (openFaq === index ? 'rotate-180' : '')} />
                </button>
                <div className={"overflow-hidden transition-all duration-300 " + (openFaq === index ? 'max-h-40' : 'max-h-0')}>
                  <p className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">Join parishes and institutions across the Diocese of Cyangugu using CDIMS.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/auth/admin/login" className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">Get Started <ArrowRight size={18} /></a>
              <a href="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">Contact Sales</a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
