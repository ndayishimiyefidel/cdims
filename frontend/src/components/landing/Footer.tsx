import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  Church
} from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    solutions: ['Material Management', 'Stock & Inventory Control', 'Site Management', 'Procurement', 'Request Tracking', 'Reporting & Analytics', 'User Management'],
    company: ['About CDIMS', 'Our Mission', 'News & Updates', 'Contact Us'],
    support: ['Help Center', 'Documentation', 'System Status', 'Training Resources', 'Technical Support'],
    legal: ['Privacy Policy', 'Terms of Service', 'Data Security', 'Service Agreement']
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom py-12 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-3">Stay Connected with CDIMS</h3>
            <p className="text-primary-100 mb-8 text-sm md:text-base">
              Get the latest updates on system features, infrastructure management best practices, and announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                aria-label="Email for newsletter subscription"
              />
              <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-sm shadow-lg">
                Subscribe <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-14 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Church className="text-white" size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">CDIMS</h2>
                  <p className="text-xs text-gray-400">Diocese Information Management System</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-md">
                A comprehensive platform for managing infrastructure projects, construction materials, 
                stock inventory, and procurement across all parishes and institutions of the 
                Catholic Diocese of Cyangugu.
              </p>
              <div className="space-y-2.5 text-sm">
                <a href="mailto:info@cyangugudims.rw" className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors group">
                  <Mail size={15} className="text-primary-400 shrink-0" />
                  <span className="group-hover:text-white transition-colors">info@cyangugudims.rw</span>
                </a>
                <a href="tel:+250788301000" className="flex items-center gap-3 text-gray-400 hover:text-primary-400 transition-colors group">
                  <Phone size={15} className="text-primary-400 shrink-0" />
                  <span className="group-hover:text-white transition-colors">+250 788 301 000</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MapPin size={15} className="text-primary-400 shrink-0" />
                  <span>Diocese of Cyangugu, Rwanda</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Link Columns */}
          {[
            { title: 'Solutions', links: footerLinks.solutions },
            { title: 'Company', links: footerLinks.company },
            { title: 'Support', links: footerLinks.support },
            { title: 'Legal', links: footerLinks.legal }
          ].map((column, idx) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (idx + 1) }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold mb-4 text-white">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-400">
              &copy; 2025 CDIMS &mdash; Catholic Diocese of Cyangugu. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
