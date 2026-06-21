import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

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

const Testimonials = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden" id="testimonials">
      <div className="absolute inset-0 bg-dot-grid opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-primary-100/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our <span className="gradient-text-primary">Users Say</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto">
            Hear from diocese staff and clergy who use CDIMS for their daily infrastructure management needs
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 h-full flex flex-col">
                {/* Quote icon */}
                <div className="text-primary-100 mb-4">
                  <Quote size={36} />
                </div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-6 leading-relaxed flex-1">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
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
