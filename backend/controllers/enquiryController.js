const Enquiry = require('../models/Enquiry');

// @desc    Public admission enquiry submission from the landing page (no auth required)
// @route   POST /api/enquiries
exports.createEnquiry = async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ message: 'Name and phone number are required' });
    const enquiry = await Enquiry.create(req.body);
    res.status(201).json({ message: 'Thank you! We will get in touch with you shortly.', id: enquiry._id });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    List all admission enquiries (admin only)
// @route   GET /api/enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update an enquiry's follow-up status
// @route   PUT /api/enquiries/:id
exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.status(200).json(enquiry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete an enquiry
// @route   DELETE /api/enquiries/:id
exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found' });
    res.status(200).json({ message: 'Enquiry deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
