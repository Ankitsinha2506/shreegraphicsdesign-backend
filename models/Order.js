const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: false  // Will be set in pre-save hook
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    packageType: {
      type: String,
      enum: ['base', 'premium', 'enterprise'],
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    customizations: [{
      optionName: String,
      selectedValue: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    }],
    requirements: {
      type: String,
      maxlength: 2000
    },
    deliverables: [{
      fileName: String,
      fileUrl: String,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'review', 'revision-requested', 'completed', 'cancelled'],
      default: 'pending'
    },
    revisionCount: {
      type: Number,
      default: 0
    },
    notes: [{
      message: String,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  shippingAddress: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    street: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    zipCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    }
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'credit-card', 'debit-card', 'paypal', 'bank-transfer', 'upi', 'cash-on-delivery', 'cod'],
      required: true
    },
    transactionId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  communication: [{
    type: {
      type: String,
      enum: ['message', 'file', 'revision-request', 'approval', 'delivery']
    },
    content: String,
    attachments: [{
      fileName: String,
      fileUrl: String,
      fileType: String
    }],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isRead: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    submittedAt: Date
  },
  metadata: {
    source: {
      type: String,
      enum: ['website', 'admin', 'api'],
      default: 'website'
    },
    userAgent: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentInfo.paymentStatus': 1 });
orderSchema.index({ estimatedDelivery: 1 });
orderSchema.index({ priority: 1, status: 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      // Find the last order with SGD2025 prefix
      const lastOrder = await this.constructor.findOne({
        orderNumber: { $regex: '^SGD2025' }
      }).sort({ orderNumber: -1 }).lean();
      
      let sequence = 1;
      if (lastOrder) {
        // Extract sequence number from orderNumber like SGD20250001
        const lastSequence = parseInt(lastOrder.orderNumber.replace('SGD2025', ''));
        sequence = lastSequence + 1;
      }
      
      // Generate order number in format SGD2025XXXX
      this.orderNumber = `SGD2025${sequence.toString().padStart(4, '0')}`;
      console.log('Generated orderNumber:', this.orderNumber);
      
      // Validate that orderNumber was generated
      if (!this.orderNumber) {
        const error = new Error('Failed to generate orderNumber');
        console.error('OrderNumber generation failed');
        return next(error);
      }
    } catch (error) {
      console.error('Error generating orderNumber:', error);
      return next(error);
    }
  }
  next();
});

// Method to calculate estimated delivery date
orderSchema.methods.calculateEstimatedDelivery = function() {
  const maxDeliveryTime = Math.max(...this.items.map(item => {
    // Get delivery time based on package type
    const product = item.product;
    if (typeof product === 'object' && product.deliveryTime) {
      return product.deliveryTime[item.packageType] || product.deliveryTime.base;
    }
    return 7; // default 7 days
  }));
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + maxDeliveryTime);
  this.estimatedDelivery = estimatedDate;
};

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note = '') {
  this.status = newStatus;
  
  if (note) {
    this.communication.push({
      type: 'message',
      content: `Status updated to ${newStatus}. ${note}`,
      sender: this.customer // This should be updated to actual user making the change
    });
  }
  
  if (newStatus === 'completed') {
    this.actualDelivery = new Date();
  }
  
  return this.save();
};

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model('Order', orderSchema);