const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    caption: {
      type: String,
      default: '',
      maxlength: [200, 'Caption cannot exceed 200 characters'],
    },
    eventName: {
      type: String,
      default: '',
      maxlength: [100, 'Event name cannot exceed 100 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Sort by date descending by default
galleryItemSchema.index({ date: -1 });

module.exports = mongoose.model('Gallery', galleryItemSchema);

