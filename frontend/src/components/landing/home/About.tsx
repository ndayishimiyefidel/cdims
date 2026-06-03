import { useState, useEffect, type ReactNode } from "react";
import {
  Users,
  Shield,
  Zap,
  Heart,
  TrendingUp,
  Building2,
  Calendar,
  Star,
  Globe,
  Award,
  Clock,
  Church,
  Warehouse
} from "lucide-react";

// Types
interface CountUpState {
  parishes: number;
  years: number;
  materials: number;
  satisfaction: number;
}

interface Stat {
  key: keyof CountUpState;
  number: string;
  label: string;
  icon: ReactNode;
  color: string;
}

interface ValueItem {
  icon: ReactNode;
  title: string;
  description: string;
  highlight: string;
}

interface Achievement {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function AboutSection() {
  const [activeValue, setActiveValue] = useState<number>(0);
  const [countUp, setCountUp] = useState<CountUpState>({
    parishes: 0,
    years: 0,
    materials: 0,
    satisfaction: 0,
  });

  // Counter animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setCountUp({
        parishes: 50,
        years: 10,
        materials: 500,
        satisfaction: 98,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const stats: Stat[] = [
    {
      key: "parishes",
      number: `${countUp.parishes}+`,
      label: "Parishes & Sites",
      icon: <Church className="w-6 h-6" />,
      color: "text-primary-600",
    },
    {
      key: "years",
      number: `${countUp.years}+`,
      label: "Years of Service",
      icon: <Calendar className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      key: "materials",
      number: `${countUp.materials}+`,
      label: "Materials & Items",
      icon: <Warehouse className="w-6 h-6" />,
      color: "text-purple-600",
    },
    {
      key: "satisfaction",
      number: `${countUp.satisfaction}%`,
      label: "User Satisfaction",
      icon: <Star className="w-6 h-6" />,
      color: "text-yellow-600",
    },
  ];

  const values: ValueItem[] = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Reliable & Secure",
      description:
        "Enterprise-grade security ensures all diocese infrastructure data, material records, and financial information remain protected and tamper-proof.",
      highlight: "Data Protection",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Efficient Workflow",
      description:
        "Streamlined request and approval processes connect parishes, site engineers, and diocese administration for faster infrastructure project execution.",
      highlight: "Quick Turnaround",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Community Focused",
      description:
        "Designed specifically for the Catholic Diocese of Cyangugu, understanding the unique needs of church infrastructure and community resource management.",
      highlight: "Diocese-Centric",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Smart Reporting",
      description:
        "Comprehensive analytics and reporting tools provide diocese leadership with real-time insights into infrastructure projects, stock levels, and resource utilization.",
      highlight: "Data-Driven Decisions",
    },
  ];

  const achievements: Achievement[] = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Diocese-Wide Coverage",
      description: "Serving parishes and institutions across the entire Diocese of Cyangugu",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Centralized Platform",
      description: "Unified management of materials, stock, sites, and procurement",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Ongoing technical support and training for all diocese users",
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: "Scalable Solution",
      description: "Built to grow with the expanding needs of the diocese community",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-6">
            <Church className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-primary-600">CDIMS</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The official infrastructure management platform of the Catholic Diocese of Cyangugu, 
            empowering efficient resource management across all parishes and institutions
          </p>
        </div>

        {/* Stats Section with Animation */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-primary-100 mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-all duration-300 group-hover:scale-110">
                  <div className={`${stat.color} transition-colors duration-300`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 tabular-nums">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - Single Column Layout */}
        <div className="w-10/12 mx-auto mb-20">
          
          {/* Company Story Section */}
          <div className="text-center mb-16">
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 text-white mb-12 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-20 -translate-x-20"></div>
              
              <div className="relative z-10">
                <h3 className="text-3xl sm:text-4xl font-bold mb-6">Our Mission</h3>
                <p className="text-xl text-primary-100 leading-relaxed mb-8 max-w-3xl mx-auto">
                  CDIMS was created to provide the Catholic Diocese of Cyangugu with a modern, 
                  efficient system for managing church infrastructure, construction materials, 
                  stock inventory, and procurement — ensuring transparency and accountability 
                  in all diocese operations.
                </p>
                
                {/* Key pillars */}
                <div className="flex justify-center items-center space-x-8 flex-wrap gap-4">
                  <div className="flex items-center text-primary-100">
                    <div className="w-3 h-3 bg-primary-300 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Transparency</span>
                  </div>
                  <div className="flex items-center text-primary-100">
                    <div className="w-3 h-3 bg-primary-300 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Efficiency</span>
                  </div>
                  <div className="flex items-center text-primary-100">
                    <div className="w-3 h-3 bg-primary-300 rounded-full mr-3"></div>
                    <span className="text-sm font-medium">Accountability</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What Sets Us Apart */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Sets CDIMS Apart</h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the difference that comes from purpose-built design</p>
            </div>

            {/* Values in Cards */}
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              {values.map((value, index) => (
                <div 
                  key={index}
                  onClick={() => setActiveValue(index)}
                  className={`group cursor-pointer transition-all duration-500 ${
                    activeValue === index ? 'transform scale-105' : 'hover:scale-102'
                  }`}
                >
                  <div className={`p-8 rounded-2xl h-full transition-all duration-300 ${
                    activeValue === index 
                      ? 'bg-primary-600 text-white shadow-2xl' 
                      : 'bg-white hover:bg-primary-50 text-gray-900 shadow-lg hover:shadow-xl border-2 border-gray-100 hover:border-primary-200'
                  }`}>
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        activeValue === index 
                          ? 'bg-white/20' 
                          : 'bg-primary-100 group-hover:bg-primary-200'
                      }`}>
                        <div className={`transition-all duration-300 ${
                          activeValue === index ? 'text-white' : 'text-primary-600'
                        }`}>
                          {value.icon}
                        </div>
                      </div>
                      
                      <h4 className="text-xl font-bold mb-4">{value.title}</h4>
                      <p className={`leading-relaxed mb-6 ${
                        activeValue === index ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {value.description}
                      </p>
                      
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeValue === index 
                          ? 'bg-white/20 text-white' 
                          : 'bg-primary-100 text-primary-700 group-hover:bg-primary-200'
                      }`}>
                        {value.highlight}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="bg-gray-50 rounded-3xl p-8 sm:p-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Why the Diocese Trusts CDIMS</h3>
              <p className="text-lg text-gray-600">Built specifically for the needs of the Catholic Diocese of Cyangugu</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center group hover:scale-105">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-100 transition-colors duration-300">
                    <div className="text-primary-600">
                      {achievement.icon}
                    </div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{achievement.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}