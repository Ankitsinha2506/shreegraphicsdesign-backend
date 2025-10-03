const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: {
      values: [
        'apparels',
        'travels', 
        'leather',
        'uniforms',
        'design-services',
        'embroidery',
        'other'
      ],
      message: 'Please select a valid category'
    }
  },
  subcategory: {
    type: String,
    required: [true, 'Product subcategory is required'],
    enum: {
      values: [
        // Apparels
        'cap', 'jackets', 'sweatshirt', 'denim-shirt', 'windcheaters',
        // Travels
        'hand-bag', 'strolley-bags', 'travel-bags', 'back-packs', 'laptop-bags',
        // Leather
        'office-bags', 'wallets',
        // Uniforms
        'school-uniforms', 'corporate',
        // Design Services
        'logo-design', 'business-card', 'brochure', 'banner', 'poster', 'flyer', 'website-design',
        // Embroidery
        'logo-embroidery', 'text-embroidery', 'custom-patches', 'monogramming', 'applique', 'thread-work', 'beadwork', 'sequin-work', 'machine-embroidery', 'hand-embroidery',
        // Other
        'other'
      ],
      message: 'Please select a valid subcategory'
    },
    trim: true
  },
  price: {
    base: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    premium: {
      type: Number,
      min: [0, 'Premium price cannot be negative']
    },
    enterprise: {
      type: Number,
      min: [0, 'Enterprise price cannot be negative']
    }
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
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  features: {
    base: [{
      type: String,
      trim: true
    }],
    premium: [{
      type: String,
      trim: true
    }],
    enterprise: [{
      type: String,
      trim: true
    }]
  },
  customizationOptions: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'color', 'size', 'style', 'format'],
      required: true
    },
    options: [{
      label: String,
      value: String,
      additionalCost: {
        type: Number,
        default: 0
      }
    }],
    required: {
      type: Boolean,
      default: false
    }
  }],
  deliveryTime: {
    base: {
      type: Number, // in days
      required: true,
      min: 1
    },
    premium: {
      type: Number,
      min: 1
    },
    enterprise: {
      type: Number,
      min: 1
    }
  },
  revisions: {
    base: {
      type: Number,
      default: 2
    },
    premium: {
      type: Number,
      default: 5
    },
    enterprise: {
      type: Number,
      default: -1 // unlimited
    }
  },
  portfolio: [{
    title: String,
    image: String,
    description: String
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
  reviewCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  seoTitle: {
    type: String,
    maxlength: 60
  },
  seoDescription: {
    type: String,
    maxlength: 160
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ 'price.base': 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });

// Text index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Virtual for primary image
productSchema.virtual('primaryImage').get(function() {
  if (!this.images || !Array.isArray(this.images) || this.images.length === 0) {
    return null;
  }
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg || this.images[0] || null;
});

// Method to calculate average rating
// Virtual for getting reviews count
productSchema.virtual('reviewsCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  count: true
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);