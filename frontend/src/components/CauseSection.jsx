import { motion } from 'framer-motion';
import { Search, AlertCircle, Info } from 'lucide-react';

const CauseSection = ({ causes }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Causes & Contributing Factors
          </h2>
          <p className="text-gray-600">
            Understanding what leads to this condition
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Primary Cause */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            Primary Cause
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <h4 className="text-lg font-semibold text-red-900">
                {causes.primary}
              </h4>
            </div>
            <p className="text-red-800 leading-relaxed">
              {causes.details}
            </p>
          </div>
        </div>

        {/* Secondary Factors */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            Contributing Factors
          </h3>
          <div className="space-y-3">
            {causes.secondary.map((factor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-blue-50 border border-blue-200 rounded-lg p-4"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{index + 2}</span>
                  </div>
                  <h4 className="font-semibold text-blue-900">
                    {factor}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Explanation */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          How These Factors Work Together
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Primary Mechanism</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              The primary cause creates the initial damage to the retinal blood vessels. 
              This damage can be progressive and may not show symptoms in the early stages.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Risk Amplification</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Secondary factors can accelerate the progression and increase the severity 
              of the condition, making early detection and management crucial.
            </p>
          </div>
        </div>
      </div>

      {/* Prevention Tips */}
      <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 mb-4">
          Prevention & Risk Reduction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Lifestyle Changes</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Maintain healthy diet</li>
              <li>• Regular exercise</li>
              <li>• Avoid smoking</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Medical Management</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Control blood sugar</li>
              <li>• Monitor blood pressure</li>
              <li>• Regular check-ups</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Early Detection</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Annual eye exams</li>
              <li>• Watch for symptoms</li>
              <li>• Prompt treatment</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Research & Statistics */}
      <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          Research Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Prevalence</h4>
            <p className="text-purple-800 text-sm">
              This condition affects approximately 30% of diabetic patients worldwide, 
              making it one of the most common complications of diabetes.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-purple-900 mb-2">Early Detection Impact</h4>
            <p className="text-purple-800 text-sm">
              Early detection and treatment can reduce the risk of severe vision loss 
              by up to 90%, highlighting the importance of regular screening.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CauseSection; 