const Course = require('../models/Course');

const populateCourse = (query) =>
  query.populate('teacher', 'name email subject').populate('students', 'name email rollNumber');

// @desc    List courses (scoped by role: teacher sees their own, student sees enrolled, admin sees all)
// @route   GET /api/courses
exports.getCourses = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'teacher') query = { teacher: req.user._id };
    if (req.user.role === 'student') query = { students: req.user._id };

    const courses = await populateCourse(Course.find(query).sort({ createdAt: -1 }));
    res.status(200).json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single course
// @route   GET /api/courses/:id
exports.getCourse = async (req, res) => {
  try {
    const course = await populateCourse(Course.findById(req.params.id));
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a course
// @route   POST /api/courses
exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    const populated = await populateCourse(Course.findById(course._id));
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: `Course code "${req.body.code}" is already in use` });
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a course (details, teacher assignment, or enrolled student list)
// @route   PUT /api/courses/:id
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const populated = await populateCourse(Course.findById(course._id));
    res.status(200).json(populated);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: `Course code "${req.body.code}" is already in use` });
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.status(200).json({ message: 'Course deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
