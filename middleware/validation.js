const { validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// Custom validation functions
const isValidObjectId = (value) => {
  return /^[0-9a-fA-F]{24}$/.test(value);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>"'&]/g, (match) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[match];
    });
};

const validateFileUpload = (file, allowedTypes = [], maxSize = 5 * 1024 * 1024) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file provided');
    return errors;
  }
  
  // Check file size
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }
  
  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return errors;
};

const validateImageUpload = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validateFileUpload(file, allowedTypes, maxSize);
};

const validateDocumentUpload = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  return validateFileUpload(file, allowedTypes, maxSize);
};

// Rate limiting validation
const createRateLimitKey = (req, identifier = 'ip') => {
  switch (identifier) {
    case 'user':
      return req.user ? `user:${req.user.id}` : `ip:${req.ip}`;
    case 'email':
      return req.body.email ? `email:${req.body.email}` : `ip:${req.ip}`;
    default:
      return `ip:${req.ip}`;
  }
};

// Common validation chains
const commonValidations = {
  email: {
    field: 'email',
    validator: 'isEmail',
    message: 'Please provide a valid email address'
  },
  password: {
    field: 'password',
    validator: 'isLength',
    options: { min: 8 },
    message: 'Password must be at least 8 characters long'
  },
  name: {
    field: 'name',
    validator: 'isLength',
    options: { min: 2, max: 50 },
    message: 'Name must be between 2 and 50 characters'
  },
  phone: {
    field: 'phone',
    validator: 'isMobilePhone',
    message: 'Please provide a valid phone number'
  },
  mongoId: {
    validator: 'isMongoId',
    message: 'Invalid ID format'
  }
};

module.exports = {
  handleValidationErrors,
  isValidObjectId,
  isValidEmail,
  isValidPhone,
  isValidPassword,
  sanitizeInput,
  validateFileUpload,
  validateImageUpload,
  validateDocumentUpload,
  createRateLimitKey,
  commonValidations
};