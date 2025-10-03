const mongoose = require('mongoose');

const customLogoRequestSchema = new mongoose.Schema({
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
  
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: [
      'technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing',
      'real-estate', 'hospitality', 'automotive', 'food-beverage', 'fashion',
      'sports', 'entertainment', 'non-profit', 'government', 'startup', 'other'
    ]
  },
  
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Design Preferences
  logoStyle: {
    type: String,
    required: [true, 'Logo style is required'],
    enum: [
      'minimalist', 'modern', 'vintage', 'corporate', 'creative', 'elegant',
      'bold', 'playful', 'professional', 'artistic', 'geometric', 'abstract',
      'typography', 'mascot', 'emblem', 'wordmark', 'combination', 'other'
    ]
  },
  
  colorPreferences: {
    type: [String],
    default: []
  },
  
  inspirationText: {
    type: String,
    trim: true,
    maxlength: [500, 'Inspiration text cannot exceed 500 characters']
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
  
  // Communication
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
  
  // Metadata
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

// Indexes
customLogoRequestSchema.index({ user: 1 });
customLogoRequestSchema.index({ status: 1 });
customLogoRequestSchema.index({ priority: 1 });
customLogoRequestSchema.index({ industry: 1 });
customLogoRequestSchema.index({ logoStyle: 1 });
customLogoRequestSchema.index({ createdAt: -1 });
customLogoRequestSchema.index({ estimatedDelivery: 1 });

// Text search index
customLogoRequestSchema.index({
  businessName: 'text',
  description: 'text',
  inspirationText: 'text'
});

// Virtual for days until delivery
customLogoRequestSchema.virtual('daysUntilDelivery').get(function() {
  if (!this.estimatedDelivery) return null;
  const today = new Date();
  const delivery = new Date(this.estimatedDelivery);
  const diffTime = delivery - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for request age
customLogoRequestSchema.virtual('requestAge').get(function() {
  const today = new Date();
  const created = new Date(this.createdAt);
  const diffTime = today - created;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Method to calculate estimated delivery
customLogoRequestSchema.methods.calculateEstimatedDelivery = function() {
  const baseDeliveryDays = {
    basic: 7,
    premium: 5,
    enterprise: 3
  };
  
  let deliveryDays = baseDeliveryDays[this.selectedPackage] || 7;
  
  // Reduce delivery time for rush orders
  if (this.pricing.rushDelivery.selected) {
    deliveryDays = Math.max(1, Math.floor(deliveryDays / 2));
  }
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + deliveryDays);
  
  this.estimatedDelivery = estimatedDate;
  return estimatedDate;
};

// Method to add revision request
customLogoRequestSchema.methods.addRevisionRequest = function(message, userId) {
  this.revisionRequests.push({
    message,
    requestedBy: userId
  });
  
  if (this.status === 'completed') {
    this.status = 'revision-requested';
  }
};

// Method to update status
customLogoRequestSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  
  if (newStatus === 'completed' && !this.actualDelivery) {
    this.actualDelivery = new Date();
  }
};

// Pre-save middleware
customLogoRequestSchema.pre('save', function(next) {
  // Calculate estimated delivery if not set
  if (!this.estimatedDelivery && this.selectedPackage) {
    this.calculateEstimatedDelivery();
  }
  
  // Calculate total price
  if (this.pricing.packagePrice !== undefined) {
    this.pricing.totalPrice = this.pricing.packagePrice + (this.pricing.rushDelivery.selected ? this.pricing.rushDelivery.additionalCost : 0);
  }
  
  next();
});

module.exports = mongoose.model('CustomLogoRequest', customLogoRequestSchema);