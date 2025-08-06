import express from 'express';
import { 
  getDoctorsByCity, 
  addDoctor, 
  getAllDoctors, 
  getDoctorById, 
  updateDoctorRating 
} from '../controllers/doctorController.js';

const router = express.Router();

// Get doctors by city
router.get('/city/:city', getDoctorsByCity);

// Get all doctors with filters
router.get('/', getAllDoctors);

// Get doctor by ID
router.get('/id/:id', getDoctorById);

// Add new doctor (Admin only)
router.post('/add', addDoctor);

// Update doctor rating
router.put('/:id/rating', updateDoctorRating);

export default router; 