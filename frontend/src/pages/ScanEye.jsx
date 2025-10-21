import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Upload, 
  Camera, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  Zap, 
  Image,
  X,
  ArrowRight,
  Shield,
  Clock,
  Sparkles,
  Info
} from "lucide-react";

export default function ScanEye() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [eyeSide, setEyeSide] = useState("right"); // right | left

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a valid image file (JPEG, JPG, or PNG)");
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileChange(selectedFile);
  };

  // Capture from device camera (mobile/desktop with camera)
  const captureFromCamera = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e) => {
        const f = e.target.files[0];
        handleFileChange(f);
      };
      input.click();
    } catch (err) {
      setError('Unable to access camera. Please upload an image instead.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", file);
      formData.append("eyeSide", eyeSide);

      // Call the backend API
      const response = await fetch("http://localhost:8000/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Navigate to results page with the data
        navigate("/results", { state: { scanData: { ...result, imageInfo: { ...result.imageInfo, eyeSide } } } });
      } else {
        throw new Error(result.message || "Analysis failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFile(null);
    setPreview(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">AI Eye Analysis</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Upload a clear image of your eye for instant AI-powered health screening
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 mb-8">
          {!preview ? (
            /* Upload Area */
            <div
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    dragActive ? 'bg-blue-600 scale-110' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}>
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {dragActive ? 'Drop your image here' : 'Upload Eye Image'}
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Drag and drop your image here, or click to browse
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* Eye side selector */}
                  <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                    <span className="text-gray-700 font-medium">Which eye?</span>
                    <label className="inline-flex items-center space-x-2">
                      <input type="radio" name="eyeSide" value="right" checked={eyeSide === 'right'} onChange={() => setEyeSide('right')} />
                      <span className="text-gray-700">Right</span>
                    </label>
                    <label className="inline-flex items-center space-x-2">
                      <input type="radio" name="eyeSide" value="left" checked={eyeSide === 'left'} onChange={() => setEyeSide('left')} />
                      <span className="text-gray-700">Left</span>
                    </label>
                  </div>
                  <label 
                    htmlFor="file-upload"
                    className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    <Image className="w-5 h-5" />
                    <span>Choose File</span>
                  </label>
                  <button onClick={captureFromCamera} className="inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold border border-gray-200 shadow-sm">
                    <Camera className="w-5 h-5" />
                    <span>Take Photo</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Preview Area */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">Image Preview</h3>
                <button
                  onClick={removeImage}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="relative">
                <img 
                  src={preview} 
                  alt="Eye preview" 
                  className="w-full max-w-md mx-auto rounded-2xl shadow-lg border border-gray-200"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-green-500 text-white p-2 rounded-full">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-gray-600 mb-4">Image ready for analysis</p>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Valid format</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Good quality</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Ready to scan</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Upload Error</h4>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Scan Button */}
          {preview && (
            <div className="mt-8 text-center">
              <button
                onClick={handleUpload}
                disabled={loading}
                className={`inline-flex items-center justify-center space-x-3 px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                  loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6" />
                    <span>Start AI Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {loading && (
                <div className="mt-4 text-center">
                  <p className="text-gray-600 mb-2">AI is analyzing your image...</p>
                  <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Photo Tips */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Photo Guidelines</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Use good lighting, avoid shadows</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Keep the eye open and focused</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Fill the frame with the eye area</span>
              </li>
              <li className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Use a steady hand or tripod</span>
              </li>
            </ul>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Privacy & Security</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Images processed securely</span>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>No images stored permanently</span>
              </li>
              <li className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>HIPAA compliant processing</span>
              </li>
              <li className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>Your data remains private</span>
              </li>
            </ul>
          </div>
        </div>

        {/* File Format Info */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Supported Formats & Requirements</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">File Types:</span> JPEG, JPG, PNG
                </div>
                <div>
                  <span className="font-medium">Max Size:</span> 10MB per image
                </div>
                <div>
                  <span className="font-medium">Resolution:</span> Minimum 800x600px
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}