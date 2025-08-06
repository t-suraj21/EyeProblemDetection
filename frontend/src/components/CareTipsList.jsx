import { motion } from 'framer-motion';
import { Heart, Eye, Clock, CheckCircle } from 'lucide-react';

const CareTipsList = ({ careTips }) => {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'blood sugar management':
        return Heart;
      case 'eye care':
        return Eye;
      case 'lifestyle changes':
        return Clock;
      default:
        return CheckCircle;
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case 'blood sugar management':
        return {
          bg: 'bg-red-100',
          text: 'text-red-600',
          border: 'border-red-200'
        };
      case 'eye care':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
      case 'lifestyle changes':
        return {
          bg: 'bg-green-100',
          text: 'text-green-600',
          border: 'border-green-200'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200'
        };
    }
  };

  return (
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Care & Lifestyle Tips
          </h2>
          <p className="text-gray-600">
            Essential tips for managing your condition
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careTips.map((category, index) => {
          const Icon = getCategoryIcon(category.category);
          const colors = getCategoryColor(category.category);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className={`${colors.bg} p-4 border-b ${colors.border}`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900">
                    {category.category}
                  </h3>
                </div>
              </div>

              {/* Tips */}
              <div className="p-4">
                <ul className="space-y-3">
                  {category.tips.map((tip, tipIndex) => (
                    <motion.li
                      key={tipIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + tipIndex * 0.05 }}
                      className="flex items-start space-x-3"
                    >
                      <div className={`w-2 h-2 ${colors.text} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {tip}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Priority Indicator */}
              <div className={`${colors.bg} px-4 py-2 border-t ${colors.border}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    Priority Level
                  </span>
                  <span className={`text-xs font-semibold ${colors.text}`}>
                    {index === 0 ? 'High' : index === 1 ? 'Medium' : 'Low'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200"
      >
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          Additional Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Monitoring</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Keep a symptom diary</li>
              <li>• Track blood sugar levels</li>
              <li>• Monitor vision changes</li>
              <li>• Regular blood pressure checks</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Emergency Signs</h4>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Sudden vision loss</li>
              <li>• Severe eye pain</li>
              <li>• New floaters or flashes</li>
              <li>• Redness or swelling</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Success Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          Tips for Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-green-900 mb-1">Be Consistent</h4>
            <p className="text-sm text-green-800">
              Follow your care plan daily without skipping
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-green-900 mb-1">Stay Informed</h4>
            <p className="text-sm text-green-800">
              Learn about your condition and treatment options
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-green-900 mb-1">Get Support</h4>
            <p className="text-sm text-green-800">
              Connect with healthcare providers and support groups
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CareTipsList; 