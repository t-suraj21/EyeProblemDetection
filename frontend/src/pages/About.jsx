import React, { useState } from "react";
import { Eye, Shield, Clock, Users, Brain, CheckCircle, AlertTriangle, Star, Award, Heart } from "lucide-react";

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { number: "500K+", label: "Scans Analyzed", icon: Eye },
    { number: "95%", label: "Accuracy Rate", icon: Brain },
    { number: "24/7", label: "Availability", icon: Clock },
    { number: "50K+", label: "Happy Users", icon: Users }
  ];

  const features = [
    {
      icon: Brain,
      title: "Advanced AI Detection",
      description: "State-of-the-art deep learning models trained on millions of eye images for precise condition identification."
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Get comprehensive analysis in seconds, not days. No waiting for appointments or lab results."
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your images are processed securely and never stored. Complete confidentiality guaranteed."
    },
    {
      icon: Award,
      title: "Medically Validated",
      description: "Our algorithms are validated against clinical standards and continuously refined by medical experts."
    }
  ];

  const process = [
    {
      step: "01",
      title: "Capture",
      description: "Take a clear photo of your eye using our guided camera interface",
      color: "from-blue-500 to-cyan-500"
    },
    {
      step: "02",
      title: "Analyze",
      description: "Our AI examines multiple aspects: iris patterns, pupil response, and potential abnormalities",
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      title: "Report",
      description: "Receive detailed insights with risk assessments and next-step recommendations",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const tabContent = {
    mission: (
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Heart className="w-8 h-8 text-red-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              We believe that everyone deserves access to quality eye healthcare. Our mission is to democratize eye health screening through artificial intelligence, making early detection accessible, affordable, and immediate for people worldwide.
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <p className="text-gray-700 italic">
            "By combining cutting-edge AI with compassionate healthcare, we're building a world where preventable vision loss becomes a thing of the past."
          </p>
        </div>
      </div>
    ),
    technology: (
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Brain className="w-8 h-8 text-purple-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Technology</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              Our platform leverages state-of-the-art computer vision and deep learning technologies, trained on diverse datasets from leading medical institutions worldwide.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3">Neural Networks</h4>
            <p className="text-gray-600">Convolutional neural networks specifically designed for medical image analysis</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h4 className="font-bold text-gray-900 mb-3">Image Processing</h4>
            <p className="text-gray-600">Advanced preprocessing techniques for optimal image quality and analysis</p>
          </div>
        </div>
      </div>
    ),
    team: (
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <Users className="w-8 h-8 text-green-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Team</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              EyeCare AI is built by a diverse team of ophthalmologists, AI researchers, and healthcare technology experts united by a common goal: making eye care accessible to all.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Medical Advisors', 'AI Researchers', 'Healthcare Engineers'].map((role, index) => (
            <div key={index} className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{role}</h4>
              <p className="text-gray-600 text-sm">Leading experts in their field</p>
            </div>
          ))}
        </div>
      </div>
    )
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              EyeCare AI
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing eye health through artificial intelligence and making professional-grade screening accessible to everyone
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50 to-transparent"></div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <stat.icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Tab Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learn More</h2>
              <nav className="space-y-2">
                {[
                  { id: 'mission', label: 'Our Mission', icon: Heart },
                  { id: 'technology', label: 'Technology', icon: Brain },
                  { id: 'team', label: 'Our Team', icon: Users }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              {tabContent[activeTab]}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process makes eye health screening simple, fast, and reliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${item.color} text-white text-xl font-bold mb-6`}>
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-gradient-to-r from-white to-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose EyeCare AI?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of eye health screening with our advanced features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-16 border-y border-amber-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-amber-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold text-amber-800 mb-4">Important Medical Disclaimer</h3>
                <div className="prose prose-amber max-w-none">
                  <p className="text-amber-800 leading-relaxed">
                    <strong>EyeCare AI provides AI-generated analysis for educational and screening purposes only.</strong> This service is not a substitute for professional medical diagnosis, treatment, or advice. Our technology is designed to assist in early detection and health awareness, but should never replace consultation with qualified healthcare providers.
                  </p>
                  <div className="mt-6 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-amber-700 font-medium">Always consult with an ophthalmologist for comprehensive eye care</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}