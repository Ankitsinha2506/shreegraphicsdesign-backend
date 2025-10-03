const express = require('express');
const router = express.Router();
const CustomDesignOrder = require('../models/CustomDesignOrder');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect: auth, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for design file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = 'uploads/custom-designs';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'design-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (PNG, JPG, SVG) and PDF files are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// @route   POST /api/custom-design-orders
// @desc    Create a new custom design order
// @access  Private
router.post('/', auth, upload.single('designFile'), async (req, res) => {
  try {
    const {
      productId,
      productOptions,
      quantity,
      designType,
      designPlacements,
      embroideryOptions,
      specialInstructions,
      designNotes,
      deliveryType,
      deliveryAddress
    } = req.body;

    // Validate required fields
    if (!productId || !quantity || !designType) {
      return res.status(400).json({
        success: false,
        message: 'Product ID, quantity, and design type are required'
      });
    }

    // Check if design file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Design file is required'
      });
    }

    // Fetch product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Parse design placements if it's a string
    let parsedPlacements = [];
    if (designPlacements) {
      try {
        parsedPlacements = typeof designPlacements === 'string' 
          ? JSON.parse(designPlacements) 
          : designPlacements;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid design placements format'
        });
      }
    }

    // Parse embroidery options if provided
    let parsedEmbroideryOptions = null;
    if (embroideryOptions) {
      try {
        parsedEmbroideryOptions = typeof embroideryOptions === 'string'
          ? JSON.parse(embroideryOptions)
          : embroideryOptions;
      } catch (error) {
        console.log('Invalid embroidery options format, using null');
      }
    }

    // Parse delivery address if provided
    let parsedDeliveryAddress = null;
    if (deliveryAddress) {
      try {
        parsedDeliveryAddress = typeof deliveryAddress === 'string'
          ? JSON.parse(deliveryAddress)
          : deliveryAddress;
      } catch (error) {
        console.log('Invalid delivery address format, using null');
      }
    }

    // Calculate pricing
    const basePrice = product.price?.base || product.price || 0;
    const designCost = calculateDesignCost(designType, parsedPlacements);
    const placementCost = calculatePlacementCost(parsedPlacements);
    const rushOrderCost = deliveryType === 'rush' ? basePrice * 0.5 : 0;
    const totalPrice = (basePrice + designCost + placementCost + rushOrderCost) * quantity;

    // Calculate delivery time
    const estimatedDays = calculateDeliveryTime(deliveryType, designType);

    // Create custom design order
    const customOrder = new CustomDesignOrder({
      customer: req.user.id,
      product: productId,
      productName: product.name,
      productCategory: product.category,
      productSubcategory: product.subcategory,
      productOptions: productOptions ? JSON.parse(productOptions) : {},
      quantity: parseInt(quantity),
      designType,
      uploadedDesign: {
        url: `/uploads/custom-designs/${req.file.filename}`,
        originalName: req.file.originalname,
        fileType: path.extname(req.file.originalname).toLowerCase().substring(1),
        fileSize: req.file.size
      },
      designPlacements: parsedPlacements,
      embroideryOptions: parsedEmbroideryOptions,
      pricing: {
        basePrice,
        designCost,
        placementCost,
        rushOrderCost,
        totalPrice
      },
      specialInstructions,
      designNotes,
      deliveryOptions: {
        type: deliveryType || 'standard',
        estimatedDays,
        address: parsedDeliveryAddress
      }
    });

    await customOrder.save();

    // Populate the order with product and customer details
    await customOrder.populate([
      { path: 'product', select: 'name category subcategory images' },
      { path: 'customer', select: 'name email phone' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Custom design order created successfully',
      order: customOrder
    });

  } catch (error) {
    console.error('Error creating custom design order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating custom design order',
      error: error.message
    });
  }
});

// @route   GET /api/custom-design-orders
// @desc    Get all custom design orders for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { customer: req.user.id };
    if (status) {
      query.status = status;
    }

    const orders = await CustomDesignOrder.find(query)
      .populate('product', 'name category subcategory images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CustomDesignOrder.countDocuments(query);

    res.json({
      success: true,
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Error fetching custom design orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// @route   GET /api/custom-design-orders/admin
// @desc    Get all custom design orders for admin dashboard
// @access  Private/Admin
router.get('/admin', auth, authorize('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    
    // Search filter
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { designType: { $regex: search, $options: 'i' } },
        { specialInstructions: { $regex: search, $options: 'i' } }
      ];
    }
    
    const orders = await CustomDesignOrder.find(filter)
      .populate('customer', 'name email phone')
      .populate('product', 'name category subcategory images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    const total = await CustomDesignOrder.countDocuments(filter);
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.pricing?.totalPrice || 0);
    }, 0);
    
    res.json({
      success: true,
      count: orders.length,
      total,
      totalRevenue,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      orders
    });
    
  } catch (error) {
    console.error('Error fetching admin custom design orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin orders',
      error: error.message
    });
  }
});

// @route   GET /api/custom-design-orders/:id
// @desc    Get a specific custom design order
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await CustomDesignOrder.findOne({
      _id: req.params.id,
      customer: req.user.id
    }).populate([
      { path: 'product', select: 'name category subcategory images features' },
      { path: 'customer', select: 'name email phone' }
    ]);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Custom design order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching custom design order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
      error: error.message
    });
  }
});

// @route   PUT /api/custom-design-orders/:id/cancel
// @desc    Cancel a custom design order
// @access  Private
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await CustomDesignOrder.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Custom design order not found'
      });
    }

    // Check if order can be cancelled
    if (['in-production', 'quality-check', 'shipped', 'delivered'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.updateStatus('cancelled');
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Error cancelling custom design order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order',
      error: error.message
    });
  }
});

// @route   POST /api/custom-design-orders/:id/message
// @desc    Add a message to the order
// @access  Private
router.post('/:id/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const order = await CustomDesignOrder.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Custom design order not found'
      });
    }

    order.messages.push({
      sender: 'customer',
      message,
      timestamp: new Date()
    });

    await order.save();

    res.json({
      success: true,
      message: 'Message added successfully',
      order
    });

  } catch (error) {
    console.error('Error adding message to order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding message',
      error: error.message
    });
  }
});

// Helper functions
function calculateDesignCost(designType, placements) {
  const baseCosts = {
    'logo': 50,
    'embroidery': 100,
    'text': 25,
    'custom-design': 150
  };
  
  const baseCost = baseCosts[designType] || 50;
  const placementMultiplier = placements.length > 1 ? 1.5 : 1;
  
  return baseCost * placementMultiplier;
}

function calculatePlacementCost(placements) {
  if (!placements || placements.length === 0) return 0;
  
  // First placement is free, additional placements cost extra
  const additionalPlacements = Math.max(0, placements.length - 1);
  return additionalPlacements * 30; // ₹30 per additional placement
}

function calculateDeliveryTime(deliveryType, designType) {
  const baseDays = {
    'logo': 3,
    'embroidery': 7,
    'text': 2,
    'custom-design': 5
  };
  
  const baseTime = baseDays[designType] || 3;
  
  switch (deliveryType) {
    case 'rush':
      return Math.max(1, Math.floor(baseTime / 2));
    case 'express':
      return Math.max(2, Math.floor(baseTime * 0.7));
    default:
      return baseTime;
  }
}

module.exports = router;