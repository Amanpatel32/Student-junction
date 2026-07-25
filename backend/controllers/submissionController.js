const Test = require('../models/Test');
const Submission = require('../models/Submission');

// @desc    Student submits answers for a test; auto-graded on the spot
// @route   POST /api/submissions
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'testId and answers[] are required' });
    }

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    if (!test.isPublished) return res.status(403).json({ message: 'This test is not published yet' });

    const existing = await Submission.findOne({ test: testId, student: req.user._id });
    if (existing) return res.status(400).json({ message: 'You have already submitted this test' });

    let score = 0;
    const breakdown = test.questions.map((q, i) => {
      const selected = typeof answers[i] === 'number' ? answers[i] : -1;
      const correct = selected === q.correctOption;
      if (correct) score += q.marks;
      return { question: q.text, selected, correctOption: q.correctOption, marks: q.marks, correct };
    });

    const totalMarks = test.questions.reduce((sum, q) => sum + q.marks, 0);

    const submission = await Submission.create({
      test: testId,
      student: req.user._id,
      answers,
      score,
      totalMarks,
    });

    res.status(201).json({ submission, breakdown });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'You have already submitted this test' });
    res.status(400).json({ message: err.message });
  }
};

// @desc    All submissions for a test, for the teacher/admin to review
// @route   GET /api/submissions/test/:testId
exports.getTestSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ test: req.params.testId })
      .populate('student', 'name rollNumber email')
      .sort({ score: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    The logged-in student's own submissions (optionally filtered by course via query on tests)
// @route   GET /api/submissions/my
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id })
      .populate({ path: 'test', select: 'title course', populate: { path: 'course', select: 'title code' } })
      .sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
