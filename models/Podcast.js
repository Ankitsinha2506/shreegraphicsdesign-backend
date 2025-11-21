// models/Podcast.js
const mongoose = require('mongoose');

const podcastSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // ⭐ "upload" = local video file, "url" = external (YouTube, Vimeo, etc.)
    videoType: {
      type: String,
      enum: ['upload', 'url'],
      required: true,
    },

    // ⭐ If upload → store local path (e.g. /uploads/podcasts/video-123.mp4)
    //    If url   → store full external URL
    videoUrl: {
      type: String,
      required: true,
    },

    // Optional thumbnail image
    thumbnailUrl: {
      type: String,
    },

    // Only admin creates
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Podcast', podcastSchema);
