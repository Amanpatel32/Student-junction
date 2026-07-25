const TimetableSlot = require('../models/TimetableSlot');
const Course = require('../models/Course');

// @desc    List timetable slots (scoped by role: teacher sees their courses, student sees enrolled courses)
// @route   GET /api/timetable
exports.getTimetable = async (req, res) => {
  try {
    let courseIds;
    if (req.user.role === 'teacher') {
      courseIds = (await Course.find({ teacher: req.user._id })).map((c) => c._id);
    } else if (req.user.role === 'student') {
      courseIds = (await Course.find({ students: req.user._id })).map((c) => c._id);
    }

    const query = courseIds ? { course: { $in: courseIds } } : {};
    const slots = await TimetableSlot.find(query).populate({
      path: 'course',
      select: 'title code batch teacher',
      populate: { path: 'teacher', select: 'name' },
    });

    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    slots.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startTime.localeCompare(b.startTime));

    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a timetable slot
// @route   POST /api/timetable
exports.createSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.create(req.body);
    res.status(201).json(slot);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a timetable slot
// @route   DELETE /api/timetable/:id
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await TimetableSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Timetable slot not found' });
    res.status(200).json({ message: 'Slot deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
