const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { protect, authorize } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.clientType) filter.clientType = req.query.clientType;
    if (req.query.industry) filter.industry = req.query.industry;
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    
    // Build sort object
    let sort = { createdAt: -1 };
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
      sort = { [sortField]: sortOrder };
    }
    
    const clients = await Client.find(filter)
      .populate('createdBy', 'name email')
      .populate('projects', 'orderNumber status pricing.total')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const total = await Client.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: clients.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: clients
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching clients',
      error: error.message
    });
  }
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate({
        path: 'projects',
        select: 'orderNumber status pricing.total createdAt',
        options: { sort: { createdAt: -1 } }
      });
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: client
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client',
      error: error.message
    });
  }
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private (Admin only)
router.post('/', [
  protect,
  authorize('admin'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
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
    
    // Check if client with email already exists
    const existingClient = await Client.findOne({ email: req.body.email });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }
    
    const clientData = {
      ...req.body,
      createdBy: req.user.id
    };
    
    const client = await Client.create(clientData);
    
    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: client
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating client',
      error: error.message
    });
  }
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private (Admin only)
router.put('/:id', [
  protect,
  authorize('admin'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().notEmpty().withMessage('Phone number cannot be empty')
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
    
    // Check if email is being updated and already exists
    if (req.body.email) {
      const existingClient = await Client.findOne({ 
        email: req.body.email,
        _id: { $ne: req.params.id }
      });
      if (existingClient) {
        return res.status(400).json({
          success: false,
          message: 'Client with this email already exists'
        });
      }
    }
    
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: client
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client',
      error: error.message
    });
  }
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Check if client has active projects
    if (client.projects && client.projects.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete client with active projects. Please archive the client instead.'
      });
    }
    
    await Client.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Client deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting client',
      error: error.message
    });
  }
});

// @desc    Update client total spent
// @route   PUT /api/clients/:id/update-spent
// @access  Private (Admin only)
router.put('/:id/update-spent', protect, authorize('admin'), async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    await client.updateTotalSpent();
    
    res.status(200).json({
      success: true,
      message: 'Client total spent updated successfully',
      data: { totalSpent: client.totalSpent }
    });
  } catch (error) {
    console.error('Error updating client total spent:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating client total spent',
      error: error.message
    });
  }
});

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private (Admin only)
router.get('/stats/overview', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Client.aggregate([
      {
        $group: {
          _id: null,
          totalClients: { $sum: 1 },
          activeClients: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalSpent: { $sum: '$totalSpent' },
          averageSpent: { $avg: '$totalSpent' }
        }
      }
    ]);
    
    const clientsByType = await Client.aggregate([
      {
        $group: {
          _id: '$clientType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const clientsByIndustry = await Client.aggregate([
      {
        $group: {
          _id: '$industry',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalClients: 0,
          activeClients: 0,
          totalSpent: 0,
          averageSpent: 0
        },
        clientsByType,
        clientsByIndustry
      }
    });
  } catch (error) {
    console.error('Error fetching client statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching client statistics',
      error: error.message
    });
  }
});

module.exports = router;