const express = require('express');
const router = express.Router();
const { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public: anyone visiting the landing page can submit an enquiry, no login required
router.post('/', createEnquiry);

router.get('/', protect, authorize('admin'), getEnquiries);
router.put('/:id', protect, authorize('admin'), updateEnquiry);
router.delete('/:id', protect, authorize('admin'), deleteEnquiry);

module.exports = router;
