import { motion } from 'framer-motion';
import { AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';

const ProblemDetails = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Detailed Analysis: {analysis.detectedCondition}
          </h2>
          <p className="text-gray-600">
            Comprehensive breakdown of the detected condition
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Symptoms */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              Common Symptoms
            </h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.symptoms.map((symptom, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center text-blue-900"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    {symptom}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Risk Factors */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
              Risk Factors
            </h3>
            <div className="bg-orange-50 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.riskFactors.map((factor, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-center text-orange-900"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    {factor}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              Recommended Actions
            </h3>
            <div className="bg-green-50 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.6 }}
                    className="flex items-center text-green-900"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                    {rec}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Clock className="w-5 h-5 text-purple-600 mr-2" />
              Recommended Timeline
            </h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-purple-900 font-medium">Immediate (Within 24 hours)</span>
                  <span className="text-purple-700 text-sm">High Priority</span>
                </div>
                <div className="text-sm text-purple-800">
                  • Schedule appointment with ophthalmologist
                </div>
                
                <div className="border-t border-purple-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-900 font-medium">Short-term (1-2 weeks)</span>
                    <span className="text-purple-700 text-sm">Medium Priority</span>
                  </div>
                  <div className="text-sm text-purple-800 mt-1">
                    • Monitor blood sugar levels
                    <br />
                    • Control blood pressure
                  </div>
                </div>
                
                <div className="border-t border-purple-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-900 font-medium">Long-term (Ongoing)</span>
                    <span className="text-purple-700 text-sm">Regular</span>
                  </div>
                  <div className="text-sm text-purple-800 mt-1">
                    • Regular eye exams every 6 months
                    <br />
                    • Maintain healthy lifestyle
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          About {analysis.detectedCondition}
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          {analysis.description}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-1">Prevalence</div>
            <div className="text-gray-600">Common in diabetic patients</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-1">Progression</div>
            <div className="text-gray-600">Gradual if untreated</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-medium text-gray-900 mb-1">Treatment</div>
            <div className="text-gray-600">Medical intervention required</div>
          </div>
        </div>
      </div>

      {/* Warning */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-red-900 mb-1">
              Important Notice
            </h4>
            <p className="text-sm text-red-800">
              This AI analysis is for screening purposes only. Early detection and professional medical consultation are crucial for effective treatment. Do not delay seeking professional medical advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails; 