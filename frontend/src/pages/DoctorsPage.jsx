import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail, Building, Filter } from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import FilterTabs from '../components/FilterTabs';
import SearchBar from '../components/SearchBar';

const DoctorsPage = () => {
  const { city } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDoctors = [
      {
        id: 1,
        name: 'Dr. Priya Sharma',
        specialization: 'Retina Specialist',
        hospital: 'Apollo Eye Hospital',
        city: 'Mumbai',
        type: 'private',
        rating: 4.8,
        experience: '15 years',
        phone: '+91 98765 43210',
        email: 'priya.sharma@apollo.com',
        address: 'Bandra West, Mumbai',
        availability: 'Mon-Fri, 9 AM - 6 PM',
        consultationFee: '₹2000',
        image: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=Dr.+Priya',
        verified: true
      },
      {
        id: 2,
        name: 'Dr. Rajesh Kumar',
        specialization: 'Ophthalmologist',
        hospital: 'JJ Hospital',
        city: 'Mumbai',
        type: 'government',
        rating: 4.5,
        experience: '12 years',
        phone: '+91 98765 43211',
        email: 'rajesh.kumar@jjhospital.gov.in',
        address: 'Byculla, Mumbai',
        availability: 'Mon-Sat, 8 AM - 4 PM',
        consultationFee: '₹500',
        image: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=Dr.+Rajesh',
        verified: true
      },
      {
        id: 3,
        name: 'Dr. Meera Patel',
        specialization: 'Cornea Specialist',
        hospital: 'Fortis Hospital',
        city: 'Mumbai',
        type: 'private',
        rating: 4.9,
        experience: '18 years',
        phone: '+91 98765 43212',
        email: 'meera.patel@fortis.com',
        address: 'Mulund West, Mumbai',
        availability: 'Mon-Fri, 10 AM - 7 PM',
        consultationFee: '₹2500',
        image: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=Dr.+Meera',
        verified: true
      },
      {
        id: 4,
        name: 'Dr. Amit Singh',
        specialization: 'Glaucoma Specialist',
        hospital: 'KEM Hospital',
        city: 'Mumbai',
        type: 'government',
        rating: 4.3,
        experience: '10 years',
        phone: '+91 98765 43213',
        email: 'amit.singh@kemhospital.gov.in',
        address: 'Parel, Mumbai',
        availability: 'Mon-Sat, 9 AM - 5 PM',
        consultationFee: '₹300',
        image: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=Dr.+Amit',
        verified: true
      },
      {
        id: 5,
        name: 'Dr. Sneha Reddy',
        specialization: 'Pediatric Ophthalmologist',
        hospital: 'Tata Memorial Hospital',
        city: 'Mumbai',
        type: 'private',
        rating: 4.7,
        experience: '14 years',
        phone: '+91 98765 43214',
        email: 'sneha.reddy@tata.com',
        address: 'Parel, Mumbai',
        availability: 'Mon-Fri, 8 AM - 6 PM',
        consultationFee: '₹1800',
        image: 'https://via.placeholder.com/150x150/8B5CF6/FFFFFF?text=Dr.+Sneha',
        verified: true
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setDoctors(mockDoctors);
      setFilteredDoctors(mockDoctors);
      setLoading(false);
    }, 1000);
  }, [city]);

  // Filter doctors based on active filter and search term
  useEffect(() => {
    let filtered = doctors;

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.type === activeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [doctors, activeFilter, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctors...</p>
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
            Find Eye Specialists in {city}
          </h1>
          <p className="text-lg text-gray-600">
            Connect with qualified ophthalmologists and retina specialists
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search Bar */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search doctors, specializations, or hospitals..."
              />

              {/* Filter Tabs */}
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Found <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctors
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Building className="w-4 h-4" />
                <span>Private: {doctors.filter(d => d.type === 'private').length}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Government: {doctors.filter(d => d.type === 'government').length}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor, index) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need Help Finding the Right Doctor?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Our team can help you find the perfect eye specialist based on your specific condition and requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 mr-2" />
                Call for Assistance
              </button>
              <button className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors">
                <Mail className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsPage; 