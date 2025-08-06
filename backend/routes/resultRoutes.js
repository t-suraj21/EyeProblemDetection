import express from 'express';
import { 
  getResultById, 
  getSuggestions, 
  getUserScans, 
  getScanStats 
} from '../controllers/resultController.js';

const router = express.Router();

// Get scan result by ID
router.get('/:id', getResultById);

// Get suggestions for specific eye problem
router.get('/suggestions/:issue', getSuggestions);

// Get user's scan history
router.get('/user/:userId', getUserScans);

// Get scan statistics
router.get('/stats/overview', getScanStats);

export default router; 