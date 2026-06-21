import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const FeaturedModules = () => {
  const modules = [
    {
      id: 1,
      name: "Material Management",
      category: "Core Module",
      icon: "📦",
      features: ["Material Catalog with Categories", "Unit & Price Management", "Supplier Catalog", "Pricing History"],
      color: "from-primary-400 to-primary-600"
    },
    {
      id: 2,
      name: "Stock & Inventory",
      category: "Logistics",
      icon: "📊",
      features: ["Multi-store Real-time Tracking", "Stock Movement History", "Low Stock Alerts", "Complete Audit Trail"],
      color: "from-green-400 to-emerald-600"
    },
    {
      id: 3,
      name: "Request Management",
      category: "Workflow",
      icon: "📋",
      features: ["Material Requisition", "Multi-level Approval", "Issue Tracking", "Status Notifications"],
      color: "from-yellow-400 to-orange-500"
    },
    {
      id: 4,
      name: "Site Management",
      category: "Field Operations",
      icon: "🏗️",
      features: ["Site Profiles & Records", "Material Allocation", "Receipt Management", "Project Monitoring"],
      color: "from-purple-400 to-purple-600"
    },
    {
      id: 5,
      name: "Procurement",
      category: "Supply Chain",
      icon: "🛒",
      features: ["Purchase Order Generation", "Supplier Management", "Goods Receipt", "Order Tracking"],
      color: "from-red-400 to-rose-500"
    },
    {
      id: 6,
      name: "Reports & Analytics",
      category: "Intelligence",
      icon: "📈",
      features: ["Custom Report Builder", "Data Export (PDF/CSV)", "User Activity Logs", "Performance Analytics"],
      color: "from-cyan-400 to-blue-500"
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="modules">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Core System <span className="gradient-text-primary">Modules</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            Comprehensive infrastructure management solutions designed to streamline diocese operations 
            and enhance resource efficiency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {modules.map((mod, index) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 bg-gradient-to-br ${mod.color} rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0`}>
                    <span className="text-white">{mod.icon}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{mod.category}</span>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{mod.name}</h3>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2.5 mb-6 flex-1">
                  {mod.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-primary-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors group/btn">
                  Learn more
                  <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModules;