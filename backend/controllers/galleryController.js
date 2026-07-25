const Gallery = require('../models/Gallery');
const fs = require('fs');
const path = require('path');

// @desc    Get all active gallery items (public)
// @route   GET /api/gallery
// @access  Public
exports.getGallery = async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true })
      .populate('uploadedBy', 'name')
      .sort('-date');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch gallery' });
  }
};

// @desc    Get all gallery items (including inactive — admin)
// @route   GET /api/gallery/all
// @access  Admin
exports.getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find({})
      .populate('uploadedBy', 'name')
      .sort('-date');
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch gallery' });
  }
};

// @desc    Create a gallery item (upload image)
// @route   POST /api/gallery
// @access  Admin
exports.createGalleryItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const { caption, eventName } = req.body;

    const item = await Gallery.create({
      image: `/uploads/${req.file.filename}`,
      caption: caption || '',
      eventName: eventName || '',
      date: new Date(),
      uploadedBy: req.user._id,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create gallery item' });
  }
};

// @desc    Update a gallery item
// @route   PUT /api/gallery/:id
// @access  Admin
exports.updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const { caption, eventName, isActive } = req.body;

    if (caption !== undefined) item.caption = caption;
    if (eventName !== undefined) item.eventName = eventName;
    if (isActive !== undefined) item.isActive = isActive;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      // Delete old image file
      const oldPath = path.join(__dirname, '..', item.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
      item.image = `/uploads/${req.file.filename}`;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not update gallery item' });
  }
};

// @desc    Delete a gallery item
// @route   DELETE /api/gallery/:id
// @access  Admin
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    // Delete the image file
    const filePath = path.join(__dirname, '..', item.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await item.deleteOne();
    res.json({ message: 'Gallery item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete gallery item' });
  }
};

// @desc    Toggle active status
// @route   PATCH /api/gallery/:id/toggle
// @access  Admin
exports.toggleGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    item.isActive = !item.isActive;
    await item.save();
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not toggle gallery item' });
  }
};

