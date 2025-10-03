const express = require('express');
const router = express.Router();
const CustomLogoDesign = require('../models/CustomLogoDesign');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/logo-designs');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|svg|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, svg, webp)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// @desc    Get all custom logo designs
// @route   GET /api/custom-logo-designs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.industry) filter.industry = req.query.industry;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.popular === 'true') filter.isPopular = true;
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filter['pricing.basePrice'] = {};
      if (req.query.minPrice) filter['pricing.basePrice'].$gte = parseInt(req.query.minPrice);
      if (req.query.maxPrice) filter['pricing.basePrice'].$lte = parseInt(req.query.maxPrice);
    }
    
    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price-low':
          sort = { 'pricing.basePrice': 1 };
          break;
        case 'price-high':
          sort = { 'pricing.basePrice': -1 };
          break;
        case 'rating':
          sort = { 'rating.average': -1 };
          break;
        case 'popular':
          sort = { viewCount: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    
    const designs = await CustomLogoDesign.find(filter)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await CustomLogoDesign.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: designs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: designs
    });
  } catch (error) {
    console.error('Error fetching custom logo designs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom logo designs',
      error: error.message
    });
  }
});

// @desc    Get single custom logo design
// @route   GET /api/custom-logo-designs/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const design = await CustomLogoDesign.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name avatar');
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo design not found'
      });
    }
    
    // Increment view count
    await design.incrementViewCount();
    
    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    console.error('Error fetching custom logo design:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom logo design',
      error: error.message
    });
  }
});

// @desc    Create new custom logo design
// @route   POST /api/custom-logo-designs
// @access  Private (Admin only)
router.post('/', [
  protect,
  authorize('admin'),
  upload.array('images', 10),
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('pricing.basePrice').isNumeric().withMessage('Base price must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const designData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    // Parse JSON fields
    if (req.body.colors) {
      designData.colors = JSON.parse(req.body.colors);
    }
    if (req.body.tags) {
      designData.tags = JSON.parse(req.body.tags);
    }
    if (req.body.features) {
      designData.features = JSON.parse(req.body.features);
    }
    if (req.body.customizationOptions) {
      designData.customizationOptions = JSON.parse(req.body.customizationOptions);
    }
    if (req.body.designSpecs) {
      designData.designSpecs = JSON.parse(req.body.designSpecs);
    }
    if (req.body.pricing) {
      designData.pricing = JSON.parse(req.body.pricing);
    }
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      designData.images = req.files.map((file, index) => ({
        url: `/uploads/logo-designs/${file.filename}`,
        alt: req.body.title,
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: index === 0
      }));
    }
    
    const design = await CustomLogoDesign.create(designData);
    
    res.status(201).json({
      success: true,
      message: 'Custom logo design created successfully',
      data: design
    });
  } catch (error) {
    console.error('Error creating custom logo design:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating custom logo design',
      error: error.message
    });
  }
});

// @desc    Update custom logo design
// @route   PUT /api/custom-logo-designs/:id
// @access  Private (Admin only)
router.put('/:id', [
  protect,
  authorize('admin'),
  upload.array('images', 10)
], async (req, res) => {
  try {
    const design = await CustomLogoDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo design not found'
      });
    }
    
    const updateData = { ...req.body };
    
    // Parse JSON fields
    if (req.body.colors) {
      updateData.colors = JSON.parse(req.body.colors);
    }
    if (req.body.tags) {
      updateData.tags = JSON.parse(req.body.tags);
    }
    if (req.body.features) {
      updateData.features = JSON.parse(req.body.features);
    }
    if (req.body.customizationOptions) {
      updateData.customizationOptions = JSON.parse(req.body.customizationOptions);
    }
    if (req.body.designSpecs) {
      updateData.designSpecs = JSON.parse(req.body.designSpecs);
    }
    if (req.body.pricing) {
      updateData.pricing = JSON.parse(req.body.pricing);
    }
    
    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: `/uploads/logo-designs/${file.filename}`,
        alt: updateData.title || design.title,
        caption: req.body[`imageCaption${index}`] || '',
        isPrimary: design.images.length === 0 && index === 0
      }));
      
      updateData.images = [...design.images, ...newImages];
    }
    
    const updatedDesign = await CustomLogoDesign.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Custom logo design updated successfully',
      data: updatedDesign
    });
  } catch (error) {
    console.error('Error updating custom logo design:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating custom logo design',
      error: error.message
    });
  }
});

// @desc    Delete custom logo design
// @route   DELETE /api/custom-logo-designs/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const design = await CustomLogoDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo design not found'
      });
    }
    
    // Delete associated image files
    if (design.images && design.images.length > 0) {
      design.images.forEach(image => {
        const imagePath = path.join(__dirname, '..', image.url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    await CustomLogoDesign.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Custom logo design deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom logo design:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting custom logo design',
      error: error.message
    });
  }
});

// @desc    Add review to custom logo design
// @route   POST /api/custom-logo-designs/:id/reviews
// @access  Private
router.post('/:id/reviews', [
  protect,
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const design = await CustomLogoDesign.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo design not found'
      });
    }
    
    // Check if user already reviewed this design
    const existingReview = design.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this design'
      });
    }
    
    const review = {
      user: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment || ''
    };
    
    design.reviews.push(review);
    await design.save();
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding review',
      error: error.message
    });
  }
});

// @desc    Get categories and industries
// @route   GET /api/custom-logo-designs/meta/options
// @access  Public
router.get('/meta/options', async (req, res) => {
  try {
    const categories = [
      'minimalist', 'modern', 'vintage', 'corporate', 'creative', 'elegant',
      'bold', 'playful', 'professional', 'artistic', 'geometric', 'abstract',
      'typography', 'mascot', 'emblem', 'wordmark', 'combination', 'other'
    ];
    
    const industries = [
      'technology', 'healthcare', 'finance', 'education', 'retail', 'manufacturing',
      'real-estate', 'hospitality', 'automotive', 'food-beverage', 'fashion',
      'sports', 'entertainment', 'non-profit', 'government', 'startup', 'other'
    ];
    
    res.status(200).json({
      success: true,
      data: {
        categories,
        industries
      }
    });
  } catch (error) {
    console.error('Error fetching options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching options',
      error: error.message
    });
  }
});

module.exports = router;