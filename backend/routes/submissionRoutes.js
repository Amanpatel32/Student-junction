const express = require('express');
const router = express.Router();
const { submitTest, getTestSubmissions, getMySubmissions } = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student', 'admin'), submitTest);
router.get('/my', authorize('student', 'admin', 'teacher'), getMySubmissions);
router.get('/test/:testId', authorize('admin', 'teacher'), getTestSubmissions);

module.exports = router;
