import { motion } from 'framer-motion';
import { Pill, Star, AlertTriangle, Info } from 'lucide-react';

const MedicineSuggestionCard = ({ medicine, index }) => {
  const getEffectivenessColor = (effectiveness) => {
    if (effectiveness >= 80) return 'text-green-600';
    if (effectiveness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {medicine.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm">
                {medicine.type}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className={`text-sm font-semibold ${getEffectivenessColor(medicine.effectiveness)}`}>
                {medicine.effectiveness}% Effective
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {medicine.prescription}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-700 leading-relaxed">
            {medicine.description}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Dosage</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              {medicine.dosage}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Price Range</h4>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              {medicine.price}
            </p>
          </div>
        </div>

        {/* Side Effects */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
            Common Side Effects
          </h4>
          <div className="bg-orange-50 rounded-lg p-3">
            <ul className="space-y-1">
              {medicine.sideEffects.map((effect, idx) => (
                <li key={idx} className="text-sm text-orange-800 flex items-center">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                  {effect}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Effectiveness Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Effectiveness</span>
            <span className={`text-sm font-semibold ${getEffectivenessColor(medicine.effectiveness)}`}>
              {medicine.effectiveness}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${medicine.effectiveness}%` }}
              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
              className={`h-2 rounded-full ${
                medicine.effectiveness >= 80 ? 'bg-green-500' :
                medicine.effectiveness >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> This information is for educational purposes only. 
              Always consult with a healthcare professional before starting any medication.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MedicineSuggestionCard; 