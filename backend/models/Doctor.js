import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Doctor name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Ophthalmologist',
      'Retina Specialist',
      'Glaucoma Specialist',
      'Cornea Specialist',
      'Pediatric Ophthalmologist',
      'Neuro-Ophthalmologist',
      'Oculoplastic Surgeon',
      'General Eye Care'
    ],
    default: 'General Eye Care'
  },
  qualifications: {
    type: [String],
    default: []
  },
  experience: {
    type: Number,
    min: [0, 'Experience cannot be negative'],
    max: [50, 'Experience cannot exceed 50 years']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    website: String
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  languages: {
    type: [String],
    default: ['English']
  },
  insurance: {
    type: [String],
    default: []
  },
  availability: {
    monday: { type: String, default: '9:00 AM - 5:00 PM' },
    tuesday: { type: String, default: '9:00 AM - 5:00 PM' },
    wednesday: { type: String, default: '9:00 AM - 5:00 PM' },
    thursday: { type: String, default: '9:00 AM - 5:00 PM' },
    friday: { type: String, default: '9:00 AM - 5:00 PM' },
    saturday: { type: String, default: '9:00 AM - 1:00 PM' },
    sunday: { type: String, default: 'Closed' }
  },
  consultationFee: {
    type: Number,
    min: [0, 'Consultation fee cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: String,
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full address
doctorSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.city}, ${this.location.state} ${this.location.zipCode}`;
});

// Virtual for average rating display
doctorSchema.virtual('averageRating').get(function() {
  return this.reviewCount > 0 ? (this.rating / this.reviewCount).toFixed(1) : 'No reviews';
});

// Index for better search performance
doctorSchema.index({ specialization: 1, 'location.city': 1, rating: -1 });
doctorSchema.index({ name: 'text', specialization: 'text', 'location.city': 'text' });

// Pre-save middleware to ensure email is unique
doctorSchema.pre('save', async function(next) {
  if (this.isModified('email')) {
    const existingDoctor = await this.constructor.findOne({ email: this.email, _id: { $ne: this._id } });
    if (existingDoctor) {
      throw new Error('Email already exists');
    }
  }
  next();
});

// Static method to find doctors by condition
doctorSchema.statics.findByCondition = function(condition) {
  const conditionMap = {
    'cataract': ['Ophthalmologist', 'General Eye Care'],
    'glaucoma': ['Glaucoma Specialist', 'Ophthalmologist'],
    'diabetic retinopathy': ['Retina Specialist', 'Ophthalmologist'],
    'macular degeneration': ['Retina Specialist', 'Ophthalmologist'],
    'cornea': ['Cornea Specialist', 'Ophthalmologist'],
    'pediatric': ['Pediatric Ophthalmologist'],
    'neuro': ['Neuro-Ophthalmologist']
  };
  
  const specializations = conditionMap[condition.toLowerCase()] || ['General Eye Care'];
  return this.find({ 
    specialization: { $in: specializations },
    isActive: true 
  }).sort({ rating: -1, experience: -1 });
};

// Instance method to update rating
doctorSchema.methods.updateRating = function(newRating) {
  const totalRating = (this.rating * this.reviewCount) + newRating;
  this.reviewCount += 1;
  this.rating = totalRating / this.reviewCount;
  return this.save();
};

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
