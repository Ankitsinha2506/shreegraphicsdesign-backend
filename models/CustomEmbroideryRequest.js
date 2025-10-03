const mongoose = require('mongoose');

const customEmbroideryRequestSchema = new mongoose.Schema({
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Basic Request Information
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  
  contactPerson: {
    type: String,
    required: [true, 'Contact person is required'],
    trim: true,
    maxlength: [100, 'Contact person name cannot exceed 100 characters']
  },
  
  // Embroidery Specific Information
  embroideryType: {
    type: String,
    required: [true, 'Embroidery type is required'],
    enum: [
      'Logo Embroidery', 'Text Embroidery', 'Custom Patches', 'Monogramming',
      'Appliqué Work', 'Thread Work', 'Beadwork', 'Sequin Work',
      'Machine Embroidery', 'Hand Embroidery'
    ]
  },
  
  garmentType: {
    type: String,
    required: [true, 'Garment type is required'],
    enum: [
      'T-Shirts', 'Polo Shirts', 'Hoodies', 'Jackets', 'Caps/Hats',
      'Bags', 'Towels', 'Uniforms', 'Aprons', 'Other'
    ]
  },
  
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  
  threadColors: {
    type: String,
    required: [true, 'Thread colors are required'],
    trim: true,
    maxlength: [200, 'Thread colors description cannot exceed 200 characters']
  },
  
  placement: {
    type: String,
    required: [true, 'Placement is required'],
    enum: [
      'Left Chest', 'Right Chest', 'Center Chest', 'Back', 'Sleeve',
      'Collar', 'Pocket', 'Custom Placement'
    ]
  },
  
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true,
    maxlength: [50, 'Size cannot exceed 50 characters']
  },
  
  designDescription: {
    type: String,
    required: [true, 'Design description is required'],
    trim: true,
    maxlength: [1000, 'Design description cannot exceed 1000 characters']
  },
  
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [500, 'Special requirements cannot exceed 500 characters']
  },
  
  // Budget Information
  budget: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: [
      'Under ₹5,000', '₹5,000 - ₹10,000', '₹10,000 - ₹25,000',
      '₹25,000 - ₹50,000', 'Above ₹50,000'
    ]
  },
  
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  
  // Uploaded Files
  uploadedImages: [{
    url: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      maxlength: [200, 'Image description cannot exceed 200 characters']
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Package Selection
  selectedPackage: {
    type: String,
    required: [true, 'Package selection is required'],
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  
  pricing: {
    packagePrice: {
      type: Number,
      required: true
    },
    rushDelivery: {
      selected: {
        type: Boolean,
        default: false
      },
      additionalCost: {
        type: Number,
        default: 0
      }
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  
  // Request Status
  status: {
    type: String,
    enum: ['pending', 'in-review', 'in-progress', 'revision-requested', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  priority: {
    type: String,
    enum: ['normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Timeline
  estimatedDelivery: {
    type: Date
  },
  
  actualDelivery: {
    type: Date
  },
  
  // Admin Information
  adminNotes: {
    type: String,
    trim: true
  },
  
  revisionRequests: [{
    message: {
      type: String,
      required: true
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  
  // Final Deliverables
  finalDesigns: [{
    url: {
      type: String,
      required: true
    },
    format: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Assignment
  assignedDesigner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Contact Information
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    trim: true,
    lowercase: true
  },
  
  contactPhone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
customEmbroideryRequestSchema.index({ user: 1 });
customEmbroideryRequestSchema.index({ status: 1 });
customEmbroideryRequestSchema.index({ priority: 1 });
customEmbroideryRequestSchema.index({ embroideryType: 1 });
customEmbroideryRequestSchema.index({ garmentType: 1 });
customEmbroideryRequestSchema.index({ createdAt: -1 });
customEmbroideryRequestSchema.index({ estimatedDelivery: 1 });

// Text search index
customEmbroideryRequestSchema.index({
  businessName: 'text',
  designDescription: 'text',
  specialRequirements: 'text'
});

// Virtual for days until delivery
customEmbroideryRequestSchema.virtual('daysUntilDelivery').get(function() {
  if (!this.estimatedDelivery) return null;
  const now = new Date();
  const delivery = new Date(this.estimatedDelivery);
  const diffTime = delivery - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for request age in days
customEmbroideryRequestSchema.virtual('requestAge').get(function() {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffTime = now - created;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate estimated delivery based on package and rush delivery
customEmbroideryRequestSchema.methods.calculateEstimatedDelivery = function() {
  const packageDeliveryDays = {
    basic: 7,
    premium: 5,
    enterprise: 3
  };
  
  let deliveryDays = packageDeliveryDays[this.selectedPackage] || 7;
  
  // Reduce delivery time for rush delivery
  if (this.pricing.rushDelivery.selected) {
    deliveryDays = Math.max(1, deliveryDays - 2);
  }
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  
  this.estimatedDelivery = estimatedDate;
  return estimatedDate;
};

// Method to add revision request
customEmbroideryRequestSchema.methods.addRevisionRequest = function(message, userId) {
  this.revisionRequests.push({
    message,
    requestedBy: userId,
    requestedAt: new Date()
  });
  this.status = 'revision-requested';
};

// Method to update status with automatic delivery calculation
customEmbroideryRequestSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'in-progress' && !this.estimatedDelivery) {
    this.calculateEstimatedDelivery();
  }
};

// Pre-save middleware to calculate estimated delivery
customEmbroideryRequestSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('selectedPackage') || this.isModified('pricing.rushDelivery.selected')) {
    if (this.status === 'pending' || this.status === 'in-review' || this.status === 'in-progress') {
      this.calculateEstimatedDelivery();
    }
  }
  
  // Set priority based on rush delivery
  if (this.pricing.rushDelivery.selected && this.priority === 'normal') {
    this.priority = 'high';
  }
  
  next();
});

module.exports = mongoose.model('CustomEmbroideryRequest', customEmbroideryRequestSchema);