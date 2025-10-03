const express = require('express');
const {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  voteHelpful,
  getUserReviews,
  getAllReviews,
  updateReviewStatus
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');
const admin = authorize('admin');
const { body, param, query } = require('express-validator');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// Validation middleware
const validateCreateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 images allowed'),
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Invalid image URL'),
  handleValidationErrors
];

const validateUpdateReview = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Title must be between 5 and 100 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Comment must be between 10 and 1000 characters'),
  body('images')
    .optional()
    .isArray({ max: 5 })
    .withMessage('Maximum 5 images allowed'),
  handleValidationErrors
];

const validateProductId = [
  param('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  handleValidationErrors
];

const validateReviewId = [
  param('reviewId')
    .isMongoId()
    .withMessage('Invalid review ID'),
  handleValidationErrors
];

const validateUpdateStatus = [
  body('status')
    .isIn(['pending', 'approved', 'rejected'])
    .withMessage('Invalid status'),
  body('adminMessage')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Admin message must be less than 500 characters'),
  handleValidationErrors
];

const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating filter must be between 1 and 5'),
  handleValidationErrors
];

// Public routes
// GET /api/products/:productId/reviews - Get all reviews for a product
router.get(
  '/products/:productId/reviews',
  validateProductId,
  validatePagination,
  getProductReviews
);

// Protected routes (require authentication)
// POST /api/products/:productId/reviews - Create a review for a product
router.post(
  '/products/:productId/reviews',
  protect,
  validateProductId,
  validateCreateReview,
  createReview
);

// PUT /api/reviews/:reviewId - Update a review
router.put(
  '/reviews/:reviewId',
  protect,
  validateReviewId,
  validateUpdateReview,
  updateReview
);

// DELETE /api/reviews/:reviewId - Delete a review
router.delete(
  '/reviews/:reviewId',
  protect,
  validateReviewId,
  deleteReview
);

// POST /api/reviews/:reviewId/vote - Vote helpful on a review
router.post(
  '/reviews/:reviewId/vote',
  protect,
  validateReviewId,
  voteHelpful
);

// GET /api/users/reviews - Get current user's reviews
router.get(
  '/users/reviews',
  protect,
  validatePagination,
  getUserReviews
);

// Admin routes
// GET /api/admin/reviews - Get all reviews (admin only)
router.get(
  '/admin/reviews',
  protect,
  admin,
  validatePagination,
  getAllReviews
);

// PUT /api/admin/reviews/:reviewId/status - Update review status (admin only)
router.put(
  '/admin/reviews/:reviewId/status',
  protect,
  admin,
  validateReviewId,
  validateUpdateStatus,
  updateReviewStatus
);

module.exports = router;