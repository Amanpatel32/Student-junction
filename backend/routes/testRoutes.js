const express = require('express');
const router = express.Router();
const { getCourseTests, getTest, createTest, updateTest, deleteTest } = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/course/:courseId', getCourseTests);
router.get('/:id', getTest);
router.post('/', authorize('admin'), createTest);
router.put('/:id', authorize('admin'), updateTest);
router.delete('/:id', authorize('admin'), deleteTest);

module.exports = router;
