import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Zap,
  Heart,
  CheckCircle,
  Star,
  TrendingUp,
  Building,
  Calendar,
  Church,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Rocket,
  Lightbulb,
  HandHeart
} from "lucide-react";
import HeaderBanner from "../../components/landing/HeaderBanner";

export default function AboutPage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const stats = [
    { number: "50+", label: "Parishes Managed", icon: <Church className="w-8 h-8" /> },
    { number: "10+", label: "Years of Service", icon: <Calendar className="w-8 h-8" /> },
    { number: "500+", label: "Materials Catalogued", icon: <Warehouse className="w-8 h-8" /> },
    { number: "98%", label: "User Satisfaction", icon: <Star className="w-8 h-8" /> }
  ];

  const values = [
    {
      icon: <Shield className="w-12 h-12" />,
      title: "Transparency & Accountability",
      description: "Every transaction and stock movement is tracked and auditable, ensuring complete transparency.",
      color: "from-green-400 to-green-600"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Operational Efficiency",
      description: "Streamlined workflows reduce manual effort and accelerate decision-making across diocese departments.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Community Service",
      description: "Enabling effective stewardship of resources for community development across the diocese.",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Continuous Improvement",
      description: "Constantly refining the system based on user feedback to deliver exceptional value.",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "CDIMS Founded",
      description: "The Diocese of Cyangugu initiated the development of a comprehensive information management system.",
      icon: <Rocket className="w-6 h-6" />
    },
    {
      year: "2024",
      title: "Core Modules Launched",
      description: "Material management, stock control, and site management deployed across parishes.",
      icon: <Warehouse className="w-6 h-6" />
    },
    {
      year: "2025",
      title: "Full Deployment",
      description: "Complete system operational across all diocese locations with procurement and reporting.",
      icon: <Building className="w-6 h-6" />
    },
    {
      year: "2025+",
      title: "Continuous Enhancement",
      description: "Advanced features including analytics, integrations, and mobile access in development.",
      icon: <Lightbulb className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      quote: "CDIMS has brought unprecedented transparency to our material procurement and inventory management.",
      author: "Rt. Rev. Bishop",
      position: "Bishop of Cyangugu",
      company: "Catholic Diocese of Cyangugu"
    },
    {
      quote: "The system has streamlined our stock management. We can now track every material from requisition to delivery.",
      author: "Fr. Damascene",
      position: "Diocese Economic Administrator",
      company: "Diocese of Cyangugu"
    },
    {
      quote: "Real-time visibility into stock levels has transformed our project management capabilities.",
      author: "Jean Bosco",
      position: "Diocese Project Coordinator",
      company: "Diocese of Cyangugu"
    }
  ];

  const nextTestimonial = () => setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <HeaderBanner title="About CDIMS" subtitle="Home / About us" backgroundStyle="image" icon={<Church className="w-10 h-10" />} />
      
      <section className="py-20 bg-white relative overflow-hidden">
        <motion.div animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-64 h-64 bg-primary-100/30 rounded-full blur-2xl" />
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants}
            className="grid lg:grid-cols-1 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Transforming Diocese Management</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                CDIMS — the Cyangugu Diocese Information Management System — provides the Catholic Diocese of Cyangugu with a powerful digital platform for managing infrastructure projects, construction materials, stock inventory, and procurement across all parishes and institutions.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Built with the specific needs of the diocese in mind, CDIMS ensures transparency, accountability, and efficiency in all operations.
              </p>
              <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div key={index} variants={itemVariants}
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                    className="text-center bg-primary-50 rounded-lg p-4 cursor-pointer transition-all duration-300">
                    <motion.div animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      className="text-primary-600 mb-2 flex justify-center">{stat.icon}</motion.div>
                    <div className="text-2xl font-bold text-primary-700 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <motion.div whileHover={{ scale: 1.02 }}
                className="relative bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center mb-6">
                  <Church className="w-12 h-12 mr-4" />
                  <div>
                    <h3 className="text-2xl font-bold">Serving the Diocese</h3>
                    <p className="text-primary-100">Catholic Diocese of Cyangugu, Rwanda</p>
                  </div>
                </div>
                <p className="text-primary-100 leading-relaxed">CDIMS serves all parishes, institutions, and administrative departments of the Catholic Diocese of Cyangugu.</p>
                <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full" />
                <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 4, repeat: Infinity }}
                  className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full" />
              </motion.div>
              <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.h3 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Core Values</motion.h3>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -10, scale: 1.05 }} className="text-center group">
                <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
                  className={`bg-gradient-to-br ${value.color} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <div className="text-white">{value.icon}</div>
                </motion.div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.h3 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Our Journey</motion.h3>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">Key milestones in the development of CDIMS</motion.p>
          </motion.div>
          <div className="relative">
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
              className="hidden lg:block absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200 origin-top" />
            <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }}
              className="lg:hidden absolute left-8 top-0 h-full w-0.5 bg-primary-200 origin-top" />
            <div className="space-y-8 lg:space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className={`relative flex items-center ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}>
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }} whileHover={{ scale: 1.5 }}
                    className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10" />
                  <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.4 }}
                    className="lg:hidden absolute left-6 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10" />
                  <div className={`w-full lg:w-5/12 pl-16 lg:pl-0 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                    <motion.div whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                      className="bg-primary-50 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-primary-100 cursor-pointer">
                      <div className="flex items-center justify-center lg:justify-start mb-3">
                        <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, delay: index }}
                          className="text-primary-600 mr-2">{milestone.icon}</motion.div>
                        <div className="text-xl sm:text-2xl font-bold text-primary-700">{milestone.year}</div>
                      </div>
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{milestone.title}</h4>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{milestone.description}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={containerVariants} className="text-center mb-16">
            <motion.h3 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Users Say</motion.h3>
            <motion.p variants={itemVariants} className="text-lg sm:text-xl text-gray-600">Feedback from diocese leadership and staff</motion.p>
          </motion.div>
          <motion.div key={activeTestimonial} initial={{ opacity: 0, rotateY: 90 }}
            animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: -90 }} transition={{ duration: 0.5 }}
            className="relative bg-white rounded-2xl p-8 shadow-xl">
            <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-4 left-4 text-primary-200"><HandHeart className="w-8 h-8" /></motion.div>
            <div className="text-center">
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl text-gray-600 mb-6 italic leading-relaxed">&quot;{testimonials[activeTestimonial].quote}&quot;</motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white font-bold text-lg">{testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{testimonials[activeTestimonial].author}</h4>
                <p className="text-primary-600 font-medium">{testimonials[activeTestimonial].position}</p>
                <p className="text-gray-500 text-sm">{testimonials[activeTestimonial].company}</p>
              </motion.div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevTestimonial}
                className="p-3 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors duration-300 shadow-lg">
                <ChevronLeft className="w-6 h-6 text-primary-600" /></motion.button>
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <motion.button key={index} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === activeTestimonial ? 'bg-primary-600' : 'bg-primary-200'}`} />
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextTestimonial}
                className="p-3 rounded-full bg-primary-100 hover:bg-primary-200 transition-colors duration-300 shadow-lg">
                <ChevronRight className="w-6 h-6 text-primary-600" /></motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
