import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Zap,
  Heart,
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
  Quote,
  Target,
  Eye,
  ArrowRight
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
    {
      number: "50+",
      label: "Parishes Managed",
      icon: <Church className="w-6 h-6" />,
      color: "from-primary-400 to-primary-600"
    },
    {
      number: "10+",
      label: "Years of Service",
      icon: <Calendar className="w-6 h-6" />,
      color: "from-green-400 to-green-600"
    },
    {
      number: "500+",
      label: "Materials Catalogued",
      icon: <Warehouse className="w-6 h-6" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      number: "98%",
      label: "User Satisfaction",
      icon: <Star className="w-6 h-6" />,
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Transparency & Accountability",
      description: "Every transaction and stock movement is tracked and auditable, ensuring complete transparency.",
      color: "from-primary-400 to-primary-600"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Operational Efficiency",
      description: "Streamlined workflows reduce manual effort and accelerate decision-making across diocese departments.",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Service",
      description: "Enabling effective stewardship of resources for community development across the diocese.",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
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
      icon: <Rocket className="w-5 h-5" />
    },
    {
      year: "2024",
      title: "Core Modules Launched",
      description: "Material management, stock control, and site management deployed across parishes.",
      icon: <Warehouse className="w-5 h-5" />
    },
    {
      year: "2025",
      title: "Full Deployment",
      description: "Complete system operational across all diocese locations with procurement and reporting.",
      icon: <Building className="w-5 h-5" />
    },
    {
      year: "2025+",
      title: "Continuous Enhancement",
      description: "Advanced features including analytics, integrations, and mobile access in development.",
      icon: <Lightbulb className="w-5 h-5" />
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

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <HeaderBanner
        title="About CDIMS"
        subtitle="Home / About us"
        backgroundStyle="image"
        icon={<Church className="w-10 h-10" />}
      />

      {/* Story Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/20 rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary-200/50">
                <Sparkles size={14} />
                <span>Our Story</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Transforming Diocese Management
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                CDIMS provides the Catholic Diocese of Cyangugu with a powerful digital platform
                for managing infrastructure projects, construction materials, stock inventory, and
                procurement across all parishes and institutions.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Built with the specific needs of the diocese in mind, CDIMS ensures transparency,
                accountability, and efficiency in all operations.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}
                    >
                      <div className="text-white">{stat.icon}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-8 md:p-10 text-white shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
                    <Church className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Serving the Diocese</h3>
                    <p className="text-primary-200 text-sm">
                      Catholic Diocese of Cyangugu, Rwanda
                    </p>
                  </div>
                </div>
                <p className="text-primary-100 leading-relaxed">
                  CDIMS serves all parishes, institutions, and administrative departments of the
                  Catholic Diocese of Cyangugu.
                </p>
                <div className="mt-6 flex gap-3">
                  <span className="px-3 py-1 bg-white/15 rounded-full text-xs">
                    50+ Parishes
                  </span>
                  <span className="px-3 py-1 bg-white/15 rounded-full text-xs">
                    500+ Users
                  </span>
                  <span className="px-3 py-1 bg-white/15 rounded-full text-xs">
                    24/7 Support
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To equip the Catholic Diocese of Cyangugu with a modern, efficient digital
                  platform for managing church infrastructure, construction materials, stock
                  inventory, and procurement, enhancing transparency and accountability in all
                  operations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  To be the leading diocese information management system, setting standards for
                  infrastructure management, operational transparency, and community resource
                  stewardship across Rwanda.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core <span className="gradient-text-primary">Values</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <div className="text-white">{value.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="gradient-text-primary">Journey</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Key milestones in the development of CDIMS
            </p>
          </div>
          <div className="relative">
            {/* Timeline line - hidden on mobile, visible on md+ */}
            <div className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-primary-300 max-md:hidden" />
            <div className="space-y-8 md:space-y-12">
              {milestones.map((milestone, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className={`flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div
                      className={`flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${
                        isEven ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <span className="text-sm font-bold text-primary-600">
                        {milestone.year}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900 mt-1">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    {/* Timeline dot - hidden on mobile, visible on md+ */}
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0 shadow-md max-md:hidden md:flex">
                      <div className="text-white">{milestone.icon}</div>
                    </div>
                    {/* Spacer - hidden on mobile, visible on md+ */}
                    <div className="flex-1 max-md:hidden" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What <span className="gradient-text-primary">Leaders Say</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Testimonials from diocese leadership and staff
            </p>
          </div>
          <div className="max-w-3xl mx-auto relative">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100">
              <Quote className="text-primary-200 w-10 h-10 mb-4" />
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed italic mb-8">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">
                    {testimonials[activeTestimonial].author}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[activeTestimonial].position}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow border border-gray-200"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveTestimonial(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeTestimonial === i
                        ? "bg-primary-500 w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Diocese Management?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join the Catholic Diocese of Cyangugu in modernizing infrastructure and materials
              management.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/auth/admin/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg shadow-black/10"
              >
                Get Started <ArrowRight size={18} />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                Contact Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
