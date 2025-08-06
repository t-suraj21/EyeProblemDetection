import { motion } from 'framer-motion';
import { Star, MapPin, Clock, Phone, Mail, Building, Shield, Calendar } from 'lucide-react';

const DoctorCard = ({ doctor, index }) => {
  const getTypeColor = (type) => {
    return type === 'private' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const getTypeIcon = (type) => {
    return type === 'private' ? Building : Shield;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {doctor.name}
              </h3>
              {doctor.verified && (
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-blue-600 font-medium text-sm mb-1">
              {doctor.specialization}
            </p>
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(doctor.type)}`}>
                <div className="flex items-center space-x-1">
                  {React.createElement(getTypeIcon(doctor.type), { className: "w-3 h-3" })}
                  <span className="capitalize">{doctor.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-900">{doctor.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Hospital Info */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Building className="w-4 h-4 text-gray-500" />
            <h4 className="font-medium text-gray-900">{doctor.hospital}</h4>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{doctor.address}</span>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Experience</span>
            <span className="text-sm font-medium text-gray-900">{doctor.experience}</span>
          </div>
        </div>

        {/* Availability */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-900">Availability</span>
          </div>
          <p className="text-sm text-gray-600">{doctor.availability}</p>
        </div>

        {/* Consultation Fee */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Consultation Fee</span>
            <span className="text-sm font-semibold text-green-600">{doctor.consultationFee}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">{doctor.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700 truncate">{doctor.email}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            Call Now
          </button>
          <button className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
            <Calendar className="w-4 h-4 mr-2" />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Verified Profile</span>
          <span>•</span>
          <span>Available Today</span>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard; 