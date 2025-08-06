import { analyzeRetinaImage } from '../services/aiService.js';
import Scan from '../models/Scan.js';

/**
 * Upload retina image and trigger AI analysis
 * POST /api/upload
 */
export const uploadRetinaImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded'
      });
    }

    const imagePath = req.file.path;
    const userId = req.body.userId || 'anonymous';

    console.log(`Processing image: ${imagePath}`);

    // Analyze image with AI
    const aiResult = await analyzeRetinaImage(imagePath);

    // Create scan record
    const scan = new Scan({
      userId,
      imageUrl: imagePath,
      detectedProblem: aiResult.problem,
      confidenceScore: aiResult.confidenceScore,
      cause: aiResult.cause,
      severity: aiResult.severity,
      suggestions: aiResult.suggestions
    });

    await scan.save();

    console.log(`Scan saved with ID: ${scan._id}`);

    res.status(201).json({
      success: true,
      message: 'Retina scan completed successfully',
      data: {
        scanId: scan._id,
        problem: scan.detectedProblem,
        confidenceScore: scan.confidenceScore,
        severity: scan.severity,
        timestamp: scan.createdAt
      }
    });

  } catch (error) {
    console.error('Upload Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process retina image',
      error: error.message
    });
  }
};

/**
 * Get upload statistics
 * GET /api/upload/stats
 */
export const getUploadStats = async (req, res) => {
  try {
    const totalScans = await Scan.countDocuments();
    const todayScans = await Scan.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const problemStats = await Scan.aggregate([
      {
        $group: {
          _id: '$detectedProblem',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalScans,
        todayScans,
        problemStats
      }
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
}; 