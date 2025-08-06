import Scan from '../models/Scan.js';
import { getMedicineSuggestions, getCareTips } from '../services/aiService.js';

/**
 * Get scan result by ID
 * GET /api/result/:id
 */
export const getResultById = async (req, res) => {
  try {
    const { id } = req.params;

    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan result not found'
      });
    }

    res.json({
      success: true,
      data: scan
    });

  } catch (error) {
    console.error('Result Controller Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan result',
      error: error.message
    });
  }
};

/**
 * Get suggestions for specific eye problem
 * GET /api/suggestions/:issue
 */
export const getSuggestions = async (req, res) => {
  try {
    const { issue } = req.params;
    const { type = 'all' } = req.query; // 'medicines', 'tips', 'all'

    let response = {};

    if (type === 'all' || type === 'medicines') {
      response.medicines = getMedicineSuggestions(issue);
    }

    if (type === 'all' || type === 'tips') {
      response.careTips = getCareTips(issue);
    }

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Suggestions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggestions',
      error: error.message
    });
  }
};

/**
 * Get recent scans for a user
 * GET /api/result/user/:userId
 */
export const getUserScans = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const skip = (page - 1) * limit;

    const scans = await Scan.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');

    const totalScans = await Scan.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        scans,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalScans / limit),
          totalScans,
          hasNext: skip + scans.length < totalScans,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('User Scans Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user scans',
      error: error.message
    });
  }
};

/**
 * Get scan statistics
 * GET /api/result/stats
 */
export const getScanStats = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    let dateFilter = {};
    if (period === 'week') {
      dateFilter = {
        createdAt: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      };
    } else if (period === 'month') {
      dateFilter = {
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      };
    }

    const totalScans = await Scan.countDocuments(dateFilter);
    const severityStats = await Scan.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const problemStats = await Scan.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$detectedProblem',
          count: { $sum: 1 },
          avgConfidence: { $avg: '$confidenceScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      success: true,
      data: {
        totalScans,
        severityStats,
        problemStats
      }
    });

  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scan statistics',
      error: error.message
    });
  }
}; 