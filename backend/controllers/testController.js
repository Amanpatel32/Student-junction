const Test = require('../models/Test');
const Submission = require('../models/Submission');

// Strip correct answers before sending a test to a student who hasn't attempted it yet
const sanitizeForStudent = (test) => {
  const obj = test.toObject({ virtuals: true });
  obj.questions = obj.questions.map((q) => ({ _id: q._id, text: q.text, options: q.options, marks: q.marks }));
  return obj;
};

// @desc    List tests for a course (students only see published tests)
// @route   GET /api/tests/course/:courseId
exports.getCourseTests = async (req, res) => {
  try {
    const query = { course: req.params.courseId };
    if (req.user.role === 'student') query.isPublished = true;

    const tests = await Test.find(query).sort({ createdAt: -1 });

    if (req.user.role !== 'student') return res.status(200).json(tests);

    // Attach whether the student has already submitted each test
    const submissions = await Submission.find({ student: req.user._id, test: { $in: tests.map((t) => t._id) } });
    const submittedIds = new Set(submissions.map((s) => s.test.toString()));

    const result = tests.map((t) => ({
      ...sanitizeForStudent(t),
      attempted: submittedIds.has(t._id.toString()),
    }));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single test (full detail for teacher/admin; sanitized for a student unless already attempted)
// @route   GET /api/tests/:id
exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    if (req.user.role !== 'student') return res.status(200).json(test);

    if (!test.isPublished) return res.status(403).json({ message: 'This test is not yet published' });

    const existing = await Submission.findOne({ test: test._id, student: req.user._id });
    if (existing) return res.status(200).json(test); // already attempted, safe to reveal full test for review

    res.status(200).json(sanitizeForStudent(test));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a test
// @route   POST /api/tests
exports.createTest = async (req, res) => {
  try {
    const test = await Test.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(test);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a test (edit questions, toggle publish state, etc.)
// @route   PUT /api/tests/:id
exports.updateTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    res.status(200).json(test);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a test
// @route   DELETE /api/tests/:id
exports.deleteTest = async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    await Submission.deleteMany({ test: test._id });
    res.status(200).json({ message: 'Test deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
