import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, Menu, X, Scan, Home, Users, Phone, ChevronDown, Shield, Zap } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Scan Eye', path: '/scan', icon: Scan, highlight: true },
    { name: 'About', path: '/about', icon: Users },
    { name: 'Contact', path: '/contact', icon: Phone }
  ];

  const services = [
    { name: 'Diabetic Retinopathy', path: '/services/diabetic' },
    { name: 'Glaucoma Detection', path: '/services/glaucoma' },
    { name: 'Macular Degeneration', path: '/services/macular' },
    { name: 'Cataract Assessment', path: '/services/cataract' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMenu}>
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isScrolled 
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg group-hover:shadow-xl' 
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg group-hover:shadow-cyan-400/50'
            } transform group-hover:scale-110`}>
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                isScrolled 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent' 
                  : 'text-white'
              }`}>
                EyeCare AI
              </h1>
              <p className={`text-xs transition-colors duration-300 ${
                isScrolled ? 'text-gray-600' : 'text-gray-300'
              }`}>
                Advanced Vision Care
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    item.highlight
                      ? isScrolled
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg hover:shadow-cyan-400/50 hover:from-cyan-500 hover:to-blue-600'
                      : isScrolled
                        ? 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                        : 'text-gray-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                  {item.highlight && (
                    <div className="flex items-center">
                      <Zap className="w-3 h-3 ml-1" />
                    </div>
                  )}
                </Link>
              );
            })}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isScrolled
                    ? 'text-gray-700 hover:text-cyan-600 hover:bg-gray-100'
                    : 'text-gray-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <div
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
                className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/50 backdrop-blur-lg transform transition-all duration-300 ${
                  isServicesOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                }`}
              >
                <div className="p-2">
                  {services.map((service, index) => (
                    <Link
                      key={service.name}
                      to={service.path}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700 transition-all duration-200 group"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full group-hover:scale-125 transition-transform duration-200"></div>
                      <span className="font-medium">{service.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 p-2">
                  <Link
                    to="/services"
                    className="flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-cyan-600 hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-600 hover:text-white rounded-lg transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span>View All Services</span>
                    <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              to="/get-started"
              className={`ml-4 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700'
                  : 'bg-white text-blue-900 hover:bg-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className={`lg:hidden p-2 rounded-lg transition-all duration-300 ${
              isScrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className={`py-4 space-y-2 ${
            isScrolled ? 'border-t border-gray-200' : 'border-t border-white/20'
          }`}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    item.highlight
                      ? isScrolled
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-gray-100'
                        : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                  {item.highlight && <Zap className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}

            {/* Mobile Services */}
            <div className={`px-4 py-2 ${isScrolled ? 'text-gray-600' : 'text-gray-300'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Services</span>
              </div>
              <div className="ml-6 space-y-2">
                {services.map((service) => (
                  <Link
                    key={service.name}
                    to={service.path}
                    onClick={closeMenu}
                    className={`block py-2 text-sm transition-colors duration-300 ${
                      isScrolled ? 'text-gray-600 hover:text-cyan-600' : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile CTA */}
            <div className="px-4 pt-4">
              <Link
                to="/get-started"
                onClick={closeMenu}
                className={`block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-900 shadow-lg'
                }`}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}