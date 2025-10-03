const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const query = { isActive: true };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    
    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query['price.base'] = {};
      if (req.query.minPrice) {
        query['price.base'].$gte = parseFloat(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        query['price.base'].$lte = parseFloat(req.query.maxPrice);
      }
    }
    
    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',');
      query.tags = { $in: tags };
    }
    
    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price_low':
          sortOption = { 'price.base': 1 };
          break;
        case 'price_high':
          sortOption = { 'price.base': -1 };
          break;
        case 'rating':
          sortOption = { 'ratings.average': -1 };
          break;
        case 'popular':
          sortOption = { 'ratings.count': -1 };
          break;
        case 'name':
          sortOption = { name: 1 };
          break;
      }
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean(); // Use lean for better performance
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      products
   });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// Admin routes - must come before /:id route
// @desc    Get all products for admin
// @route   GET /api/products/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Higher limit for admin
    const skip = (page - 1) * limit;
    
    const query = {}; // No isActive filter for admin
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by subcategory
    if (req.query.subcategory) {
      query.subcategory = req.query.subcategory;
    }
    
    // Search by name or description
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }
    
    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'name_asc':
          sortOption = { name: 1 };
          break;
        case 'name_desc':
          sortOption = { name: -1 };
          break;
        case 'price_low':
          sortOption = { 'price.base': 1 };
          break;
        case 'price_high':
          sortOption = { 'price.base': -1 };
          break;
        case 'category':
          sortOption = { category: 1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }
    }
    
    const products = await Product.find(query)
      .populate('createdBy', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments(query);
    
    res.status(200).json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @desc    Get product statistics for admin dashboard
// @route   GET /api/products/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const inactiveProducts = await Product.countDocuments({ isActive: false });
    
    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Calculate average price
    const priceStats = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          averagePrice: { $avg: '$price.base' },
          minPrice: { $min: '$price.base' },
          maxPrice: { $max: '$price.base' }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        inactiveProducts,
        productsByCategory,
        priceStats: priceStats[0] || {
          averagePrice: 0,
          minPrice: 0,
          maxPrice: 0
        }
      }
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product statistics'
    });
  }
});

// @desc    Activate all products
// @route   PATCH /api/products/admin/activate-all
// @access  Private/Admin
router.patch('/admin/activate-all', protect, authorize('admin'), async (req, res) => {
  try {
    const result = await Product.updateMany(
      { isActive: false },
      { $set: { isActive: true } }
    );
    
    res.status(200).json({
      success: true,
      message: `Successfully activated ${result.modifiedCount} products`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Activate all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name email role createdAt');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Check if product is active (unless user is admin or creator)
    if (!product.isActive && 
        (!req.user || 
         (req.user.role !== 'admin' && req.user._id.toString() !== product.createdBy._id.toString()))) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', [
  protect,
  authorize('admin'),
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['apparels', 'travels', 'leather', 'uniforms', 'design-services', 'embroidery', 'other'])
    .withMessage('Invalid category'),
  body('price.base')
    .isFloat({ min: 1 })
    .withMessage('Base price must be at least $1'),
  body('price.premium')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Premium price must be at least $1'),
  body('price.enterprise')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Enterprise price must be at least $1'),
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory is required'),
  body('deliveryTime.base')
    .isInt({ min: 1 })
    .withMessage('Base delivery time must be at least 1 day')
], async (req, res) => {
  try {
    console.log('Product creation request body:', JSON.stringify(req.body, null, 2));
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Product creation validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const productData = {
      ...req.body,
      createdBy: req.user._id
    };
    
    console.log('Product data before creation:', JSON.stringify(productData, null, 2));
    
    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation errors:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Product validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', [
  protect,
  authorize('admin'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['apparels', 'travels', 'leather', 'uniforms', 'design-services', 'embroidery', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Remove createdBy from update data to prevent overwriting
    const updateData = { ...req.body };
    delete updateData.createdBy;
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'name email role');
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Soft delete - just deactivate the product
    product.isActive = false;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
// Review routes are handled by reviewRoutes.js

// @desc    Get categories metadata
// @route   GET /api/products/meta/categories
// @access  Public
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', subcategories: { $addToSet: '$subcategory' } } },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/toggle-status
// @access  Private/Admin
router.patch('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while toggling product status'
    });
  }
});

module.exports = router;