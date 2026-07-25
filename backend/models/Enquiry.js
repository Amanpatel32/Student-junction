const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    phone: { type: String, required: [true, 'Phone number is required'], trim: true },
    classInterested: { type: String, trim: true }, // e.g. "Class VI", "Class IX - Science"
    message: { type: String, trim: true },
    status: { type: String, enum: ['New', 'Contacted', 'Enrolled', 'Closed'], default: 'New' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
