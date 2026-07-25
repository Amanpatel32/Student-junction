const mongoose = require('mongoose');

const timetableSlotSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], required: true },
    startTime: { type: String, required: true, trim: true }, // "10:00"
    endTime: { type: String, required: true, trim: true }, // "11:00"
    room: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimetableSlot', timetableSlotSchema);
