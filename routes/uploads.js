const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const uploadDirs = [
  'uploads/avatars',
  'uploads/products',
  'uploads/orders',
  'uploads/temp'
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for different upload types
const createMulterConfig = (destination, fileFilter) => {
  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, destination);
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 10 // Maximum 10 files per request
    },
    fileFilter: fileFilter
  });
};

// Image file filter
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed'));
  }
};

// Document file filter
const documentFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|zip|rar/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files (PDF, DOC, DOCX, TXT, ZIP, RAR) are allowed'));
  }
};

// Configure upload middleware for different types
const uploadAvatar = createMulterConfig('uploads/avatars', imageFilter);
const uploadProduct = createMulterConfig('uploads/products', imageFilter);
const uploadOrder = createMulterConfig('uploads/orders', (req, file, cb) => {
  // Allow both images and documents for orders
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  const docTypes = /pdf|doc|docx|txt|zip|rar/;
  const extname = path.extname(file.originalname).toLowerCase();

  if (imageTypes.test(extname) || docTypes.test(extname)) {
    return cb(null, true);
  } else {
    cb(new Error('Only image and document files are allowed'));
  }
});

// @desc    Upload avatar image
// @route   POST /api/uploads/avatar
// @access  Private
router.post('/avatar', protect, (req, res) => {
  const upload = uploadAvatar.single('avatar');

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Return file information
    res.status(200).json({
      success: true,
      message: 'Avatar uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        path: `/uploads/avatars/${req.file.filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`
      }
    });
  });
});

// @desc    Upload product images
// @route   POST /api/uploads/product
// @access  Private/Admin
router.post('/product', protect, authorize('admin'), (req, res) => {
  const upload = uploadProduct.array('images', 5); // Maximum 5 images

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Return file information
    // Return file information
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      path: `/uploads/products/${file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/products/${file.filename}`
    }));

    res.status(200).json({
      success: true,
      message: `${files.length} product image(s) uploaded successfully`,
      files
    });
  });
});

// @desc    Upload order files
// @route   POST /api/uploads/order/:orderId
// @access  Private
router.post('/order/:orderId', protect, (req, res) => {
  const upload = uploadOrder.array('files', 10); // Maximum 10 files

  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Return file information
    const files = req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      type: path.extname(file.originalname).toLowerCase().includes('pdf') ||
        path.extname(file.originalname).toLowerCase().includes('doc') ? 'document' : 'image',
      path: `/uploads/orders/${file.filename}`,
      url: `${req.protocol}://${req.get('host')}/uploads/orders/${file.filename}`,
      orderId: req.params.orderId
    }));

    res.status(200).json({
      success: true,
      message: `${files.length} file(s) uploaded successfully`,
      files
    });
  });
});

// @desc    Delete uploaded file
// @route   DELETE /api/uploads/:type/:filename
// @access  Private
router.delete('/:type/:filename', protect, async (req, res) => {
  try {
    const { type, filename } = req.params;

    // Validate upload type
    const allowedTypes = ['avatars', 'products', 'orders'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type'
      });
    }

    // Only admins can delete product images, users can delete their own avatars and order files
    if (type === 'products' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only admins can delete product images.'
      });
    }

    const filePath = path.join('uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting file'
    });
  }
});

// @desc    Get file information
// @route   GET /api/uploads/:type/:filename
// @access  Public (for product images), Private (for others)
router.get('/:type/:filename', (req, res) => {
  try {
    const { type, filename } = req.params;

    // Validate upload type
    const allowedTypes = ['avatars', 'products', 'orders'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid upload type'
      });
    }

    const filePath = path.join('uploads', type, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get file stats
    const stats = fs.statSync(filePath);

    res.status(200).json({
      success: true,
      file: {
        filename,
        type,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: `/uploads/${type}/${filename}`,
        url: `${req.protocol}://${req.get('host')}/uploads/${type}/${filename}`
      }
    });
  } catch (error) {
    console.error('Get file info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting file information'
    });
  }
});

// @desc    Get upload statistics (Admin only)
// @route   GET /api/uploads/admin/stats
// @access  Private/Admin
router.get('/admin/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = {};

    // Get file counts and sizes for each upload type
    for (const type of ['avatars', 'products', 'orders']) {
      const dirPath = path.join('uploads', type);

      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        let totalSize = 0;

        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const fileStats = fs.statSync(filePath);
          totalSize += fileStats.size;
        });

        stats[type] = {
          count: files.length,
          totalSize: totalSize,
          totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
        };
      } else {
        stats[type] = {
          count: 0,
          totalSize: 0,
          totalSizeMB: 0
        };
      }
    }

    // Calculate total statistics
    const totalFiles = Object.values(stats).reduce((sum, stat) => sum + stat.count, 0);
    const totalSize = Object.values(stats).reduce((sum, stat) => sum + stat.totalSize, 0);

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        total: {
          count: totalFiles,
          totalSize: totalSize,
          totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
        }
      }
    });
  } catch (error) {
    console.error('Get upload stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upload statistics'
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum allowed varies by endpoint.'
      });
    }
  }

  res.status(400).json({
    success: false,
    message: error.message || 'Upload error'
  });
});

module.exports = router;