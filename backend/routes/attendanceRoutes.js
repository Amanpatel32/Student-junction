const express = require('express');
const router = express.Router();
const { markAttendance, getCourseAttendance, getMyAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), markAttendance);
router.get('/course/:courseId', authorize('admin'), getCourseAttendance);
router.get('/my/:courseId', authorize('student', 'admin'), getMyAttendance);

module.exports = router;
