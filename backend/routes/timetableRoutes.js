const express = require('express');
const router = express.Router();
const { getTimetable, createSlot, deleteSlot } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getTimetable);
router.post('/', authorize('admin'), createSlot);
router.delete('/:id', authorize('admin'), deleteSlot);

module.exports = router;
