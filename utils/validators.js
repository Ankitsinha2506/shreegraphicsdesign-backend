const { body, param, query } = require('express-validator');

// Common validation rules
const validationRules = {
  // User validation rules
  user: {
    name: body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    
    email: body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    
    password: body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
    phone: body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    
    role: body('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin')
  },
  
  // Product validation rules
  product: {
    name: body('name')
      .trim()
      .isLength({ min: 3, max: 100 })
      .withMessage('Product name must be between 3 and 100 characters'),
    
    description: body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    
    category: body('category')
      .isIn(['logo-design', 'business-card', 'brochure', 'banner', 'packaging', 'web-design'])
      .withMessage('Invalid category'),
    
    price: body('price')
      .isFloat({ min: 1 })
      .withMessage('Price must be at least $1'),
    
    tags: body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array')
      .custom((tags) => {
        if (tags.length > 10) {
          throw new Error('Maximum 10 tags allowed');
        }
        return true;
      })
  },
  
  // Order validation rules
  order: {
    items: body('items')
      .isArray({ min: 1 })
      .withMessage('Order must contain at least one item'),
    
    tier: body('items.*.tier')
      .isIn(['basic', 'standard', 'premium'])
      .withMessage('Invalid pricing tier'),
    
    quantity: body('items.*.quantity')
      .isInt({ min: 1, max: 10 })
      .withMessage('Quantity must be between 1 and 10'),
    
    status: body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'in-progress', 'review', 'revision', 'completed', 'cancelled'])
      .withMessage('Invalid order status')
  },
  
  // Common validation rules
  common: {
    mongoId: (field = 'id') => param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),
    
    pagination: [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
    ],
    
    search: query('search')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search query must be between 1 and 100 characters'),
    
    dateRange: [
      query('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid ISO 8601 date'),
      
      query('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid ISO 8601 date')
        .custom((endDate, { req }) => {
          if (req.query.startDate && new Date(endDate) < new Date(req.query.startDate)) {
            throw new Error('End date must be after start date');
          }
          return true;
        })
    ]
  }
};

// Validation rule sets for different endpoints
const validationSets = {
  // User validation sets
  userRegister: [
    validationRules.user.name,
    validationRules.user.email,
    validationRules.user.password,
    validationRules.user.phone
  ],
  
  userLogin: [
    validationRules.user.email,
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  
  userUpdate: [
    validationRules.user.name.optional(),
    validationRules.user.email.optional(),
    validationRules.user.phone,
    validationRules.user.role
  ],
  
  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    validationRules.user.password
  ],
  
  // Product validation sets
  productCreate: [
    validationRules.product.name,
    validationRules.product.description,
    validationRules.product.category,
    body('priceTiers.basic.price')
      .isFloat({ min: 1 })
      .withMessage('Basic price must be at least $1'),
    body('priceTiers.standard.price')
      .optional()
      .isFloat({ min: 1 })
      .withMessage('Standard price must be at least $1'),
    body('priceTiers.premium.price')
      .optional()
      .isFloat({ min: 1 })
      .withMessage('Premium price must be at least $1'),
    validationRules.product.tags
  ],
  
  productUpdate: [
    validationRules.product.name.optional(),
    validationRules.product.description.optional(),
    validationRules.product.category.optional(),
    validationRules.product.tags
  ],
  
  // Order validation sets
  orderCreate: [
    validationRules.order.items,
    body('items.*.product')
      .isMongoId()
      .withMessage('Invalid product ID'),
    validationRules.order.tier,
    validationRules.order.quantity,
    body('shippingAddress.fullName')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Full name is required'),
    body('shippingAddress.email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Valid email is required'),
    body('shippingAddress.phone')
      .isMobilePhone()
      .withMessage('Valid phone number is required'),
    body('specialInstructions')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Special instructions cannot exceed 500 characters')
  ],
  
  orderStatusUpdate: [
    validationRules.order.status,
    body('message')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Message cannot exceed 500 characters')
  ],
  
  // Review validation sets
  addReview: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('comment')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Comment cannot exceed 500 characters')
  ],
  
  // Communication validation sets
  addCommunication: [
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('type')
      .optional()
      .isIn(['message', 'file_upload', 'revision_request', 'status_update'])
      .withMessage('Invalid communication type')
  ],
  
  // Common validation sets
  withPagination: validationRules.common.pagination,
  withSearch: [validationRules.common.search],
  withDateRange: validationRules.common.dateRange,
  withMongoId: (field = 'id') => [validationRules.common.mongoId(field)]
};

// Custom validation functions
const customValidators = {
  // Check if email is unique
  isEmailUnique: async (email, { req }) => {
    const User = require('../models/User');
    const existingUser = await User.findOne({ email });
    
    // If updating user, exclude current user from check
    if (existingUser && (!req.user || existingUser._id.toString() !== req.user._id.toString())) {
      throw new Error('Email is already registered');
    }
    
    return true;
  },
  
  // Check if product exists and is active
  isProductValid: async (productId) => {
    const Product = require('../models/Product');
    const product = await Product.findById(productId);
    
    if (!product || !product.isActive) {
      throw new Error('Product not found or inactive');
    }
    
    return true;
  },
  
  // Check if order belongs to user
  isOrderOwner: async (orderId, { req }) => {
    const Order = require('../models/Order');
    const order = await Order.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      throw new Error('Access denied. You can only access your own orders.');
    }
    
    return true;
  },
  
  // Validate file upload
  isValidFileUpload: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
    }
    
    if (file.size > maxSize) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
    
    return true;
  }
};

// Sanitization functions
const sanitizers = {
  // Sanitize user input
  sanitizeString: (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>"'&]/g, '');
  },
  
  // Sanitize HTML content
  sanitizeHTML: (html) => {
    if (typeof html !== 'string') return html;
    return html.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<[^>]*>/g, '')
              .trim();
  },
  
  // Sanitize search query
  sanitizeSearchQuery: (query) => {
    if (typeof query !== 'string') return query;
    return query.trim()
               .replace(/[^a-zA-Z0-9\s-_]/g, '')
               .substring(0, 100);
  }
};

module.exports = {
  validationRules,
  validationSets,
  customValidators,
  sanitizers
};