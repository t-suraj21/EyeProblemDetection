import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  genericName: {
    type: String,
    trim: true
  },
  brandNames: {
    type: [String],
    default: []
  },
  condition: {
    type: String,
    required: [true, 'Target condition is required'],
    enum: [
      'Cataract',
      'Glaucoma',
      'Diabetic Retinopathy',
      'Macular Degeneration',
      'Dry Eye Syndrome',
      'Conjunctivitis',
      'Uveitis',
      'Retinal Detachment',
      'Corneal Ulcer',
      'Eye Infection',
      'Eye Inflammation',
      'General Eye Care',
      'Vision Enhancement'
    ]
  },
  category: {
    type: String,
    required: [true, 'Medicine category is required'],
    enum: [
      'Eye Drops',
      'Oral Medication',
      'Injectable',
      'Topical Ointment',
      'Supplements',
      'Prescription',
      'Over-the-Counter'
    ]
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: [
      'Pediatric (0-12)',
      'Teen (13-19)',
      'Adult (20-64)',
      'Senior (65+)',
      'All Ages'
    ]
  },
  dosage: {
    form: {
      type: String,
      required: [true, 'Dosage form is required']
    },
    strength: String,
    frequency: {
      type: String,
      required: [true, 'Dosage frequency is required']
    },
    duration: String,
    instructions: String
  },
  sideEffects: {
    type: [String],
    default: []
  },
  precautions: {
    type: [String],
    default: []
  },
  contraindications: {
    type: [String],
    default: []
  },
  interactions: {
    type: [String],
    default: []
  },
  pregnancy: {
    type: String,
    enum: ['Safe', 'Consult Doctor', 'Avoid', 'Unknown'],
    default: 'Unknown'
  },
  breastfeeding: {
    type: String,
    enum: ['Safe', 'Consult Doctor', 'Avoid', 'Unknown'],
    default: 'Unknown'
  },
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative']
  },
  availability: {
    type: String,
    enum: ['Available', 'Limited', 'Out of Stock', 'Discontinued'],
    default: 'Available'
  },
  requiresPrescription: {
    type: Boolean,
    default: true
  },
  manufacturer: String,
  activeIngredients: {
    type: [String],
    default: []
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  effectiveness: {
    type: Number,
    min: [1, 'Effectiveness must be at least 1'],
    max: [10, 'Effectiveness cannot exceed 10'],
    default: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full dosage information
medicineSchema.virtual('fullDosage').get(function() {
  return `${this.dosage.form} ${this.dosage.strength || ''} - ${this.dosage.frequency}`;
});

// Virtual for price range display
medicineSchema.virtual('priceRange').get(function() {
  if (!this.cost) return 'Price not available';
  if (this.cost < 20) return 'Low cost';
  if (this.cost < 100) return 'Medium cost';
  return 'High cost';
});

// Index for better search performance
medicineSchema.index({ condition: 1, ageGroup: 1, category: 1 });
medicineSchema.index({ name: 'text', condition: 'text', genericName: 'text' });
medicineSchema.index({ effectiveness: -1, cost: 1 });

// Pre-save middleware to validate dosage
medicineSchema.pre('save', function(next) {
  if (this.dosage.frequency && !this.dosage.frequency.match(/^(daily|twice daily|three times daily|as needed|every \d+ hours?)$/i)) {
    next(new Error('Invalid dosage frequency format'));
  }
  next();
});

// Static method to find medicines by condition and age
medicineSchema.statics.findByConditionAndAge = function(condition, age) {
  let ageGroup = 'All Ages';
  
  if (age < 13) ageGroup = 'Pediatric (0-12)';
  else if (age < 20) ageGroup = 'Teen (13-19)';
  else if (age < 65) ageGroup = 'Adult (20-64)';
  else ageGroup = 'Senior (65+)';
  
  return this.find({
    condition: { $regex: condition, $options: 'i' },
    $or: [
      { ageGroup: ageGroup },
      { ageGroup: 'All Ages' }
    ],
    isActive: true
  }).sort({ effectiveness: -1, cost: 1 });
};

// Static method to find alternative medicines
medicineSchema.statics.findAlternatives = function(medicineId, condition) {
  return this.find({
    _id: { $ne: medicineId },
    condition: { $regex: condition, $options: 'i' },
    isActive: true
  }).sort({ effectiveness: -1 }).limit(5);
};

// Instance method to check if medicine is suitable for age
medicineSchema.methods.isSuitableForAge = function(age) {
  if (this.ageGroup === 'All Ages') return true;
  
  const ageRanges = {
    'Pediatric (0-12)': age <= 12,
    'Teen (13-19)': age >= 13 && age <= 19,
    'Adult (20-64)': age >= 20 && age <= 64,
    'Senior (65+)': age >= 65
  };
  
  return ageRanges[this.ageGroup] || false;
};

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
