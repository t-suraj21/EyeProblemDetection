import { motion } from 'framer-motion';
import { Eye, ZoomIn, Download } from 'lucide-react';

const ImagePreview = ({ previewUrl, selectedFile, isUploading }) => {
  if (!previewUrl) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Image Preview
          </h3>
          <p className="text-gray-500">
            Upload an image to see the preview here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Image Preview
        </h3>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Image Container */}
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            src={previewUrl}
            alt="Retina preview"
            className="w-full h-80 object-cover"
          />
          
          {/* Uploading Overlay */}
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <div className="text-center text-white">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-lg font-medium">Analyzing Image...</p>
                <p className="text-sm opacity-75">Please wait while our AI processes your image</p>
              </div>
            </motion.div>
          )}

          {/* Image Info Overlay */}
          {selectedFile && !isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black bg-opacity-75 to-transparent p-4"
            >
              <div className="text-white">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm opacity-75">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Image Details */}
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">File Name:</span>
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
              </div>
              <div>
                <span className="text-gray-500">File Size:</span>
                <p className="font-medium text-gray-900">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div>
                <span className="text-gray-500">File Type:</span>
                <p className="font-medium text-gray-900">
                  {selectedFile.type.split('/')[1].toUpperCase()}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Upload Time:</span>
                <p className="font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Quality Indicators */}
            <div className="pt-3 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Image Quality Check
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Resolution</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Good</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Size</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Optimal</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Format</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Supported</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImagePreview; 