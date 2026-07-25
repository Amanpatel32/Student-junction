const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, trim: true },
    // 'Link' = external URL (YouTube, Drive, etc); 'Video'/'Document' = uploaded and served from /uploads
    type: { type: String, enum: ['Link', 'Video', 'Document'], default: 'Link' },
    link: { type: String, required: [true, 'A link/URL to the material is required'], trim: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
