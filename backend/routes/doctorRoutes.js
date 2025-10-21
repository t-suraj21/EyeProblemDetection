import express from "express";
import Doctor from "../models/Doctor.js";

const router = express.Router();

// GET /api/doctors - Get all doctors with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      specialization,
      city,
      state,
      rating,
      experience,
      insurance,
      language,
      search
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (specialization) {
      filter.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    
    if (state) {
      filter['location.state'] = { $regex: state, $options: 'i' };
    }
    
    if (rating) {
      filter.rating = { $gte: parseFloat(rating) };
    }
    
    if (experience) {
      filter.experience = { $gte: parseInt(experience) };
    }
    
    if (insurance) {
      filter.insurance = { $regex: insurance, $options: 'i' };
    }
    
    if (language) {
      filter.languages = { $regex: language, $options: 'i' };
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const doctors = await Doctor.find(filter)
      .sort({ rating: -1, experience: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Doctor.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: doctors,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalDoctors: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/doctors/condition/:condition - Get doctors by specific condition
router.get("/condition/:condition", async (req, res) => {
  try {
    const { condition } = req.params;
    const { limit = 5 } = req.query;

    const doctors = await Doctor.findByCondition(condition)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      condition: condition,
      count: doctors.length,
      data: doctors
    });

  } catch (error) {
    console.error("Error fetching doctors by condition:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching doctors by condition",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/doctors/specializations - Get all available specializations
router.get("/specializations", async (req, res) => {
  try {
    const specializations = await Doctor.distinct("specialization");
    
    res.json({
      success: true,
      count: specializations.length,
      data: specializations.sort()
    });

  } catch (error) {
    console.error("Error fetching specializations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching specializations",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/doctors/locations - Get all available cities and states
router.get("/locations", async (req, res) => {
  try {
    const cities = await Doctor.distinct("location.city");
    const states = await Doctor.distinct("location.state");
    
    res.json({
      success: true,
      cities: cities.sort(),
      states: states.sort()
    });

  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locations",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/doctors/:id - Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findById(id).select('-__v');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      data: doctor
    });

  } catch (error) {
    console.error("Error fetching doctor:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error fetching doctor",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/doctors - Create new doctor (admin only)
router.post("/", async (req, res) => {
  try {
    const doctorData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'specialization', 'location', 'contact'];
    for (const field of requiredFields) {
      if (!doctorData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Create new doctor
    const doctor = new Doctor(doctorData);
    await doctor.save();

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: doctor
    });

  } catch (error) {
    console.error("Error creating doctor:", error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error creating doctor",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/doctors/:id - Update doctor (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      message: "Doctor updated successfully",
      data: doctor
    });

  } catch (error) {
    console.error("Error updating doctor:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error updating doctor",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/doctors/:id - Delete doctor (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const doctor = await Doctor.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    res.json({
      success: true,
      message: "Doctor deactivated successfully"
    });

  } catch (error) {
    console.error("Error deleting doctor:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error deleting doctor",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/doctors/:id/rating - Add rating to doctor
router.post("/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const doctor = await Doctor.findById(id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found"
      });
    }

    // Update doctor rating
    await doctor.updateRating(rating);

    res.json({
      success: true,
      message: "Rating added successfully",
      data: {
        newRating: doctor.rating,
        reviewCount: doctor.reviewCount
      }
    });

  } catch (error) {
    console.error("Error adding rating:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error adding rating",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
