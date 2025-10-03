const express = require('express');
const router = express.Router();
const CustomLogoRequest = require('../models/CustomLogoRequest');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads/logo-requests');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'request-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and some document types
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|ai|psd|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || 
                   file.mimetype === 'application/pdf' ||
                   file.mimetype === 'image/svg+xml';

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP, SVG) and design files (PDF, AI, PSD) are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: fileFilter
});

// Package pricing configuration
const PACKAGE_PRICING = {
  basic: {
    price: 2999,
    deliveryDays: 7,
    features: [
      '3 Logo concepts',
      '3 Revisions included',
      'High-resolution PNG & JPG',
      'Vector SVG format',
      'Commercial usage rights'
    ]
  },
  premium: {
    price: 4999,
    deliveryDays: 5,
    features: [
      '5 Logo concepts',
      '5 Revisions included',
      'All file formats (PNG, JPG, SVG, AI, PSD)',
      'Business card design',
      'Social media kit',
      'Brand guidelines',
      'Commercial usage rights'
    ]
  },
  enterprise: {
    price: 7999,
    deliveryDays: 3,
    features: [
      'Unlimited logo concepts',
      'Unlimited revisions',
      'Complete brand identity package',
      'All file formats',
      'Letterhead design',
      'Business card design',
      'Social media kit',
      'Brand guidelines',
      'Dedicated designer',
      'Priority support',
      'Commercial usage rights'
    ]
  }
};

const RUSH_DELIVERY_COST = 1500;

// @desc    Get all custom logo requests (Admin)
// @route   GET /api/custom-logo-requests
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.industry) filter.industry = req.query.industry;
    if (req.query.logoStyle) filter.logoStyle = req.query.logoStyle;
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'newest':
          sort = { createdAt: -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'priority':
          sort = { priority: -1, createdAt: -1 };
          break;
        case 'delivery':
          sort = { estimatedDelivery: 1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }
    
    const requests = await CustomLogoRequest.find(filter)
      .populate('user', 'name email')
      .populate('assignedDesigner', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await CustomLogoRequest.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    console.error('Error fetching custom logo requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom logo requests',
      error: error.message
    });
  }
});

// @desc    Get user's custom logo requests
// @route   GET /api/custom-logo-requests/my-requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const requests = await CustomLogoRequest.find({ user: req.user.id })
      .populate('assignedDesigner', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await CustomLogoRequest.countDocuments({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your requests',
      error: error.message
    });
  }
});

// @desc    Get single custom logo request
// @route   GET /api/custom-logo-requests/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await CustomLogoRequest.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedDesigner', 'name email')
      .populate('revisionRequests.requestedBy', 'name');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo request not found'
      });
    }
    
    // Check if user owns this request or is admin
    if (request.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this request'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching custom logo request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom logo request',
      error: error.message
    });
  }
});

// @desc    Create new custom logo request
// @route   POST /api/custom-logo-requests
// @access  Private
router.post('/', [
  protect,
  upload.array('images', 5),
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('industry').notEmpty().withMessage('Industry is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('logoStyle').notEmpty().withMessage('Logo style is required'),
  body('selectedPackage').isIn(['basic', 'premium', 'enterprise']).withMessage('Valid package selection is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required')
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
    
    const {
      businessName,
      industry,
      description,
      logoStyle,
      colorPreferences,
      inspirationText,
      selectedPackage,
      rushDelivery,
      contactEmail,
      contactPhone
    } = req.body;
    
    // Calculate pricing
    const packageInfo = PACKAGE_PRICING[selectedPackage];
    const isRushDelivery = rushDelivery === 'true' || rushDelivery === true;
    const rushCost = isRushDelivery ? RUSH_DELIVERY_COST : 0;
    
    // Handle uploaded images
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        uploadedImages.push({
          url: `/uploads/logo-requests/${file.filename}`,
          originalName: file.originalname,
          description: req.body[`imageDescription${index}`] || ''
        });
      });
    }
    
    // Create request data
    const requestData = {
      user: req.user.id,
      businessName,
      industry,
      description,
      logoStyle,
      colorPreferences: colorPreferences ? JSON.parse(colorPreferences) : [],
      inspirationText,
      uploadedImages,
      selectedPackage,
      pricing: {
        packagePrice: packageInfo.price,
        rushDelivery: {
          selected: isRushDelivery,
          additionalCost: rushCost
        },
        totalPrice: packageInfo.price + rushCost
      },
      contactEmail,
      contactPhone,
      priority: isRushDelivery ? 'high' : 'normal'
    };
    
    const logoRequest = await CustomLogoRequest.create(requestData);
    
    // Populate the created request
    await logoRequest.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Custom logo request submitted successfully',
      data: logoRequest
    });
  } catch (error) {
    console.error('Error creating custom logo request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating custom logo request',
      error: error.message
    });
  }
});

