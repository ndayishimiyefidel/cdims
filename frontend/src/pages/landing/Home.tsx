import React, { useEffect, useRef } from 'react';
import HeroSection from '../../components/landing/home/HeroSection';
import AboutSection from '../../components/landing/home/About';
import Categories from '../../components/landing/home/Categories';
import FeaturedProducts from '../../components/landing/home/Featured';
import Testimonials from '../../components/landing/home/Testimonials';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Church, Warehouse, Star } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const StatisticsSection = () => (
  <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-10" />
    <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />
    <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl" />
    <div className="container-custom relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {[{ number: "50+", label: "Parishes & Institutions", icon: <Church className="w-6 h-6" /> },
          { number: "500+", label: "Materials Catalogued", icon: <Warehouse className="w-6 h-6" /> },
          { number: "1000+", label: "Requests Processed", icon: <Building2 className="w-6 h-6" /> },
          { number: "98%", label: "User Satisfaction", icon: <Star className="w-6 h-6" /> }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="text-center text-white">
            <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">{s.icon}</div>
            <div className="text-3xl md:text-4xl font-bold mb-1">{s.number}</div>
            <div className="text-primary-200 text-sm font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const PartnersSection = () => {
  const partners = [
    { name: "Diocese of Cyangugu", type: "Diocese" },
    { name: "Parish Network", type: "Parishes" },
    { name: "Diocese Institutions", type: "Institutions" },
    { name: "Construction Partners", type: "Partners" },
  ];
  return (
    <section className="section-padding bg-white border-y border-gray-100">
      <div className="container-custom">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Trusted by the Diocese</h2>
          <p className="text-gray-500">Serving parishes and institutions across the Catholic Diocese of Cyangugu</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="text-center group">
              <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-50 transition-colors shadow-sm">
                <Building2 className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors" />
              </div>
              <div className="font-semibold text-gray-900 text-sm">{p.name}</div>
              <div className="text-xs text-gray-400">{p.type}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section className="section-padding bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-5" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-3xl" />
      <div className="container-custom relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Diocese Management?</h2>
          <p className="text-gray-300 mb-8 text-lg">Join the Catholic Diocese of Cyangugu in modernizing infrastructure and materials management.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => navigate("/auth/admin/login")} className="inline-flex items-center justify-center gap-2 bg-primary-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/25">Get Started <ArrowRight size={18} /></button>
            <button onClick={() => navigate("/contact")} className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">Contact Us</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  const location = useLocation();
  const scrolled = useRef(false);

  // Auto-scroll to a section when navigated from another page via route state
  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string })?.scrollTo;
    if (scrollTo && !scrolled.current) {
      scrolled.current = true;
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        const element = document.getElementById(scrollTo);
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'smooth' });
        }
        // Clean up state so it doesn't re-scroll on re-renders
        window.history.replaceState({}, '');
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <main>
      <HeroSection />
      <StatisticsSection />
      <Categories />
      <AboutSection />
      <FeaturedProducts />
      <Testimonials />
      <PartnersSection />
      <CTASection />
    </main>
  );
};

export default Home;
