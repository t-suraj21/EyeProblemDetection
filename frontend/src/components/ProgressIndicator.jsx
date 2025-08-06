import { motion } from 'framer-motion';
import { Brain, CheckCircle } from 'lucide-react';

const ProgressIndicator = ({ progress }) => {
  const getProgressText = () => {
    if (progress < 30) return "Uploading image...";
    if (progress < 60) return "Processing image...";
    if (progress < 90) return "Running AI analysis...";
    if (progress < 100) return "Finalizing results...";
    return "Analysis complete!";
  };

  const getProgressColor = () => {
    if (progress < 30) return "bg-blue-500";
    if (progress < 60) return "bg-yellow-500";
    if (progress < 90) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Brain className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            AI Analysis in Progress
          </h3>
          <p className="text-gray-600">
            {getProgressText()}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Progress
          </span>
          <span className="text-sm font-medium text-gray-700">
            {progress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-3 rounded-full ${getProgressColor()} transition-colors duration-300`}
          />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            progress >= 20 ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {progress >= 20 ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-xs text-gray-600">1</span>
            )}
          </div>
          <span className={`text-sm ${progress >= 20 ? 'text-gray-900' : 'text-gray-500'}`}>
            Image uploaded successfully
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            progress >= 50 ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {progress >= 50 ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-xs text-gray-600">2</span>
            )}
          </div>
          <span className={`text-sm ${progress >= 50 ? 'text-gray-900' : 'text-gray-500'}`}>
            Image preprocessing completed
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            progress >= 80 ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {progress >= 80 ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-xs text-gray-600">3</span>
            )}
          </div>
          <span className={`text-sm ${progress >= 80 ? 'text-gray-900' : 'text-gray-500'}`}>
            AI model analysis running
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
            progress >= 100 ? 'bg-green-500' : 'bg-gray-300'
          }`}>
            {progress >= 100 ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <span className="text-xs text-gray-600">4</span>
            )}
          </div>
          <span className={`text-sm ${progress >= 100 ? 'text-gray-900' : 'text-gray-500'}`}>
            Results ready
          </span>
        </div>
      </div>

      {/* Estimated Time */}
      {progress < 100 && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Estimated time remaining:</span> 
            {progress < 30 && " ~2 minutes"}
            {progress >= 30 && progress < 60 && " ~1 minute"}
            {progress >= 60 && progress < 90 && " ~30 seconds"}
            {progress >= 90 && " Almost done..."}
          </p>
        </div>
      )}

      {/* Completion Message */}
      {progress >= 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              Analysis completed successfully!
            </span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            Redirecting to results page...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ProgressIndicator; 