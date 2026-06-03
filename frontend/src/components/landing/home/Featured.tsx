import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const FeaturedModules = () => {
  const modules = [
    {
      id: 1,
      name: "Material Management",
      category: "Core Module",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=400&fit=crop",
      features: ["Material Catalog", "Unit & Category Management", "Pricing History"],
      badge: "Essential"
    },
    {
      id: 2,
      name: "Stock & Inventory",
      category: "Logistics Module",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=400&h=400&fit=crop",
      features: ["Real-time Stock Tracking", "Stock Movements", "Stock History"],
      badge: "Real-time"
    },
    {
      id: 3,
      name: "Request Management",
      category: "Workflow Module",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=400&fit=crop",
      features: ["Material Requisition", "Multi-level Approval", "Issue Tracking"],
      badge: "Streamlined"
    },
    {
      id: 4,
      name: "Site Management",
      category: "Field Module",
      image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&h=400&fit=crop",
      features: ["Site Profiles", "Assignment Tracking", "Receipt Management"],
      badge: "Comprehensive"
    },
    {
      id: 5,
      name: "Procurement",
      category: "Supply Module",
      image: "https://images.unsplash.com/photo-1566576912321-b58d8d6d0b0e?w=400&h=400&fit=crop",
      features: ["Supplier Management", "Purchase Orders", "Goods Receipt"],
      badge: "Efficient"
    },
    {
      id: 6,
      name: "Reports & Analytics",
      category: "Intelligence Module",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop",
      features: ["Custom Reports", "Data Export", "Performance Analytics"],
      badge: "Insightful"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="w-full xl:w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Core System Modules</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive infrastructure management solutions designed to streamline diocese operations 
            and enhance resource efficiency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.1)' }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={module.image} 
                  alt={module.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {module.badge}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-primary-600 text-sm font-medium">{module.category}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{module.name}</h3>
                
                <div className="space-y-2 mb-4">
                  {module.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Learn More <ChevronRight size={18} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedModules;