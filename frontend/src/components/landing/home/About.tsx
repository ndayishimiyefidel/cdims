import { useState, useEffect } from "react";
import {
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Church,
  Warehouse,
  Calendar,
  Star,
  Award,
  Globe,
  Clock,
  Building2
} from "lucide-react";

interface StatItem {
  number: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: string;
  color: string;
}

interface AchievementItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function AboutSection() {
  const [activeValue, setActiveValue] = useState<number>(0);
  const [countUp, setCountUp] = useState({
    parishes: 0,
    years: 0,
    materials: 0,
    satisfaction: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setCountUp({
        parishes: 50,
        years: 10,
        materials: 500,
        satisfaction: 98
      });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatItem[] = [
    {
      number: `${countUp.parishes}+`,
      label: "Parishes & Sites",
      icon: <Church className="w-5 h-5" />,
      color: "from-primary-400 to-primary-600"
    },
    {
      number: `${countUp.years}+`,
      label: "Years of Service",
      icon: <Calendar className="w-5 h-5" />,
      color: "from-green-400 to-green-600"
    },
    {
      number: `${countUp.materials}+`,
      label: "Materials & Items",
      icon: <Warehouse className="w-5 h-5" />,
      color: "from-purple-400 to-purple-600"
    },
    {
      number: `${countUp.satisfaction}%`,
      label: "User Satisfaction",
      icon: <Star className="w-5 h-5" />,
      color: "from-yellow-400 to-orange-500"
    }
  ];

  const values: ValueItem[] = [
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Reliable & Secure",
      description: "Enterprise-grade security ensures all diocese infrastructure data remains protected.",
      highlight: "Data Protection",
      color: "from-primary-400 to-primary-600"
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Efficient Workflow",
      description: "Streamlined request and approval processes connect parishes and administration.",
      highlight: "Quick Turnaround",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Community Focused",
      description: "Designed specifically for the Catholic Diocese of Cyangugu infrastructure needs.",
      highlight: "Diocese-Centric",
      color: "from-red-400 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Smart Reporting",
      description: "Analytics and reporting tools provide leadership with real-time infrastructure insights.",
      highlight: "Data-Driven Decisions",
      color: "from-purple-400 to-purple-600"
    }
  ];

  const achievements: AchievementItem[] = [
    {
      icon: <Award className="w-5 h-5" />,
      title: "Diocese-Wide Coverage",
      description: "Serving parishes across the entire Diocese of Cyangugu"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Centralized Platform",
      description: "Unified management of materials, stock, sites, and procurement"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Dedicated Support",
      description: "Ongoing technical support and training for all diocese users"
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      title: "Scalable Solution",
      description: "Built to grow with the expanding needs of the diocese"
    }
  ];

  return (
    <section
      className="relative overflow-hidden bg-gray-50"
      id="about"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 bg-dot-grid opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 section-padding">
        {/* Section heading */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-2xl mb-6 shadow-sm">
            <Church className="w-7 h-7 text-primary-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="gradient-text-primary">CDIMS</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            The official infrastructure management platform of the Catholic Diocese of Cyangugu
          </p>
        </div>

        {/* Stats grid */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-20 hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
                >
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission section */}
        <div className="text-center mb-20">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-10 md:p-14 text-white relative overflow-hidden shadow-xl">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our Mission
              </h3>
              <p className="text-lg md:text-xl text-primary-100 leading-relaxed max-w-4xl mx-auto">
                CDIMS was created to provide the Catholic Diocese of Cyangugu with a modern,
                efficient system for managing church infrastructure, construction materials,
                stock inventory, and procurement — ensuring transparency and accountability
                in all diocese operations.
              </p>
              <div className="flex justify-center gap-6 md:gap-10 mt-8 flex-wrap">
                {["Transparency", "Efficiency", "Accountability"].map((pillar) => (
                  <div
                    key={pillar}
                    className="flex items-center gap-2 text-primary-100"
                  >
                    <div className="w-2 h-2 bg-white/40 rounded-full" />
                    <span className="text-sm font-medium">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              What Sets CDIMS Apart
            </h3>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Experience the difference that comes from purpose-built design
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, index) => {
              const isActive = activeValue === index;
              return (
                <div
                  key={index}
                  onClick={() => setActiveValue(index)}
                  className={
                    `group cursor-pointer rounded-2xl p-8 transition-all duration-300 ${
                      isActive
                        ? "bg-primary-500 text-white shadow-xl shadow-primary-500/20 scale-[1.02]"
                        : "bg-white hover:bg-primary-50 text-gray-900 shadow-sm border border-gray-100 hover:border-primary-200 hover:shadow-md"
                    }`
                  }
                >
                  <div className="text-center">
                    <div
                      className={
                        `w-14 h-14 mx-auto mb-5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary-50 text-primary-600 group-hover:bg-primary-100"
                        }`
                      }
                    >
                      {value.icon}
                    </div>
                    <h4 className="text-xl font-bold mb-3">{value.title}</h4>
                    <p className="text-sm leading-relaxed opacity-90">
                      {value.description}
                    </p>
                    <div
                      className={
                        `mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                          isActive ? "text-white/70" : "text-primary-500"
                        }`
                      }
                    >
                      {value.highlight}
                      <span className="text-lg leading-none">&rarr;</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {achievements.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 text-center group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">{item.icon}</div>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Footer text */}
        <div className="text-center mt-16">
          <p className="text-gray-400 text-sm">
            CDIMS &mdash; Cyangugu Diocese Information Management System
          </p>
        </div>
      </div>
    </section>
  );
}
