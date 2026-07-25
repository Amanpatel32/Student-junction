const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    message: { type: String, required: [true, 'Message is required'], trim: true },
    // If course is null, the notice is institute-wide (visible to everyone).
    // If set, it's only visible to that course's teacher + enrolled students.
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
