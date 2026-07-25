const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

const computeSummary = (records) => {
  // records: array of Attendance docs, each with .records[{student, status}]
  const perStudent = {};
  records.forEach((day) => {
    day.records.forEach((r) => {
      const id = r.student.toString ? r.student.toString() : r.student;
      if (!perStudent[id]) perStudent[id] = { present: 0, total: 0 };
      perStudent[id].total += 1;
      if (r.status === 'Present' || r.status === 'Late') perStudent[id].present += 1;
    });
  });
  return perStudent;
};

// @desc    Mark or update attendance for a course on a given date (upsert)
// @route   POST /api/attendance
exports.markAttendance = async (req, res) => {
  try {
    const { course, date, records } = req.body;
    if (!course || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: 'course, date, and records[] are required' });
    }

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOneAndUpdate(
      { course, date: dayStart },
      { course, date: dayStart, records, markedBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.status(200).json(attendance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Full attendance sheet for a course (all dates), plus per-student % summary
// @route   GET /api/attendance/course/:courseId
exports.getCourseAttendance = async (req, res) => {
  try {
    const days = await Attendance.find({ course: req.params.courseId })
      .sort({ date: 1 })
      .populate('records.student', 'name rollNumber');

    const summary = computeSummary(days);
    res.status(200).json({ days, summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    The logged-in student's own attendance for a course
// @route   GET /api/attendance/my/:courseId
exports.getMyAttendance = async (req, res) => {
  try {
    const days = await Attendance.find({ course: req.params.courseId, 'records.student': req.user._id }).sort({
      date: 1,
    });

    let present = 0;
    const rows = days.map((day) => {
      const rec = day.records.find((r) => r.student.toString() === req.user._id.toString());
      if (rec && (rec.status === 'Present' || rec.status === 'Late')) present += 1;
      return { date: day.date, status: rec ? rec.status : 'Absent' };
    });

    const percentage = rows.length ? Math.round((present / rows.length) * 100) : 0;
    res.status(200).json({ rows, percentage, totalDays: rows.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
