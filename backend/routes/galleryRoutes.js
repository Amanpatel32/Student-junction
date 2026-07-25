const express = require('express');
const router = express.Router();
const {
  getGallery,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryItem,
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public
router.get('/', getGallery);

// Admin-only
router.get('/all', protect, authorize('admin'), getAllGallery);
router.post('/', protect, authorize('admin'), upload.single('image'), createGalleryItem);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);
router.patch('/:id/toggle', protect, authorize('admin'), toggleGalleryItem);

module.exports = router;

