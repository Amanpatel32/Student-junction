const Material = require('../models/Material');
const fs = require('fs');
const path = require('path');

// @desc    List materials for a course
// @route   GET /api/materials/course/:courseId
exports.getCourseMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ course: req.params.courseId })
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a material as an external link (YouTube, Drive, etc.)
// @route   POST /api/materials
exports.createMaterial = async (req, res) => {
  try {
    const material = await Material.create({ ...req.body, type: 'Link', uploadedBy: req.user._id });
    res.status(201).json(material);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Upload a video/document file directly (served back from /uploads)
// @route   POST /api/materials/upload
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file was uploaded' });
    const { course, title, description } = req.body;
    if (!course || !title) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: 'course and title are required' });
    }

    const type = req.file.mimetype.startsWith('video/') ? 'Video' : 'Document';
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const material = await Material.create({
      course,
      title,
      description,
      type,
      link: fileUrl,
      uploadedBy: req.user._id,
    });
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a material (also removes the uploaded file from disk, if any)
// @route   DELETE /api/materials/:id
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    if (material.type !== 'Link') {
      const filename = material.link.split('/uploads/')[1];
      if (filename) {
        const filePath = path.join(__dirname, '..', 'uploads', filename);
        fs.unlink(filePath, () => {}); // best-effort cleanup, ignore errors
      }
    }

    res.status(200).json({ message: 'Material deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
