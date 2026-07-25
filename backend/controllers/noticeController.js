const Notice = require('../models/Notice');
const Course = require('../models/Course');

const populateNotice = (query) => query.populate('postedBy', 'name role').populate('course', 'title code');

// @desc    List notices scoped to the logged-in user (institute-wide + relevant courses)
// @route   GET /api/notices
exports.getNotices = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'teacher') {
      const courseIds = (await Course.find({ teacher: req.user._id })).map((c) => c._id);
      query = { $or: [{ course: null }, { course: { $in: courseIds } }] };
    } else if (req.user.role === 'student') {
      const courseIds = (await Course.find({ students: req.user._id })).map((c) => c._id);
      query = { $or: [{ course: null }, { course: { $in: courseIds } }] };
    }
    // admin sees everything (no filter)

    const notices = await populateNotice(Notice.find(query).sort({ createdAt: -1 }));
    res.status(200).json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Post a notice (admin: institute-wide or any course; teacher: only their own course)
// @route   POST /api/notices
exports.createNotice = async (req, res) => {
  try {
    const { title, message, course } = req.body;

    if (req.user.role === 'teacher') {
      if (!course) return res.status(400).json({ message: 'Teachers must select one of their courses to post a notice' });
      const owns = await Course.findOne({ _id: course, teacher: req.user._id });
      if (!owns) return res.status(403).json({ message: 'You can only post notices to your own courses' });
    }

    const notice = await Notice.create({ title, message, course: course || null, postedBy: req.user._id });
    const populated = await populateNotice(Notice.findById(notice._id));
    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a notice (admin can delete any; teacher only their own)
// @route   DELETE /api/notices/:id
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    if (req.user.role === 'teacher' && notice.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete notices you posted' });
    }

    await notice.deleteOne();
    res.status(200).json({ message: 'Notice deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
