const mongoose = require('mongoose');

const customLogoDesignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Logo design title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  category: {
    type: String,
    enum: {
      values: [
        'minimalist', 'modern', 'vintage', 'corporate', 'creative', 'elegant',
        'bold', 'playful', 'professional', 'artistic', 'geometric', 'abstract',
        'typography', 'mascot', 'emblem', 'wordmark', 'combination', 'other'
      ],
      message: 'Please select a valid logo category'
    },
    required: true
  },
  industry: {
    type: String,
    enum: {
      values: [
        'technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing',
        'real-estate', 'hospitality', 'automotive', 'food-beverage', 'fashion',
        'sports', 'entertainment', 'non-profit', 'government', 'startup', 'other'
      ],
      message: 'Please select a valid industry'
    },
    required: true
  },
  colors: [{
    name: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      required: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Please enter a valid hex color']
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  designSpecs: {
    dimensions: {
      width: Number,
      height: Number,
      unit: {
        type: String,
        enum: ['px', 'mm', 'cm', 'in'],
        default: 'px'
      }
    },
    formats: [{
      type: String,
      enum: ['png', 'jpg', 'svg', 'pdf', 'ai', 'eps', 'psd'],
      default: 'png'
    }],
    resolution: {
      type: Number,
      default: 300
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    revisions: {
      included: {
        type: Number,
        default: 3
      },
      additionalCost: {
        type: Number,
        default: 500
      }
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: 1
    },
    rushDelivery: {
      available: {
        type: Boolean,
        default: true
      },
      additionalCost: {
        type: Number,
        default: 1000
      },
      timeReduction: {
        type: Number,
        default: 2
      }
    }
  },
  features: [{
    type: String,
    trim: true
  }],
  portfolio: [{
    title: String,
    image: String,
    description: String,
    client: String,
    year: Number
  }],
  customizationOptions: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    additionalCost: {
      type: Number,
      default: 0
    },
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Review comment cannot be more than 500 characters']
    },
    images: [String],
    isVerified: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  orderCount: {
    type: Number,
    default: 0
  },
  seo: {
    title: {
      type: String,
      maxlength: [60, 'SEO title cannot be more than 60 characters']
    },
    description: {
      type: String,
      maxlength: [160, 'SEO description cannot be more than 160 characters']
    },
    keywords: [String]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
customLogoDesignSchema.index({ category: 1 });
customLogoDesignSchema.index({ industry: 1 });
customLogoDesignSchema.index({ isActive: 1 });
customLogoDesignSchema.index({ isFeatured: 1 });
customLogoDesignSchema.index({ isPopular: 1 });
customLogoDesignSchema.index({ 'pricing.basePrice': 1 });
customLogoDesignSchema.index({ 'rating.average': -1 });
customLogoDesignSchema.index({ viewCount: -1 });
customLogoDesignSchema.index({ orderCount: -1 });
customLogoDesignSchema.index({ createdAt: -1 });

// Text search index
customLogoDesignSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  'seo.keywords': 'text'
});

// Virtual for primary image
customLogoDesignSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : '');
});

// Virtual for total price with rush delivery
customLogoDesignSchema.virtual('totalPriceWithRush').get(function() {
  return this.pricing.basePrice + (this.pricing.rushDelivery.available ? this.pricing.rushDelivery.additionalCost : 0);
});

// Method to update rating
customLogoDesignSchema.methods.updateRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.rating.count = this.reviews.length;
};

// Method to increment view count
customLogoDesignSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Method to increment order count
customLogoDesignSchema.methods.incrementOrderCount = function() {
  this.orderCount += 1;
  return this.save();
};

// Pre-save middleware to update rating
customLogoDesignSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    this.updateRating();
  }
  next();
});

module.exports = mongoose.model('CustomLogoDesign', customLogoDesignSchema);