// @desc    Update custom logo request status (Admin)
// @route   PUT /api/custom-logo-requests/:id/status
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('status').isIn(['pending', 'in-review', 'in-progress', 'revision-requested', 'completed', 'cancelled']).withMessage('Valid status is required')
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
    
    const request = await CustomLogoRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo request not found'
      });
    }
    
    const { status, adminNotes, assignedDesigner } = req.body;
    
    request.updateStatus(status);
    if (adminNotes) request.adminNotes = adminNotes;
    if (assignedDesigner) request.assignedDesigner = assignedDesigner;
    
    await request.save();
    
    await request.populate('user', 'name email');
    await request.populate('assignedDesigner', 'name email');
    
    res.status(200).json({
      success: true,
      message: 'Request status updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating request status',
      error: error.message
    });
  }
});

// @desc    Add revision request
// @route   POST /api/custom-logo-requests/:id/revision
// @access  Private
router.post('/:id/revision', [
  protect,
  body('message').notEmpty().withMessage('Revision message is required')
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
    
    const request = await CustomLogoRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo request not found'
      });
    }
    
    // Check if user owns this request
    if (request.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to request revisions for this request'
      });
    }
    
    request.addRevisionRequest(req.body.message, req.user.id);
    await request.save();
    
    await request.populate('revisionRequests.requestedBy', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Revision request added successfully',
      data: request
    });
  } catch (error) {
    console.error('Error adding revision request:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding revision request',
      error: error.message
    });
  }
});

// @desc    Upload final designs (Admin)
// @route   POST /api/custom-logo-requests/:id/final-designs
// @access  Private/Admin
router.post('/:id/final-designs', [
  protect,
  authorize('admin'),
  upload.array('designs', 10)
], async (req, res) => {
  try {
    const request = await CustomLogoRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo request not found'
      });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No design files uploaded'
      });
    }
    
    // Add final designs
    const finalDesigns = req.files.map((file, index) => ({
      url: `/uploads/logo-requests/${file.filename}`,
      format: path.extname(file.originalname).toLowerCase().replace('.', ''),
      description: req.body[`designDescription${index}`] || ''
    }));
    
    request.finalDesigns.push(...finalDesigns);
    request.updateStatus('completed');
    
    await request.save();
    
    res.status(200).json({
      success: true,
      message: 'Final designs uploaded successfully',
      data: request
    });
  } catch (error) {
    console.error('Error uploading final designs:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading final designs',
      error: error.message
    });
  }
});

// @desc    Get package pricing
// @route   GET /api/custom-logo-requests/pricing/packages
// @access  Public
router.get('/pricing/packages', async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        packages: PACKAGE_PRICING,
        rushDeliveryCost: RUSH_DELIVERY_COST
      }
    });
  } catch (error) {
    console.error('Error fetching package pricing:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching package pricing',
      error: error.message
    });
  }
});

// @desc    Delete custom logo request
// @route   DELETE /api/custom-logo-requests/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await CustomLogoRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom logo request not found'
      });
    }
    
    // Delete associated files
    const allFiles = [...request.uploadedImages, ...request.finalDesigns];
    allFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    await CustomLogoRequest.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Custom logo request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom logo request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting custom logo request',
      error: error.message
    });
  }
});

// @desc    Export custom logo requests as CSV
// @route   GET /api/custom-logo-requests/export/csv
// @access  Private/Admin
router.get('/export/csv', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await CustomLogoRequest.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Create CSV headers
    const csvHeaders = [
      'Business Name',
      'Customer Name',
      'Customer Email',
      'Industry',
      'Logo Style',
      'Status',
      'Package',
      'Total Price',
      'Rush Delivery',
      'Description',
      'Color Preferences',
      'Request Date',
      'Estimated Delivery',
      'Contact Email',
      'Contact Phone'
    ];

    // Create CSV rows
    const csvRows = requests.map(request => {
      return [
        request.businessName || 'N/A',
        request.user?.name || 'N/A',
        request.user?.email || 'N/A',
        request.industry || 'N/A',
        request.logoStyle || 'N/A',
        request.status || 'pending',
        request.selectedPackage || 'N/A',
        request.pricing?.totalPrice || 0,
        request.pricing?.rushDelivery ? 'Yes' : 'No',
        request.description || 'N/A',
        request.colorPreferences || 'N/A',
        request.createdAt.toISOString().split('T')[0],
        request.estimatedDelivery ? request.estimatedDelivery.toISOString().split('T')[0] : 'N/A',
        request.contactEmail || 'N/A',
        request.contactPhone || 'N/A'
      ];
    });

    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Set response headers for CSV download
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="logo_requests_export_${timestamp}.csv"`);
    
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export logo requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting logo requests'
    });
  }
});

module.exports = router;