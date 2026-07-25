const express = require('express');
const router = express.Router();
const { getNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getNotices);
router.post('/', authorize('admin'), createNotice);
router.delete('/:id', authorize('admin'), deleteNotice);

module.exports = router;
