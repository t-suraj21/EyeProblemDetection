import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: false, // Optional for now, can be added later with authentication
    default: 'anonymous'
  },
  imageUrl: {
    type: String,
    required: true
  },
  detectedProblem: {
    type: String,
    required: true
  },
  confidenceScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  cause: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  suggestions: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
scanSchema.index({ createdAt: -1 });
scanSchema.index({ userId: 1 });

const Scan = mongoose.model('Scan', scanSchema);

export default Scan; 