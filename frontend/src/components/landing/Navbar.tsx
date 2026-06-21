import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone,
  Mail,
  LogIn,
  Church,
  ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type NavLink = {
  name: string;
  path: string;
  sectionId?: string; // section to scroll to when on the Home page
};

const NAV_HEIGHT = 80; // approximate navbar height for scroll offset

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const links: NavLink[] = [
    { name: 'Home', path: '/', sectionId: 'hero' },
    { name: 'About', path: '/about', sectionId: 'about' },
    { name: 'Services', path: '/solutions', sectionId: 'services' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHomePage = location.pathname === '/';

  const smoothScrollTo = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const handleNavigate = (path: string, sectionId?: string) => {
    setIsOpen(false);

    if (isHomePage && sectionId) {
      // Already on the home page — smooth scroll to the section
      smoothScrollTo(sectionId);
    } else if (sectionId) {
      // On another page — navigate to home page; Home.tsx will auto-scroll via route state
      navigate('/', { state: { scrollTo: sectionId } });
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top bar */}
      <div className="bg-gray-900 text-white/90 text-xs sm:text-sm py-2 px-4 hidden lg:block">
        <div className="container-custom flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:+250788301000" className="flex items-center gap-2 hover:text-white transition-colors">
              <Phone size={13} className="text-primary-400" />
              <span>+250 788 301 000</span>
            </a>
            <a href="mailto:info@cyangugudims.rw" className="flex items-center gap-2 hover:text-white transition-colors">
              <Mail size={13} className="text-primary-400" />
              <span>info@cyangugudims.rw</span>
            </a>
          </div>
          <div className="text-white/60 text-xs">
            Catholic Diocese of Cyangugu — Infrastructure Management System
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100/50' 
            : 'bg-white shadow-sm border-b border-transparent'
        }`}
      >
        <div className="container-custom">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => handleNavigate('/', 'hero')}
              className="flex-shrink-0 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow duration-300">
                  <Church className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <span className="text-lg md:text-xl font-bold gradient-text-primary leading-tight">
                    CDIMS
                  </span>
                  <p className="text-[10px] md:text-[11px] text-gray-400 -mt-0.5 leading-tight hidden sm:block">
                    Diocese Information Management System
                  </p>
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path, item.sectionId)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0"
                onClick={() => handleNavigate('/auth/admin/login')}
              >
                <LogIn size={16} />
                Sign In
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-gray-100 bg-white/95 backdrop-blur-xl">
            <div className="container-custom py-4 space-y-1">
              {links.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path, item.sectionId)}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              
              <div className="pt-3 mt-3 border-t border-gray-100">
                <button
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 rounded-xl text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                  onClick={() => handleNavigate('/auth/admin/login')}
                >
                  <LogIn size={16} />
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
