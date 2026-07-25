const Mark = require('../models/Mark');
const Submission = require('../models/Submission');
const Test = require('../models/Test');

// @desc    Create a manual mark entry (assignment, midterm, final, etc.)
// @route   POST /api/marks
exports.createMark = async (req, res) => {
  try {
    const mark = await Mark.create({ ...req.body, enteredBy: req.user._id });
    res.status(201).json(mark);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Update a mark entry
// @route   PUT /api/marks/:id
exports.updateMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!mark) return res.status(404).json({ message: 'Mark entry not found' });
    res.status(200).json(mark);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a mark entry
// @route   DELETE /api/marks/:id
exports.deleteMark = async (req, res) => {
  try {
    const mark = await Mark.findByIdAndDelete(req.params.id);
    if (!mark) return res.status(404).json({ message: 'Mark entry not found' });
    res.status(200).json({ message: 'Mark entry deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    All manual mark entries for a course (teacher/admin)
// @route   GET /api/marks/course/:courseId
exports.getCourseMarks = async (req, res) => {
  try {
    const marks = await Mark.find({ course: req.params.courseId }).populate('student', 'name rollNumber').sort({
      createdAt: -1,
    });
    res.status(200).json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    A student's full report card for a course: manual marks + auto-graded test scores
// @route   GET /api/marks/report-card/:courseId  (student sees own; teacher/admin pass ?studentId=)
exports.getReportCard = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user._id : req.query.studentId;
    if (!studentId) return res.status(400).json({ message: 'studentId is required' });

    const marks = await Mark.find({ course: req.params.courseId, student: studentId }).sort({ createdAt: 1 });

    const tests = await Test.find({ course: req.params.courseId, isPublished: true });
    const testIds = tests.map((t) => t._id);
    const submissions = await Submission.find({ test: { $in: testIds }, student: studentId });

    const testEntries = submissions.map((s) => {
      const test = tests.find((t) => t._id.toString() === s.test.toString());
      return {
        examType: `Quiz: ${test ? test.title : 'Test'}`,
        marksObtained: s.score,
        totalMarks: s.totalMarks,
        source: 'test',
      };
    });

    const manualEntries = marks.map((m) => ({
      examType: m.examType,
      marksObtained: m.marksObtained,
      totalMarks: m.totalMarks,
      remarks: m.remarks,
      source: 'manual',
    }));

    const all = [...manualEntries, ...testEntries];
    const obtainedSum = all.reduce((sum, e) => sum + e.marksObtained, 0);
    const totalSum = all.reduce((sum, e) => sum + e.totalMarks, 0);
    const overallPercentage = totalSum ? Math.round((obtainedSum / totalSum) * 1000) / 10 : 0;

    res.status(200).json({ entries: all, obtainedSum, totalSum, overallPercentage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
