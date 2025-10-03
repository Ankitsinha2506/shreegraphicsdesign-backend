const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const CustomEmbroideryRequest = require('../models/CustomEmbroideryRequest');
const { protect, authorize } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/embroidery-requests/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'embroidery-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|svg|webp|pdf|ai|psd/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, SVG, WebP) and design files (PDF, AI, PSD) are allowed'));
    }
  }
});

// Package pricing configuration
const PACKAGE_PRICING = {
  basic: {
    price: 299,
    deliveryDays: 7,
    features: ['Basic embroidery design', 'Standard thread colors', 'Single placement', 'Digital preview']
  },
  premium: {
    price: 599,
    deliveryDays: 5,
    features: ['Custom embroidery design', 'Premium thread colors', 'Multiple placements', 'Digital preview', '2 revisions']
  },
  enterprise: {
    price: 999,
    deliveryDays: 3,
    features: ['Premium embroidery design', 'Luxury thread colors', 'Complex placements', 'Digital preview', 'Unlimited revisions', 'Priority support']
  }
};

const RUSH_DELIVERY_COST = 200;

// @desc    Get all custom embroidery requests (Admin)
// @route   GET /api/custom-embroidery-requests
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
    if (req.query.embroideryType) filter.embroideryType = req.query.embroideryType;
    if (req.query.garmentType) filter.garmentType = req.query.garmentType;
    
    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate) filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate) filter.createdAt.$lte = new Date(req.query.endDate);
    }
    
    // Search filter
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    const requests = await CustomEmbroideryRequest.find(filter)
      .populate('user', 'name email')
      .populate('assignedDesigner', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await CustomEmbroideryRequest.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: requests
    });
  } catch (error) {
    console.error('Error fetching custom embroidery requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom embroidery requests',
      error: error.message
    });
  }
});

// @desc    Get user's custom embroidery requests
// @route   GET /api/custom-embroidery-requests/my-requests
// @access  Private
router.get('/my-requests', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const requests = await CustomEmbroideryRequest.find({ user: req.user.id })
      .populate('assignedDesigner', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await CustomEmbroideryRequest.countDocuments({ user: req.user.id });
    
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

// @desc    Get single custom embroidery request
// @route   GET /api/custom-embroidery-requests/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await CustomEmbroideryRequest.findById(req.params.id)
      .populate('user', 'name email')
      .populate('assignedDesigner', 'name email')
      .populate('revisionRequests.requestedBy', 'name');
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom embroidery request not found'
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
    console.error('Error fetching custom embroidery request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching custom embroidery request',
      error: error.message
    });
  }
});

// @desc    Create new custom embroidery request
// @route   POST /api/custom-embroidery-requests
// @access  Private
router.post('/', [
  protect,
  upload.array('images', 5),
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('contactPerson').notEmpty().withMessage('Contact person is required'),
  body('embroideryType').notEmpty().withMessage('Embroidery type is required'),
  body('garmentType').notEmpty().withMessage('Garment type is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('threadColors').notEmpty().withMessage('Thread colors are required'),
  body('placement').notEmpty().withMessage('Placement is required'),
  body('size').notEmpty().withMessage('Size is required'),
  body('designDescription').notEmpty().withMessage('Design description is required'),
  body('budget').notEmpty().withMessage('Budget is required'),
  body('deadline').isISO8601().withMessage('Valid deadline is required'),
  body('selectedPackage').isIn(['basic', 'premium', 'enterprise']).withMessage('Valid package selection is required'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required')
], async (req, res) => {
  try {
    console.log('=== Custom Embroidery Request Data ===');
    console.log('Request body:', req.body);
    console.log('Placement value:', req.body.placement);
    console.log('Budget value:', req.body.budget);
    console.log('=====================================');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    
    const {
      businessName, contactPerson, embroideryType, garmentType, quantity,
      threadColors, placement, size, designDescription, specialRequirements,
      budget, deadline, selectedPackage, contactEmail, contactPhone
    } = req.body;
    
    // Get package pricing
    const packageInfo = PACKAGE_PRICING[selectedPackage];
    if (!packageInfo) {
      return res.status(400).json({
        success: false,
        message: 'Invalid package selection'
      });
    }
    
    // Handle rush delivery
    const isRushDelivery = req.body.rushDelivery === 'true' || req.body.rushDelivery === true;
    const rushCost = isRushDelivery ? RUSH_DELIVERY_COST : 0;
    
    // Handle uploaded images
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        uploadedImages.push({
          url: `/uploads/embroidery-requests/${file.filename}`,
          originalName: file.originalname,
          description: req.body[`imageDescription${index}`] || ''
        });
      });
    }
    
    // Create request data
    const requestData = {
      user: req.user.id,
      businessName,
      contactPerson,
      embroideryType,
      garmentType,
      quantity: parseInt(quantity),
      threadColors,
      placement,
      size,
      designDescription,
      specialRequirements,
      budget,
      deadline: new Date(deadline),
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
    
    console.log('Creating embroidery request with data:', requestData);
    const embroideryRequest = await CustomEmbroideryRequest.create(requestData);
    console.log('Embroidery request created successfully:', embroideryRequest._id);
    
    // Populate the created request
    await embroideryRequest.populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Custom embroidery request submitted successfully',
      data: embroideryRequest
    });
  } catch (error) {
    console.error('Error creating custom embroidery request:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation error details:', error.errors);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating custom embroidery request',
      error: error.message
    });
  }
});

