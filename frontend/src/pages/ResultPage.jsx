import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, AlertTriangle, CheckCircle, ArrowRight, Download, Share2 } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import ProblemDetails from '../components/ProblemDetails';
import SeverityScore from '../components/SeverityScore';
import CauseSection from '../components/CauseSection';

const ResultPage = () => {
  const { scanId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockResult = {
      id: scanId,
      timestamp: new Date().toISOString(),
      imageUrl: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Retina+Image',
      analysis: {
        detectedCondition: 'Diabetic Retinopathy',
        confidence: 89,
        severity: 'Moderate',
        severityScore: 7.2,
        description: 'Early signs of diabetic retinopathy detected. Blood vessels in the retina show signs of damage.',
        symptoms: [
          'Blurred vision',
          'Dark spots or strings in vision',
          'Difficulty seeing at night',
          'Vision changes'
        ],
        riskFactors: [
          'Diabetes duration',
          'Poor blood sugar control',
          'High blood pressure',
          'High cholesterol'
        ],
        recommendations: [
          'Schedule appointment with ophthalmologist',
          'Monitor blood sugar levels',
          'Control blood pressure',
          'Regular eye exams'
        ]
      },
      causes: {
        primary: 'Diabetes',
        secondary: ['Age', 'Genetics', 'Lifestyle'],
        details: 'Diabetic retinopathy occurs when high blood sugar levels damage the blood vessels in the retina. Over time, this can lead to vision problems and blindness if left untreated.'
      }
    };

    // Simulate API call
    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 1000);
  }, [scanId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Results Not Found</h2>
          <p className="text-gray-600 mb-4">The scan results you're looking for could not be found.</p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start New Scan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Analysis Results
          </h1>
          <p className="text-lg text-gray-600">
            AI-powered analysis of your retina image
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <ResultCard result={result} />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Severity Score */}
            <SeverityScore 
              severity={result.analysis.severity}
              score={result.analysis.severityScore}
              confidence={result.analysis.confidence}
            />

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to={`/suggestions/${result.analysis.detectedCondition.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-800 font-medium">Get Treatment Suggestions</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                
                <Link
                  to="/doctors/mumbai"
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="text-green-800 font-medium">Find Eye Specialists</span>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </Link>
                
                <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-800 font-medium">Download Report</span>
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                
                <button className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="text-gray-800 font-medium">Share Results</span>
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scan Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Scan Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Scan ID:</span>
                  <span className="font-medium text-gray-900">{result.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(result.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AI Confidence:</span>
                  <span className="font-medium text-gray-900">{result.analysis.confidence}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-12 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ProblemDetails analysis={result.analysis} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <CauseSection causes={result.causes} />
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need Professional Consultation?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              While our AI provides accurate analysis, it's important to consult with a qualified eye specialist for proper diagnosis and treatment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/doctors/mumbai"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Find Eye Specialists
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Upload Another Image
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResultPage; 