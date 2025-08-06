import express from 'express';
import { uploadRetinaImage, getUploadStats } from '../controllers/uploadController.js';
import { upload, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Upload retina image
router.post('/', upload.single('image'), handleUploadError, uploadRetinaImage);

// Get upload statistics
router.get('/stats', getUploadStats);

export default router; 