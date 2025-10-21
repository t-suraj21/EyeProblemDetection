import React from "react";
import { Eye, Shield, Users, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-cyan-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-28 h-28 border border-purple-400 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    EyeCare AI
                  </h3>
                  <p className="text-sm text-gray-300">Advanced Vision Care</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                Revolutionizing eye care with cutting-edge AI technology. Early detection, accurate diagnosis, and personalized treatment plans for optimal vision health.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>50K+ Users</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {[
                  "Diabetic Retinopathy Detection",
                  "Glaucoma Screening",
                  "Macular Degeneration Analysis",
                  "Cataract Assessment",
                  "Vision Risk Assessment",
                  "AI-Powered Diagnosis"
                ].map((service, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {[
                  "Documentation",
                  "API Reference",
                  "Research Papers",
                  "Case Studies",
                  "Training Materials",
                  "Support Center"
                ].map((resource, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm flex items-center group">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors duration-300"></span>
                      {resource}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <a href="mailto:support@eyecareai.com" className="text-sm">support@eyecareai.com</a>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors duration-300">
                  <Phone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <a href="tel:+1-800-EYECARE" className="text-sm">+1 (800) EYE-CARE</a>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">123 Medical Plaza, Healthcare District, CA 90210</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold mb-4 text-white">Follow Us</h5>
                <div className="flex space-x-4">
                  {[
                    { icon: Facebook, label: "Facebook" },
                    { icon: Twitter, label: "Twitter" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Linkedin, label: "LinkedIn" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 transform hover:scale-110 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700/50">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-center lg:text-left">
                <p className="text-gray-300 text-sm">
                  © {new Date().getFullYear()} EyeCare AI. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Empowering healthcare professionals with AI-driven eye care solutions.
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center lg:justify-end items-center space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">GDPR</a>
                <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Accessibility</a>
              </div>

              {/* Back to Top */}
              <button
                onClick={scrollToTop}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                aria-label="Back to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-700/30">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-wrap justify-center items-center space-x-8 text-xs text-gray-400">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>FDA Approved</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>ISO 27001 Certified</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>SOC 2 Type II</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                <span>99.9% Uptime</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}