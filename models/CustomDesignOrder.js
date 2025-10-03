const mongoose = require('mongoose');

const customDesignOrderSchema = new mongoose.Schema({
  // Order Information
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Product Information
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productCategory: {
    type: String,
    required: true,
    enum: ['apparels', 'travels', 'leather', 'uniforms']
  },
  productSubcategory: {
    type: String,
    required: true
  },
  
  // Product Customization
  productOptions: {
    color: String,
    size: String,
    material: String,
    style: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  
  // Design Information
  designType: {
    type: String,
    required: true,
    enum: ['logo', 'embroidery', 'text', 'custom-design']
  },
  uploadedDesign: {
    url: {
      type: String,
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      required: true,
      enum: ['png', 'jpg', 'jpeg', 'svg', 'pdf']
    },
    fileSize: {
      type: Number,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  
  // Design Placement & Specifications
  designPlacements: [{
    position: {
      type: String,
      required: true,
      enum: ['front-center', 'front-left-chest', 'front-right-chest', 'back-center', 'back-upper', 'sleeve-left', 'sleeve-right', 'collar', 'pocket', 'custom']
    },
    coordinates: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 }
    },
    dimensions: {
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      unit: { type: String, enum: ['cm', 'inch', 'px'], default: 'cm' }
    },
    rotation: {
      type: Number,
      default: 0,
      min: 0,
      max: 360
    },
    designUrl: String // For multiple designs on same product
  }],
  
  // Embroidery Specific Options (if applicable)
  embroideryOptions: {
    stitchType: {
      type: String,
      enum: ['satin', 'fill', 'running', 'chain', 'cross']
    },
    threadColors: [{
      color: String,
      colorCode: String,
      threadType: String
    }],
    density: {
      type: String,
      enum: ['light', 'medium', 'heavy']
    },
    backing: {
      type: String,
      enum: ['cutaway', 'tearaway', 'washaway']
    }
  },
  
  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    designCost: {
      type: Number,
      default: 0
    },
    placementCost: {
      type: Number,
      default: 0
    },
    rushOrderCost: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  
  // Special Instructions
  specialInstructions: {
    type: String,
    maxlength: 1000
  },
  designNotes: {
    type: String,
    maxlength: 500
  },
  
  // Delivery Information
  deliveryOptions: {
    type: {
      type: String,
      enum: ['standard', 'express', 'rush'],
      default: 'standard'
    },
    estimatedDays: {
      type: Number,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'design-review', 'approved', 'in-production', 'quality-check', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Communication
  messages: [{
    sender: {
      type: String,
      enum: ['customer', 'retailer', 'admin']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      url: String,
      type: String,
      name: String
    }]
  }],
  
  // Approval & Production
  designApproval: {
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    revisionCount: {
      type: Number,
      default: 0
    }
  },
  
  // Production Details
  production: {
    startedAt: Date,
    completedAt: Date,
    qualityCheckBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    qualityNotes: String,
    productionImages: [{
      url: String,
      description: String,
      stage: String // 'in-progress', 'completed', 'quality-check'
    }]
  },
  
  // Shipping
  shipping: {
    trackingNumber: String,
    carrier: String,
    shippedAt: Date,
    deliveredAt: Date,
    shippingCost: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
customDesignOrderSchema.index({ customer: 1, createdAt: -1 });
customDesignOrderSchema.index({ orderNumber: 1 });
customDesignOrderSchema.index({ status: 1 });
customDesignOrderSchema.index({ product: 1 });
customDesignOrderSchema.index({ designType: 1 });

// Pre-save middleware to generate order number
customDesignOrderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `CDO-${Date.now()}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

// Virtual for order age
customDesignOrderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

// Method to calculate total price
customDesignOrderSchema.methods.calculateTotalPrice = function() {
  const { basePrice, designCost, placementCost, rushOrderCost } = this.pricing;
  this.pricing.totalPrice = (basePrice + designCost + placementCost + rushOrderCost) * this.quantity;
  return this.pricing.totalPrice;
};

// Method to update status with timestamp
customDesignOrderSchema.methods.updateStatus = function(newStatus, userId = null) {
  this.status = newStatus;
  
  // Add status change message
  this.messages.push({
    sender: 'admin',
    message: `Order status updated to: ${newStatus}`,
    timestamp: new Date()
  });
  
  // Update specific timestamps based on status
  switch(newStatus) {
    case 'approved':
      this.designApproval.isApproved = true;
      this.designApproval.approvedAt = new Date();
      if (userId) this.designApproval.approvedBy = userId;
      break;
    case 'in-production':
      this.production.startedAt = new Date();
      break;
    case 'shipped':
      this.shipping.shippedAt = new Date();
      break;
    case 'delivered':
      this.shipping.deliveredAt = new Date();
      break;
  }
};

customDesignOrderSchema.set('toJSON', { virtuals: true });
customDesignOrderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('CustomDesignOrder', customDesignOrderSchema);