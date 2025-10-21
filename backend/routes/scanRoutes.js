import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import Doctor from "../models/Doctor.js";
import Medicine from "../models/Medicine.js";
const AI_URL = process.env.AI_MODEL_API || "http://localhost:8001/predict";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "eye-scan-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1
  }
});

// No mock fallback: this API requires a running AI model service

// POST /api/scan - Upload and analyze eye image
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const eyeSide = (req.body?.eyeSide || "right").toLowerCase() === "left" ? "left" : "right";
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    console.log(`📸 Image uploaded: ${req.file.filename}`);

    // Validate file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Clean up invalid file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Invalid file type. Only JPEG, JPG, and PNG are allowed."
      });
    }

    // Check file size
    if (req.file.size > 10 * 1024 * 1024) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: "File size too large. Maximum size is 10MB."
      });
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    let aiResult;
    try {
      // Send image to AI model API
      const form = new FormData();
      form.append("image", fs.createReadStream(req.file.path), {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      });

      const response = await axios.post(AI_URL, form, {
        headers: form.getHeaders(),
        timeout: 30000 // 30 second timeout
      });

      // Transform AI API response to match our format
      aiResult = {
        condition: response.data.best.label,
        confidence: response.data.best.confidence,
        severity: response.data.best.confidence > 80 ? "High" : response.data.best.confidence > 65 ? "Medium" : "Low",
        recommendations: [
          "Schedule appointment with ophthalmologist",
          "Monitor symptoms closely",
          "Avoid eye strain",
          "Use prescribed eye drops if any"
        ],
        riskFactors: [
          "Age-related changes",
          "Family history",
          "Previous eye conditions"
        ],
        probabilities: response.data.topk,
        advice: response.data.advice
      };

      console.log("🤖 AI Model Response:", aiResult);
    } catch (aiError) {
      console.error("AI Model Error:", aiError?.response?.data || aiError.message);
      return res.status(502).json({ success: false, message: "AI prediction failed", detail: aiError.message });
    }

    // Get doctor recommendations based on condition
    let doctorRecommendations = [];
    try {
      doctorRecommendations = await Doctor.findByCondition(aiResult.condition);
      if (doctorRecommendations.length === 0) {
        doctorRecommendations = await Doctor.find({ isActive: true }).limit(3);
      }
    } catch (doctorError) {
      console.error("Doctor lookup error:", doctorError.message);
      // Fallback doctor data
      doctorRecommendations = [
        {
          name: "Dr. Sarah Johnson",
          specialization: "Ophthalmologist",
          location: { city: "New York", state: "NY" },
          rating: 4.8,
          contact: { phone: "+1-555-0123" }
        }
      ];
    }

    // Get medicine recommendations based on condition
    let medicineRecommendations = [];
    try {
      medicineRecommendations = await Medicine.findByConditionAndAge(aiResult.condition, 30); // Default age 30
      if (medicineRecommendations.length === 0) {
        medicineRecommendations = await Medicine.find({ isActive: true }).limit(3);
      }
    } catch (medicineError) {
      console.error("Medicine lookup error:", medicineError.message);
      // Fallback medicine data
      medicineRecommendations = [
        {
          name: "Preservative-free eye drops",
          category: "Eye Drops",
          dosage: { form: "Drops", frequency: "As needed" }
        }
      ];
    }

    // Derive patient-friendly fields
    const severity = aiResult.severity;
    const summary = `This screening suggests: ${aiResult.condition} (confidence ${aiResult.confidence}%). This is not a diagnosis.`;
    const whatItMeans = `Our AI found signs that may be consistent with ${aiResult.condition}. Please review the guidance below and consult a licensed eye specialist for a full examination.`;
    const urgency = severity === "High" ? "Seek specialist care soon (within 1-2 weeks)" : severity === "Medium" ? "Schedule a check within 2-4 weeks" : "Routine follow-up is acceptable";
    const followUp = severity === "High" ? "Arrange an ophthalmologist visit within 1-2 weeks and monitor symptoms closely." : severity === "Medium" ? "Book an appointment in the next 2-4 weeks and follow advice provided." : "Maintain regular eye check-ups and healthy eye habits.";
    const nextSteps = [
      "If vision changes or pain occur, seek urgent care.",
      "Limit eye strain and ensure adequate lighting.",
      "Follow any existing prescriptions or advice from your doctor.",
    ];

    // Prepare response
    const result = {
      success: true,
      scanId: `SCAN_${Date.now()}`,
      timestamp: new Date().toISOString(),
      imageInfo: {
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString(),
        eyeSide
      },
      analysis: {
        condition: aiResult.condition,
        confidence: aiResult.confidence,
        severity: aiResult.severity,
        recommendations: aiResult.recommendations,
        riskFactors: aiResult.riskFactors,
        probabilities: aiResult.probabilities || [],
        advice: aiResult.advice || "This is an AI-generated analysis and should not replace professional medical advice.",
        summary,
        whatItMeans,
        urgency,
        followUp,
        nextSteps
      },
      recommendations: {
        doctor: doctorRecommendations[0] || "Consult with an ophthalmologist",
        medicine: medicineRecommendations[0] || "Consult doctor for medication",
        nextSteps: [
          "Schedule appointment with specialist",
          "Follow up in 2-4 weeks",
          "Monitor symptoms",
          "Avoid eye strain"
        ]
      },
      disclaimer: "This is an AI-generated analysis and should not replace professional medical advice. Please consult with a qualified healthcare provider."
    };

    // Clean up uploaded file after processing (optional - you might want to keep it for a while)
    // fs.unlinkSync(req.file.path);

    console.log(`✅ Scan completed successfully: ${result.scanId}`);
    res.status(200).json(result);

  } catch (error) {
    console.error("❌ Scan error:", error);
    
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error processing eye scan",
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// GET /api/scan/:scanId - Get scan results by ID
router.get("/:scanId", async (req, res) => {
  try {
    const { scanId } = req.params;
    
    // In a real app, you'd store scan results in a database
    // For now, return a mock response
    res.json({
      success: true,
      scanId: scanId,
      message: "Scan results retrieved successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error retrieving scan:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving scan results"
    });
  }
});

// GET /api/scan - Get all scans (for admin purposes)
router.get("/", async (req, res) => {
  try {
    // In a real app, you'd fetch from database with pagination
    res.json({
      success: true,
      message: "Scan history endpoint",
      note: "Implement database integration for scan history"
    });
  } catch (error) {
    console.error("Error fetching scans:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching scan history"
    });
  }
});

// DELETE /api/scan/:scanId - Delete a scan
router.delete("/:scanId", async (req, res) => {
  try {
    const { scanId } = req.params;
    
    // In a real app, you'd delete from database and remove associated files
    res.json({
      success: true,
      message: `Scan ${scanId} deleted successfully`
    });
  } catch (error) {
    console.error("Error deleting scan:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting scan"
    });
  }
});

export default router;
