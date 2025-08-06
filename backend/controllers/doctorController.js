import Doctor from '../models/Doctor.js';

/**
 * Get doctors by city
 * GET /api/doctors/:city
 */
export const getDoctorsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const { type, specialization, limit = 20 } = req.query;

    let query = { 
      city: { $regex: city, $options: 'i' },
      isActive: true 
    };

    if (type) {
      query.type = type;
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await Doctor.find(query)
      .limit(parseInt(limit))
      .sort({ rating: -1, experience: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: {
        doctors,
        count: doctors.length,
        city: city
      }
    });

  } catch (error) {
    console.error('Doctor Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

/**
 * Add new doctor (Admin only)
 * POST /api/doctors/add
 */
export const addDoctor = async (req, res) => {
  try {
    const {
      name,
      specialization,
      hospital,
      city,
      type,
      contact,
      address,
      experience,
      rating
    } = req.body;

    // Validate required fields
    if (!name || !specialization || !hospital || !city || !type || !contact) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      name: { $regex: name, $options: 'i' },
      hospital: { $regex: hospital, $options: 'i' },
      city: { $regex: city, $options: 'i' }
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: 'Doctor already exists in this hospital and city'
      });
    }

    const doctor = new Doctor({
      name,
      specialization,
      hospital,
      city,
      type,
      contact,
      address,
      experience: experience || 0,
      rating: rating || 0
    });

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Doctor added successfully',
      data: doctor
    });

  } catch (error) {
    console.error('Add Doctor Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add doctor',
      error: error.message
    });
  }
};

/**
 * Get all doctors with filters
 * GET /api/doctors
 */
export const getAllDoctors = async (req, res) => {
  try {
    const { 
      city, 
      type, 
      specialization, 
      page = 1, 
      limit = 20,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    let query = { isActive: true };

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (type) {
      query.type = type;
    }

    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const doctors = await Doctor.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const totalDoctors = await Doctor.countDocuments(query);

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalDoctors / limit),
          totalDoctors,
          hasNext: skip + doctors.length < totalDoctors,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get All Doctors Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message
    });
  }
};

/**
 * Get doctor by ID
 * GET /api/doctors/id/:id
 */
export const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });

  } catch (error) {
    console.error('Get Doctor by ID Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message
    });
  }
};

/**
 * Update doctor rating
 * PUT /api/doctors/:id/rating
 */
export const updateDoctorRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 0 and 5'
      });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { rating },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      message: 'Doctor rating updated successfully',
      data: doctor
    });

  } catch (error) {
    console.error('Update Rating Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor rating',
      error: error.message
    });
  }
}; 