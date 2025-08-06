import { motion } from 'framer-motion';
import { Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const ResultCard = ({ result }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'mild':
        return 'text-yellow-600 bg-yellow-100';
      case 'moderate':
        return 'text-orange-600 bg-orange-100';
      case 'severe':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Analysis Complete</h2>
              <p className="text-blue-100">Retina image analysis results</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{result.analysis.confidence}%</div>
            <div className="text-blue-100 text-sm">Confidence</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Condition Detection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Detected Condition
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(result.analysis.severity)}`}>
              {result.analysis.severity} Severity
            </span>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold text-red-800 mb-2">
                  {result.analysis.detectedCondition}
                </h4>
                <p className="text-red-700 leading-relaxed">
                  {result.analysis.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Image and Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Image */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Analyzed Image</h4>
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={result.imageUrl}
                alt="Retina analysis"
                className="w-full h-48 object-cover"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Analysis Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">AI Confidence</span>
                  <span className={`font-semibold ${getConfidenceColor(result.analysis.confidence)}`}>
                    {result.analysis.confidence}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Severity Score</span>
                  <span className="font-semibold text-gray-900">
                    {result.analysis.severityScore}/10
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Risk Level</span>
                  <span className="font-semibold text-orange-600">
                    {result.analysis.severity}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Findings */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Key Findings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Symptoms Detected</h5>
              <ul className="space-y-1">
                {result.analysis.symptoms.slice(0, 3).map((symptom, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <h5 className="font-medium text-orange-900 mb-2">Risk Factors</h5>
              <ul className="space-y-1">
                {result.analysis.riskFactors.slice(0, 3).map((factor, index) => (
                  <li key={index} className="text-sm text-orange-800 flex items-center">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Immediate Recommendations</h4>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-green-900 mb-2">What you should do next:</h5>
                <ul className="space-y-1">
                  {result.analysis.recommendations.slice(0, 3).map((rec, index) => (
                    <li key={index} className="text-sm text-green-800">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-600">
              <strong>Disclaimer:</strong> This AI analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified eye specialist for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard; 