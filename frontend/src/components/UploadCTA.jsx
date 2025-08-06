import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, Shield, Clock } from 'lucide-react';

const UploadCTA = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Check Your Eye Health?
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get instant AI analysis of your retina image. It's free, fast, and secure.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Free Scan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200">
              Learn More
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Eye className="w-6 h-6" />
              <span className="text-sm font-medium">95% Accuracy</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Clock className="w-6 h-6" />
              <span className="text-sm font-medium">Instant Results</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-blue-100">
              <Shield className="w-6 h-6" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default UploadCTA; 