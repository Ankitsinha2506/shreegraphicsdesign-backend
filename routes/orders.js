const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, authorize, checkOwnership } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Users see their orders, Admins see all)
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // Regular users can only see their own orders
    if (req.user.role !== 'admin') {
      query.customer = req.user._id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Filter by date range
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {};
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        query.createdAt.$lte = new Date(req.query.endDate);
      }
    }

    // Search by order number
    if (req.query.search) {
      query.orderNumber = { $regex: req.query.search, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('customer', 'name email')
      .populate('items.product', 'name category images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private (Owner or Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name category images createdBy')
      .populate('communication.sender', 'name role');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own orders.'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    let body = req.body;

    // If FormData (multipart) is sent, extract JSON
    if (typeof req.body.data === "string") {
      body = JSON.parse(req.body.data);
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      manualTransactionId,
      paymentStatus,
      paymentScreenshot
    } = body;

    // -------------------------
    // VALIDATION
    // -------------------------
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    if (!shippingAddress.fullName) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!shippingAddress.email) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required",
      });
    }

    if (!shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: "Valid phone number is required",
      });
    }

    // -------------------------
    // BUILD ORDER ITEMS
    // -------------------------
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found`,
        });
      }

      const tier = item.tier || item.packageType || "base";
      const tierPrice = product.price[tier];

      if (!tierPrice) {
        return res.status(400).json({
          success: false,
          message: `Pricing tier '${tier}' not found`,
        });
      }

      const qty = item.quantity || 1;
      subtotal += tierPrice * qty;

      orderItems.push({
        product: product._id,
        packageType: tier,
        quantity: qty,
        price: tierPrice,
        customizations: Object.entries(item.customization || {}).map(
          ([key, value]) => ({
            optionName: key,
            selectedValue: value,
          })
        ),
      });
    }

    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    // -------------------------
    // CREATE ORDER DOCUMENT
    // -------------------------
    const order = new Order({
      customer: req.user._id,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        total,
      },
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        street: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.pincode,
        country: shippingAddress.country || "India",
      },
      paymentInfo: {
        method: paymentMethod,
        manualTransactionId: manualTransactionId || null,
        paymentScreenshot: paymentScreenshot || null,
        paymentStatus: paymentStatus || "pending",
      },
      status: "pending",
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("customer", "name email")
      .populate("items.product", "name images category");

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating order",
    });
  }
});


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('status')
    .isIn(['pending', 'confirmed', 'in-progress', 'review', 'revision', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Message cannot exceed 500 characters')
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

    const { status, message } = req.body;

    // Try to find by ObjectId first, then by orderNumber
    let order;
    try {
      order = await Order.findById(req.params.id);
    } catch (error) {
      // If not a valid ObjectId, try finding by orderNumber
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      // Try finding by orderNumber if not found by ID
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    const oldStatus = order.status;
    order.status = status;

    // Add communication log entry
    order.communication.push({
      sender: req.user._id,
      content: message || `Order status changed from ${oldStatus} to ${status}`,
      type: 'message',
      createdAt: new Date()
    });

    // Set completion date if completed
    if (status === 'completed' && !order.actualDeliveryDate) {
      order.actualDeliveryDate = new Date();
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name category');

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @desc    Add communication to order
// @route   POST /api/orders/:id/communication
// @access  Private (Owner or Admin)
router.post('/:id/communication', [
  protect,
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['message', 'file_upload', 'revision_request', 'status_update'])
    .withMessage('Invalid communication type')
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

    const { message, type = 'message' } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can access this order
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only communicate on your own orders.'
      });
    }

    // Add communication
    order.communication.push({
      sender: req.user._id,
      content: message,
      type,
      createdAt: new Date()
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Communication added successfully'
    });
  } catch (error) {
    console.error('Add communication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding communication'
    });
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private (Owner or Admin)
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user can cancel this order
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only cancel your own orders.'
      });
    }

    // Check if order can be cancelled
    if (['completed', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in its current status'
      });
    }

    // Cancel order
    order.status = 'cancelled';
    order.communication.push({
      sender: req.user._id,
      content: 'Order cancelled by ' + (req.user.role === 'admin' ? 'admin' : 'customer'),
      type: 'message',
      createdAt: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    // Revenue calculation
    const revenueData = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } }
    ]);

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly order trend (last 12 months)
    const orderTrend = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        ordersByStatus,
        orderTrend
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics'
    });
  }
});

// @desc    Export orders as CSV
// @route   GET /api/orders/export/csv
// @access  Private/Admin
router.get('/export/csv', protect, authorize('admin'), async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email')
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 });

    // Create CSV headers
    const csvHeaders = [
      'Order Number',
      'Customer Name',
      'Customer Email',
      'Status',
      'Total Amount',
      'Items Count',
      'Products',
      'Created Date',
      'Updated Date',
      'Shipping Address',
      'Phone'
    ];

    // Create CSV rows
    const csvRows = orders.map(order => {
      const products = order.items.map(item =>
        `${item.product?.name || 'Unknown'} (${item.tier}, Qty: ${item.quantity})`
      ).join('; ');

      const shippingAddress = order.shippingAddress ?
        `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}` :
        'N/A';

      return [
        order.orderNumber,
        order.customer?.name || 'N/A',
        order.customer?.email || 'N/A',
        order.status,
        order.totalAmount,
        order.items.length,
        products,
        order.createdAt.toISOString().split('T')[0],
        order.updatedAt.toISOString().split('T')[0],
        shippingAddress,
        order.shippingAddress?.phone || 'N/A'
      ];
    });

    // Combine headers and rows
    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    // Set response headers for CSV download
    const timestamp = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="orders_export_${timestamp}.csv"`);

    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Export orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting orders'
    });
  }
});

module.exports = router;