import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// GET /api/medicines - Get all medicines with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      condition,
      category,
      ageGroup,
      requiresPrescription,
      availability,
      search,
      sortBy = "effectiveness",
      sortOrder = "desc"
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (condition) {
      filter.condition = { $regex: condition, $options: 'i' };
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    
    if (ageGroup) {
      filter.ageGroup = { $regex: ageGroup, $options: 'i' };
    }
    
    if (requiresPrescription !== undefined) {
      filter.requiresPrescription = requiresPrescription === 'true';
    }
    
    if (availability) {
      filter.availability = { $regex: availability, $options: 'i' };
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    if (sortBy === "cost") {
      sort.cost = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "name") {
      sort.name = sortOrder === "desc" ? -1 : 1;
    } else {
      sort.effectiveness = sortOrder === "desc" ? -1 : 1;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const medicines = await Medicine.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Medicine.countDocuments(filter);
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: medicines,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalMedicines: total,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/condition/:condition - Get medicines by specific condition
router.get("/condition/:condition", async (req, res) => {
  try {
    const { condition } = req.params;
    const { age = 30, limit = 10 } = req.query;

    const medicines = await Medicine.findByConditionAndAge(condition, parseInt(age))
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      condition: condition,
      age: parseInt(age),
      count: medicines.length,
      data: medicines
    });

  } catch (error) {
    console.error("Error fetching medicines by condition:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medicines by condition",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/categories - Get all available categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Medicine.distinct("category");
    
    res.json({
      success: true,
      count: categories.length,
      data: categories.sort()
    });

  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/conditions - Get all available conditions
router.get("/conditions", async (req, res) => {
  try {
    const conditions = await Medicine.distinct("condition");
    
    res.json({
      success: true,
      count: conditions.length,
      data: conditions.sort()
    });

  } catch (error) {
    console.error("Error fetching conditions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching conditions",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/age-groups - Get all available age groups
router.get("/age-groups", async (req, res) => {
  try {
    const ageGroups = await Medicine.distinct("ageGroup");
    
    res.json({
      success: true,
      count: ageGroups.length,
      data: ageGroups.sort()
    });

  } catch (error) {
    console.error("Error fetching age groups:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching age groups",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/:id - Get medicine by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findById(id).select('-__v');
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      data: medicine
    });

  } catch (error) {
    console.error("Error fetching medicine:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error fetching medicine",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/medicines/:id/alternatives - Get alternative medicines
router.get("/:id/alternatives", async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;
    
    const medicine = await Medicine.findById(id);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    const alternatives = await Medicine.findAlternatives(id, medicine.condition)
      .limit(parseInt(limit))
      .select('-__v');

    res.json({
      success: true,
      originalMedicine: {
        id: medicine._id,
        name: medicine.name,
        condition: medicine.condition
      },
      count: alternatives.length,
      data: alternatives
    });

  } catch (error) {
    console.error("Error fetching alternatives:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error fetching alternatives",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/medicines - Create new medicine (admin only)
router.post("/", async (req, res) => {
  try {
    const medicineData = req.body;
    
    // Validate required fields
    const requiredFields = ['name', 'condition', 'category', 'ageGroup', 'dosage'];
    for (const field of requiredFields) {
      if (!medicineData[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Validate dosage structure
    if (!medicineData.dosage.form || !medicineData.dosage.frequency) {
      return res.status(400).json({
        success: false,
        message: "Dosage form and frequency are required"
      });
    }

    // Create new medicine
    const medicine = new Medicine(medicineData);
    await medicine.save();

    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: medicine
    });

  } catch (error) {
    console.error("Error creating medicine:", error);
    
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
      message: "Error creating medicine",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// PUT /api/medicines/:id - Update medicine (admin only)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine updated successfully",
      data: medicine
    });

  } catch (error) {
    console.error("Error updating medicine:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format"
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
      message: "Error updating medicine",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// DELETE /api/medicines/:id - Delete medicine (admin only)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const medicine = await Medicine.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    res.json({
      success: true,
      message: "Medicine deactivated successfully"
    });

  } catch (error) {
    console.error("Error deleting medicine:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error deleting medicine",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// POST /api/medicines/check-age-suitability - Check if medicine is suitable for age
router.post("/check-age-suitability", async (req, res) => {
  try {
    const { medicineId, age } = req.body;
    
    if (!medicineId || age === undefined) {
      return res.status(400).json({
        success: false,
        message: "Medicine ID and age are required"
      });
    }

    const medicine = await Medicine.findById(medicineId);
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    const isSuitable = medicine.isSuitableForAge(parseInt(age));

    res.json({
      success: true,
      medicine: {
        id: medicine._id,
        name: medicine.name,
        ageGroup: medicine.ageGroup
      },
      age: parseInt(age),
      isSuitable,
      message: isSuitable 
        ? "Medicine is suitable for this age group" 
        : "Medicine is not suitable for this age group"
    });

  } catch (error) {
    console.error("Error checking age suitability:", error);
    
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: "Invalid medicine ID format"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error checking age suitability",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;
