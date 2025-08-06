import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle } from 'lucide-react';

const SeverityScore = ({ severity, score, confidence }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-800',
          border: 'border-yellow-200',
          progress: 'bg-yellow-500'
        };
      case 'moderate':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-200',
          progress: 'bg-orange-500'
        };
      case 'severe':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-200',
          progress: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          progress: 'bg-gray-500'
        };
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return '😐';
      case 'moderate':
        return '😟';
      case 'severe':
        return '😨';
      default:
        return '😐';
    }
  };

  const colors = getSeverityColor(severity);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">{getSeverityIcon(severity)}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Severity Assessment
        </h3>
        <p className="text-sm text-gray-600">
          AI-determined severity level
        </p>
      </div>

      {/* Severity Level */}
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 mb-6`}>
        <div className="flex items-center justify-between mb-2">
          <span className={`font-semibold ${colors.text}`}>
            {severity} Severity
          </span>
          <AlertTriangle className={`w-5 h-5 ${colors.text}`} />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(score / 10) * 100}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className={`h-2 rounded-full ${colors.progress}`}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Score Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {score}/10
        </div>
        <div className="text-sm text-gray-600">
          Severity Score
        </div>
      </div>

      {/* Confidence Level */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-blue-900">
            AI Confidence
          </span>
          <TrendingUp className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1 bg-blue-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.7 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
          <span className="text-sm font-semibold text-blue-900">
            {confidence}%
          </span>
        </div>
      </div>

      {/* Severity Description */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          What this means:
        </h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          {severity === 'Mild' && 'Early signs detected. Monitor closely and consider lifestyle changes.'}
          {severity === 'Moderate' && 'Significant changes observed. Professional consultation recommended.'}
          {severity === 'Severe' && 'Advanced condition detected. Immediate medical attention required.'}
        </p>
      </div>
    </div>
  );
};

export default SeverityScore; 