import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Activity, 
  User, 
  Pill, 
  Calendar,
  Download,
  Share2,
  ArrowLeft,
  Zap,
  Clock,
  Shield,
  Info,
  TrendingUp,
  FileText
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get scan data from navigation state
  const scanData = location.state?.scanData;
  
  const [showDetails, setShowDetails] = useState(false);
  const [animateResults, setAnimateResults] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setAnimateResults(true), 300);
  }, []);

  const getRiskLevel = (confidence) => {
    if (confidence >= 80) return { level: "High", color: "red", bgColor: "bg-red-50", textColor: "text-red-800", borderColor: "border-red-200" };
    if (confidence >= 60) return { level: "Medium", color: "yellow", bgColor: "bg-yellow-50", textColor: "text-yellow-800", borderColor: "border-yellow-200" };
    return { level: "Low", color: "green", bgColor: "bg-green-50", textColor: "text-green-800", borderColor: "border-green-200" };
  };

  const getConditionIcon = (condition) => {
    const conditionLower = condition?.toLowerCase() || "";
    if (conditionLower.includes("cataract")) return "☁️";
    if (conditionLower.includes("glaucoma")) return "🔵";
    if (conditionLower.includes("retina")) return "🔴";
    if (conditionLower.includes("normal") || conditionLower.includes("healthy")) return "✅";
    return "👁️";
  };

  const formatTimestamp = () => {
    return new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadReport = async () => {
    const report = document.getElementById('report-root');
    if (!report) return;
    const canvas = await html2canvas(report, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const eyeSide = scanData?.imageInfo?.eyeSide ? `_${scanData.imageInfo.eyeSide}` : '';
    pdf.save(`EyeCare_Report${eyeSide}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  const downloadJson = () => {
    const dataStr = JSON.stringify(scanData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const eyeSide = scanData?.imageInfo?.eyeSide ? `_${scanData.imageInfo.eyeSide}` : '';
    a.href = url;
    a.download = `EyeCare_Report${eyeSide}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!scanData?.analysis?.condition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border border-gray-100">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No Results Available</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              It looks like there are no scan results to display. Please upload an eye image to get started with our AI analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                <Eye className="w-5 h-5" />
                <span>Start Eye Scan</span>
              </button>
              <button className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const riskLevel = getRiskLevel(scanData.analysis.confidence);
  const conditionIcon = getConditionIcon(scanData.analysis.condition);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" id="report-root">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate('/scan')} className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Scan</span>
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button onClick={downloadReport} title="Download PDF" className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button onClick={downloadJson} title="Download JSON" className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors">
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Analysis Complete</h1>
            <p className="text-xl text-blue-100">Your eye scan has been processed successfully{scanData?.imageInfo?.eyeSide ? ` • Eye: ${scanData.imageInfo.eyeSide}` : ''}</p>
            <div className="flex items-center justify-center space-x-2 mt-4 text-blue-200">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatTimestamp()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        {/* Main Result Card */}
        <div className={`bg-white rounded-3xl shadow-2xl border border-gray-100 mb-8 overflow-hidden transform transition-all duration-1000 ${animateResults ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="p-8 md:p-12">
            {/* Condition Overview */}
            <div className="text-center mb-12">
              <div className="text-8xl mb-6">{conditionIcon}</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">{scanData.analysis.condition}</h2>
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${riskLevel.bgColor} ${riskLevel.borderColor} border-2`}>
                <Activity className={`w-5 h-5 text-${riskLevel.color}-600`} />
                <span className={`font-semibold ${riskLevel.textColor}`}>
                  {riskLevel.level} Confidence: {scanData.analysis.confidence}%
                </span>
              </div>
            </div>

            {/* Confidence Meter */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold text-gray-700">Confidence Level</span>
                <span className="text-lg font-bold text-gray-900">{scanData.analysis.confidence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r from-${riskLevel.color}-400 to-${riskLevel.color}-600 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: animateResults ? `${scanData.analysis.confidence}%` : '0%' }}
                ></div>
              </div>
            </div>

            {/* Patient-friendly Summary */}
            {(scanData.analysis.summary || scanData.analysis.whatItMeans) && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-8 rounded-2xl border border-emerald-200 mb-12">
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">What this means for you</h3>
                {scanData.analysis.summary && (
                  <p className="text-emerald-800 mb-3">{scanData.analysis.summary}</p>
                )}
                {scanData.analysis.whatItMeans && (
                  <p className="text-emerald-800">{scanData.analysis.whatItMeans}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {scanData.analysis.urgency && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <div className="text-sm text-emerald-600 font-semibold mb-1">Urgency</div>
                      <div className="text-emerald-900 font-bold">{scanData.analysis.urgency}</div>
                    </div>
                  )}
                  {scanData.analysis.followUp && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <div className="text-sm text-emerald-600 font-semibold mb-1">Follow-up</div>
                      <div className="text-emerald-900">{scanData.analysis.followUp}</div>
                    </div>
                  )}
                  {scanData.analysis.nextSteps && scanData.analysis.nextSteps.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <div className="text-sm text-emerald-600 font-semibold mb-2">Next steps</div>
                      <ul className="list-disc pl-5 text-emerald-900 space-y-1">
                        {scanData.analysis.nextSteps.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Doctor Recommendation */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900">Recommended Specialist</h3>
                    <p className="text-blue-700">Expert consultation advised</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-blue-900 mb-2">{scanData.recommendations?.doctor?.name || 'Ophthalmologist'}</p>
                <p className="text-blue-800">Schedule an appointment for detailed examination</p>
              </div>

              {/* Medicine Recommendation */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900">Treatment Suggestion</h3>
                    <p className="text-green-700">Preliminary recommendation</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-green-900 mb-2">{scanData.recommendations?.medicine?.name || 'Consult doctor for medication'}</p>
                <p className="text-green-800">Consult healthcare provider before use</p>
              </div>
            </div>

            {/* AI Probabilities */}
            {scanData.analysis.probabilities && scanData.analysis.probabilities.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200 mb-8">
                <div className="flex items-center space-x-3 mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-900">AI Model Probabilities</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scanData.analysis.probabilities.map((prob, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-purple-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-purple-900">{prob.label}</span>
                        <span className="text-lg font-bold text-purple-600">{prob.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${prob.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-200 mb-8">
              <button 
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full text-left"
              >
                <div className="flex items-center space-x-3">
                  <Info className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-purple-900">Detailed Analysis</h3>
                </div>
                <div className={`transform transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </button>
              
              {showDetails && (
                <div className="mt-6 pt-6 border-t border-purple-200 space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Analysis Method</h4>
                      <p className="text-purple-800">Deep learning neural networks trained on medical datasets</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Processing Time</h4>
                      <p className="text-purple-800">2.3 seconds for complete analysis</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Image Quality</h4>
                      <p className="text-purple-800">High resolution, suitable for analysis</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 mb-2">Model Version</h4>
                      <p className="text-purple-800">EyeCare AI v3.2.1</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-200 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-indigo-900">Recommended Next Steps</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-indigo-900">Book appointment with {scanData.recommendations?.doctor?.name || 'ophthalmologist'}</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-indigo-900">Discuss treatment options</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white rounded-xl">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-indigo-900">Follow up in 2-4 weeks</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/scan')} className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl">
                <Zap className="w-5 h-5" />
                <span>Scan Another Image</span>
              </button>
              <button onClick={downloadReport} className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold border border-gray-200 shadow-sm">
                <FileText className="w-5 h-5" />
                <span>Download Report</span>
              </button>
              <button onClick={() => navigate('/')} className="inline-flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 font-semibold">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Important Medical Disclaimer</h3>
              <p className="text-amber-800 leading-relaxed">
                This AI-generated analysis is for educational and screening purposes only. Results should not replace professional medical diagnosis, treatment, or advice. Always consult with a qualified ophthalmologist or healthcare provider for comprehensive eye care and treatment decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}