// @desc    Update custom embroidery request status (Admin)
// @route   PUT /api/custom-embroidery-requests/:id/status
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
    
    const request = await CustomEmbroideryRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom embroidery request not found'
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
// @route   POST /api/custom-embroidery-requests/:id/revision
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
    
    const request = await CustomEmbroideryRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom embroidery request not found'
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
// @route   POST /api/custom-embroidery-requests/:id/final-designs
// @access  Private/Admin
router.post('/:id/final-designs', [
  protect,
  authorize('admin'),
  upload.array('designs', 10)
], async (req, res) => {
  try {
    const request = await CustomEmbroideryRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom embroidery request not found'
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
      url: `/uploads/embroidery-requests/${file.filename}`,
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
// @route   GET /api/custom-embroidery-requests/pricing/packages
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

// @desc    Delete custom embroidery request
// @route   DELETE /api/custom-embroidery-requests/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await CustomEmbroideryRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Custom embroidery request not found'
      });
    }
    
    await request.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Custom embroidery request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom embroidery request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting custom embroidery request',
      error: error.message
    });
  }
});

// @desc    Export custom embroidery requests as CSV
// @route   GET /api/custom-embroidery-requests/export/csv
// @access  Private/Admin
router.get('/export/csv', protect, authorize('admin'), async (req, res) => {
  try {
    const requests = await CustomEmbroideryRequest.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Create CSV headers
    const csvHeaders = [
      'Business Name',
      'Contact Person',
      'Customer Name',
      'Customer Email',
      'Embroidery Type',
      'Garment Type',
      'Quantity',
      'Thread Colors',
      'Placement',
      'Size',
      'Status',
      'Package',
      'Total Price',
      'Rush Delivery',
      'Design Description',
      'Special Requirements',
      'Budget',
      'Deadline',
      'Request Date',
      'Contact Email',
      'Contact Phone'
    ];

    // Create CSV rows
    const csvRows = requests.map(request => {
      return [
        request.businessName || 'N/A',
        request.contactPerson || 'N/A',
        request.user?.name || 'N/A',
        request.user?.email || 'N/A',
        request.embroideryType || 'N/A',
        request.garmentType || 'N/A',
        request.quantity || 0,
        request.threadColors || 'N/A',
        request.placement || 'N/A',
        request.size || 'N/A',
        request.status || 'pending',
        request.selectedPackage || 'N/A',
        request.pricing?.totalPrice || 0,
        request.pricing?.rushDelivery ? 'Yes' : 'No',
        request.designDescription || 'N/A',
        request.specialRequirements || 'N/A',
        request.budget || 'N/A',
        request.deadline ? request.deadline.toISOString().split('T')[0] : 'N/A',
        request.createdAt.toISOString().split('T')[0],
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
    res.setHeader('Content-Disposition', `attachment; filename="embroidery_requests_export_${timestamp}.csv"`);
    
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export embroidery requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting embroidery requests'
    });
  }
});

module.exports = router;