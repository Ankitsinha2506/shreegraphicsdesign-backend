// routes/podcasts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Podcast = require('../models/Podcast');
const { protect, authorize } = require('../middleware/auth');

// ================= MULTER CONFIG =================
const uploadPath = path.join(__dirname, '..', 'uploads', 'podcasts');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'podcast-' + unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedVideo = /mp4|mov|avi|mkv/;
  const allowedImage = /jpeg|jpg|png|webp/;

  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (file.fieldname === 'videoFile') {
    if (!allowedVideo.test(ext)) {
      return cb(new Error('Only video files (mp4, mov, avi, mkv) are allowed'));
    }
  } else if (file.fieldname === 'thumbnail') {
    if (!allowedImage.test(ext)) {
      return cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed'));
    }
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
});

// for video + thumbnail in same request
const podcastUpload = upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// ================= HELPER FOR FILE DELETE =================
const deleteFileIfExists = (filePath) => {
  if (!filePath) return;
  // filePath from DB is like "/uploads/podcasts/xxx.mp4"
  const absolute = path.join(__dirname, '..', filePath);
  if (fs.existsSync(absolute)) {
    fs.unlinkSync(absolute);
  }
};

// ================= ROUTES =================

/**
 * @route   POST /api/podcasts
 * @desc    Create podcast (Admin)
 * @access  Private/Admin
 */
router.post('/', protect, authorize('admin'), podcastUpload, async (req, res) => {
  try {
    const { title, description, videoType, videoUrl: bodyVideoUrl } = req.body;

    if (!title || !videoType) {
      return res.status(400).json({
        success: false,
        message: 'Title and video type are required',
      });
    }

    if (!['upload', 'url'].includes(videoType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video type',
      });
    }

    let finalVideoUrl = '';

    if (videoType === 'upload') {
      const videoFile = req.files?.videoFile?.[0];
      if (!videoFile) {
        return res.status(400).json({
          success: false,
          message: 'Video file is required for upload type',
        });
      }
      // store as /uploads/podcasts/filename
      finalVideoUrl = `/uploads/podcasts/${videoFile.filename}`;
    } else {
      // videoType === 'url'
      if (!bodyVideoUrl) {
        return res.status(400).json({
          success: false,
          message: 'Video URL is required for url type',
        });
      }
      finalVideoUrl = bodyVideoUrl.trim();
    }

    let thumbnailUrl = '';
    const thumbFile = req.files?.thumbnail?.[0];
    if (thumbFile) {
      thumbnailUrl = `/uploads/podcasts/${thumbFile.filename}`;
    }

    const podcast = await Podcast.create({
      title,
      description,
      videoType,
      videoUrl: finalVideoUrl,
      thumbnailUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Podcast created successfully',
      podcast,
    });
  } catch (err) {
    console.error('Create podcast error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while creating podcast',
    });
  }
});

/**
 * @route   GET /api/podcasts
 * @desc    Get all podcasts (only logged-in users)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const podcasts = await Podcast.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: podcasts.length,
      podcasts,
    });
  } catch (err) {
    console.error('Get podcasts error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching podcasts',
    });
  }
});

/**
 * @route   GET /api/podcasts/:id
 * @desc    Get single podcast
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);

    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found',
      });
    }

    res.status(200).json({
      success: true,
      podcast,
    });
  } catch (err) {
    console.error('Get podcast error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching podcast',
    });
  }
});

/**
 * @route   PUT /api/podcasts/:id
 * @desc    Update podcast (Admin)
 * @access  Private/Admin
 */
router.put('/:id', protect, authorize('admin'), podcastUpload, async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found',
      });
    }

    const { title, description, videoType, videoUrl: bodyVideoUrl, isActive } = req.body;

    if (title !== undefined) podcast.title = title;
    if (description !== undefined) podcast.description = description;
    if (isActive !== undefined) podcast.isActive = isActive;

    // Handle video update
    if (videoType) {
      if (!['upload', 'url'].includes(videoType)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid video type',
        });
      }

      podcast.videoType = videoType;

      if (videoType === 'upload') {
        const videoFile = req.files?.videoFile?.[0];
        if (videoFile) {
          // delete old uploaded video if existed and was local
          if (podcast.videoType === 'upload' && podcast.videoUrl.startsWith('/uploads')) {
            deleteFileIfExists(podcast.videoUrl);
          }
          podcast.videoUrl = `/uploads/podcasts/${videoFile.filename}`;
        }
      } else {
        // url
        if (bodyVideoUrl) {
          // if previous was upload, try delete that file
          if (podcast.videoType === 'upload' && podcast.videoUrl.startsWith('/uploads')) {
            deleteFileIfExists(podcast.videoUrl);
          }
          podcast.videoUrl = bodyVideoUrl.trim();
        }
      }
    } else if (podcast.videoType === 'upload') {
      // optional: allow replacing upload without sending videoType again
      const videoFile = req.files?.videoFile?.[0];
      if (videoFile) {
        deleteFileIfExists(podcast.videoUrl);
        podcast.videoUrl = `/uploads/podcasts/${videoFile.filename}`;
      }
    }

    // Handle thumbnail update
    const thumbFile = req.files?.thumbnail?.[0];
    if (thumbFile) {
      if (podcast.thumbnailUrl?.startsWith('/uploads')) {
        deleteFileIfExists(podcast.thumbnailUrl);
      }
      podcast.thumbnailUrl = `/uploads/podcasts/${thumbFile.filename}`;
    }

    await podcast.save();

    res.status(200).json({
      success: true,
      message: 'Podcast updated successfully',
      podcast,
    });
  } catch (err) {
    console.error('Update podcast error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while updating podcast',
    });
  }
});

/**
 * @route   DELETE /api/podcasts/:id
 * @desc    Delete podcast (Admin)
 * @access  Private/Admin
 */
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const podcast = await Podcast.findById(req.params.id);
    if (!podcast) {
      return res.status(404).json({
        success: false,
        message: 'Podcast not found',
      });
    }

    // delete files if local
    if (podcast.videoType === 'upload' && podcast.videoUrl?.startsWith('/uploads')) {
      deleteFileIfExists(podcast.videoUrl);
    }
    if (podcast.thumbnailUrl?.startsWith('/uploads')) {
      deleteFileIfExists(podcast.thumbnailUrl);
    }

    await podcast.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Podcast deleted successfully',
    });
  } catch (err) {
    console.error('Delete podcast error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting podcast',
    });
  }
});

module.exports = router;
