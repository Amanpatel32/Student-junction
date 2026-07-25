const express = require('express');
const router = express.Router();
const { getCourseMaterials, createMaterial, uploadMaterial, deleteMaterial } = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/course/:courseId', getCourseMaterials);
router.post('/', authorize('admin', 'teacher'), createMaterial);
router.post('/upload', authorize('admin', 'teacher'), upload.single('file'), uploadMaterial);
router.delete('/:id', authorize('admin', 'teacher'), deleteMaterial);

module.exports = router;
