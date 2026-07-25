const express = require('express');
const router = express.Router();
const { createMark, updateMark, deleteMark, getCourseMarks, getReportCard } = require('../controllers/markController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), createMark);
router.put('/:id', authorize('admin'), updateMark);
router.delete('/:id', authorize('admin'), deleteMark);
router.get('/course/:courseId', authorize('admin'), getCourseMarks);
router.get('/report-card/:courseId', getReportCard); // student (self) or teacher/admin (?studentId=)

module.exports = router;
