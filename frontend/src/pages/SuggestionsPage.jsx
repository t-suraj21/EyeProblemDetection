import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, Heart, Clock, AlertTriangle, ArrowRight, Star } from 'lucide-react';
import MedicineSuggestionCard from '../components/MedicineSuggestionCard';
import CareTipsList from '../components/CareTipsList';

const SuggestionsPage = () => {
  const { problem } = useParams();
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockSuggestions = {
      condition: 'Diabetic Retinopathy',
      medicines: [
        {
          id: 1,
          name: 'Lucentis (Ranibizumab)',
          type: 'Anti-VEGF Injection',
          description: 'Reduces abnormal blood vessel growth in the retina',
          dosage: '0.5mg injection monthly',
          effectiveness: 85,
          sideEffects: ['Eye irritation', 'Increased eye pressure', 'Vision changes'],
          price: '₹15,000 - ₹25,000 per injection',
          prescription: 'Required'
        },
        {
          id: 2,
          name: 'Avastin (Bevacizumab)',
          type: 'Anti-VEGF Injection',
          description: 'Off-label use for diabetic retinopathy treatment',
          dosage: '1.25mg injection every 4-6 weeks',
          effectiveness: 80,
          sideEffects: ['Eye pain', 'Redness', 'Floaters'],
          price: '₹8,000 - ₹12,000 per injection',
          prescription: 'Required'
        },
        {
          id: 3,
          name: 'Eye Drops - Timolol',
          type: 'Beta Blocker',
          description: 'Reduces intraocular pressure',
          dosage: '1 drop twice daily',
          effectiveness: 70,
          sideEffects: ['Burning sensation', 'Dry eyes', 'Blurred vision'],
          price: '₹200 - ₹500 per bottle',
          prescription: 'Required'
        }
      ],
      careTips: [
        {
          category: 'Blood Sugar Management',
          tips: [
            'Monitor blood glucose levels regularly',
            'Maintain HbA1c below 7%',
            'Follow a diabetic diet plan',
            'Take diabetes medications as prescribed'
          ]
        },
        {
          category: 'Eye Care',
          tips: [
            'Get regular eye exams every 6 months',
            'Protect eyes from UV radiation',
            'Avoid smoking and alcohol',
            'Maintain good lighting when reading'
          ]
        },
        {
          category: 'Lifestyle Changes',
          tips: [
            'Exercise regularly (30 minutes daily)',
            'Maintain healthy weight',
            'Control blood pressure',
            'Get adequate sleep (7-8 hours)'
          ]
        }
      ],
      warnings: [
        'Never self-medicate without doctor consultation',
        'Report any vision changes immediately',
        'Keep all follow-up appointments',
        'Inform doctor about all medications'
      ]
    };

    // Simulate API call
    setTimeout(() => {
      setSuggestions(mockSuggestions);
      setLoading(false);
    }, 1000);
  }, [problem]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggestions...</p>
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
            Treatment Suggestions
          </h1>
          <p className="text-lg text-gray-600">
            AI-recommended treatments and care tips for {suggestions.condition}
          </p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  Important Disclaimer
                </h3>
                <p className="text-red-800 leading-relaxed">
                  These suggestions are for informational purposes only. Always consult with a qualified healthcare professional before starting any treatment. 
                  The effectiveness and suitability of treatments may vary based on individual conditions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Medicine Suggestions */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Pill className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Recommended Treatments
                  </h2>
                  <p className="text-gray-600">
                    AI-suggested medications and treatments
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {suggestions.medicines.map((medicine, index) => (
                  <MedicineSuggestionCard
                    key={medicine.id}
                    medicine={medicine}
                    index={index}
                  />
                ))}
              </div>
            </div>

            {/* Care Tips */}
            <CareTipsList careTips={suggestions.careTips} />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/doctors/mumbai"
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="text-blue-800 font-medium">Find Eye Specialists</span>
                  <ArrowRight className="w-5 h-5 text-blue-600" />
                </Link>
                
                <button className="flex items-center justify-between w-full p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-green-800 font-medium">Book Consultation</span>
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </button>
                
                <button className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <span className="text-purple-800 font-medium">Download Guide</span>
                  <ArrowRight className="w-5 h-5 text-purple-600" />
                </button>
              </div>
            </div>

            {/* Warnings */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Important Warnings
              </h3>
              <div className="space-y-3">
                {suggestions.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-700">{warning}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Treatment Success Rates
              </h3>
              <div className="space-y-4">
                {suggestions.medicines.slice(0, 2).map((medicine) => (
                  <div key={medicine.id} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate mr-2">
                      {medicine.name}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${medicine.effectiveness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {medicine.effectiveness}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Treatment?
            </h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Connect with qualified eye specialists in your area for personalized treatment plans and professional care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/doctors/mumbai"
                className="inline-flex items-center px-6 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Find Specialists
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/upload"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors"
              >
                New Scan
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuggestionsPage; 