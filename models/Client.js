const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true,
    maxlength: [100, 'Client name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot be more than 200 characters']
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    }
  },
  industry: {
    type: String,
    trim: true,
    enum: {
      values: [
        'technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing',
        'real-estate', 'hospitality', 'automotive', 'food-beverage', 'fashion',
        'sports', 'entertainment', 'non-profit', 'government', 'other'
      ],
      message: 'Please select a valid industry'
    }
  },
  clientType: {
    type: String,
    enum: ['individual', 'small-business', 'enterprise', 'non-profit'],
    default: 'individual'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  preferredServices: [{
    type: String,
    enum: [
      'logo-design', 'business-card', 'brochure', 'banner', 'poster', 'flyer', 'website-design',
      'cap', 'jackets', 'sweatshirt', 'denim-shirt', 'windcheaters', 'school-uniforms',
      'hand-bag', 'strolley-bags', 'travel-bags', 'back-packs', 'laptop-bags', 'office-bags', 'wallets',
      'corporate', 'embroidery', 'other'
    ]
  }],
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'prospect', 'archived'],
    default: 'active'
  },
  lastContactDate: {
    type: Date,
    default: Date.now
  },
  referralSource: {
    type: String,
    enum: ['website', 'social-media', 'referral', 'advertisement', 'cold-call', 'other'],
    default: 'website'
  },
  avatar: {
    type: String,
    default: ''
  },
  socialMedia: {
    website: String,
    linkedin: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  isActive: {
    type: Boolean,
    default: true
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
clientSchema.index({ email: 1 });
clientSchema.index({ company: 1 });
clientSchema.index({ clientType: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ industry: 1 });
clientSchema.index({ createdAt: -1 });
clientSchema.index({ totalSpent: -1 });

// Text search index
clientSchema.index({
  name: 'text',
  email: 'text',
  company: 'text',
  notes: 'text'
});

// Virtual for full address
clientSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  if (!addr.street && !addr.city && !addr.state) return '';
  
  const parts = [];
  if (addr.street) parts.push(addr.street);
  if (addr.city) parts.push(addr.city);
  if (addr.state) parts.push(addr.state);
  if (addr.zipCode) parts.push(addr.zipCode);
  if (addr.country) parts.push(addr.country);
  
  return parts.join(', ');
});

// Virtual for project count
clientSchema.virtual('projectCount').get(function() {
  return this.projects ? this.projects.length : 0;
});

// Method to update total spent
clientSchema.methods.updateTotalSpent = async function() {
  const Order = mongoose.model('Order');
  const result = await Order.aggregate([
    { $match: { customer: this._id, 'paymentInfo.paymentStatus': 'completed' } },
    { $group: { _id: null, total: { $sum: '$pricing.total' } } }
  ]);
  
  this.totalSpent = result.length > 0 ? result[0].total : 0;
  return this.save();
};

module.exports = mongoose.model('Client', clientSchema);