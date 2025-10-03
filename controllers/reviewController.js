const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = '-createdAt', rating } = req.query;

    // Build filter
    const filter = {
      product: productId,
      status: 'approved'
    };

    if (rating) {
      filter.rating = parseInt(rating);
    }

    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .populate('adminResponse.respondedBy', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments(filter);
    const stats = await Review.getProductRatingStats(productId);

    res.json({
      success: true,
      data: {
        reviews,
        stats,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:productId/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, title, comment, images = [] } = req.body;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Create review
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      title: title ? title.trim() : '',
      comment: comment ? comment.trim() : '',
      images: images.map(img => ({
        url: img.url,
        alt: img.alt || 'Review image'
      })),
      status: 'approved' // Auto-approve for now, can be changed to 'pending'
    });

    await review.save();

    // Populate user data for response
    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review created successfully'
    });
  } catch (error) {
    console.error('Create review error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment, images } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update fields
    if (rating) review.rating = rating;
    if (title) review.title = title.trim();
    if (comment) review.comment = comment.trim();
    if (images) {
      review.images = images.map(img => ({
        url: img.url,
        alt: img.alt || 'Review image'
      }));
    }

    review.status = 'approved'; // Reset to approved after update
    await review.save();

    await review.populate('user', 'name avatar');

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
};

// @desc    Vote helpful on a review
// @route   POST /api/reviews/:reviewId/vote
// @access  Private
const voteHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user can vote
    if (!review.canUserVote(userId)) {
      return res.status(400).json({
        success: false,
        message: 'You cannot vote on this review'
      });
    }

    // Add vote
    review.votedBy.push(userId);
    review.helpfulVotes += 1;
    await review.save();

    res.json({
      success: true,
      data: {
        helpfulVotes: review.helpfulVotes
      },
      message: 'Vote recorded successfully'
    });
  } catch (error) {
    console.error('Vote helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/users/reviews
// @access  Private
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Review.find({ user: userId })
      .populate('product', 'name images category subcategory')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews'
    });
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, rating, sort = '-createdAt' } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (rating) filter.rating = parseInt(rating);

    const reviews = await Review.find(filter)
      .populate('user', 'name email avatar')
      .populate('product', 'name category subcategory')
      .populate('adminResponse.respondedBy', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments(filter);

    // Get status counts
    const statusCounts = await Review.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        statusCounts: statusCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
};

// @desc    Update review status (Admin)
// @route   PUT /api/admin/reviews/:reviewId/status
// @access  Private/Admin
const updateReviewStatus = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status, adminMessage } = req.body;
    const adminId = req.user.id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.status = status;
    
    if (adminMessage) {
      review.adminResponse = {
        message: adminMessage.trim(),
        respondedBy: adminId,
        respondedAt: new Date()
      };
    }

    await review.save();

    await review.populate([
      { path: 'user', select: 'name email avatar' },
      { path: 'product', select: 'name category subcategory' },
      { path: 'adminResponse.respondedBy', select: 'name' }
    ]);

    res.json({
      success: true,
      data: review,
      message: `Review ${status} successfully`
    });
  } catch (error) {
    console.error('Update review status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review status'
    });
  }
};

module.exports = {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  getUserReviews,
  getAllReviews,
  updateReviewStatus
};