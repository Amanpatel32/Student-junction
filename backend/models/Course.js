const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Course title is required'], trim: true },
    code: { type: String, required: [true, 'Course code is required'], unique: true, trim: true, uppercase: true },
    description: { type: String, trim: true },
    batch: { type: String, required: [true, 'Batch/section is required'], trim: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    schedule: { type: String, trim: true }, // free-text summary, e.g. "Mon/Wed/Fri, 10-11 AM"
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
