const express = require('express');
const router = express.Router();
const { createMark, updateMark, deleteMark, getCourseMarks, getReportCard } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin', 'teacher'), createMark);
router.put('/:id', authorize('admin', 'teacher'), updateMark);
router.delete('/:id', authorize('admin', 'teacher'), deleteMark);
router.get('/course/:courseId', authorize('admin', 'teacher'), getCourseMarks);
router.get('/report-card/:courseId', getReportCard);

module.exports = router;
