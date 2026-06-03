import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Fr. Jean-Baptiste",
      role: "Parish Priest",
      content: "CDIMS has transformed how we manage construction materials and track requests at our parish. The system brings transparency and efficiency to our infrastructure projects.",
      rating: 5
    },
    {
      id: 2,
      name: "Eng. David Mugisha",
      role: "Site Engineer",
      content: "The stock management and procurement modules have made my work significantly easier. I can now track all materials, submit requests, and manage sites from one platform.",
      rating: 5
    },
    {
      id: 3,
      name: "Sr. Marie Claire",
      role: "Diocese Administrator",
      content: "Having a centralized system for managing all diocese infrastructure needs has been invaluable. The reporting features give us clear visibility into all operations.",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from diocese staff and clergy who use CDIMS for their daily infrastructure management needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-2xl shadow-lg border border-primary-100"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <div className="mb-4 text-primary-200">
                <Quote size={32} />
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;