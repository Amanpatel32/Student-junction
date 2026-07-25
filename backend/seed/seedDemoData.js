// Populates demo data: 1 teacher, 3 students, 1 course, attendance, a test, marks, a notice, and an enquiry.
// Requires an admin to already exist (run createAdmin.js first) — this script creates its own teacher/students.
// Usage: node seed/seedDemoData.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Test = require('../models/Test');
const Mark = require('../models/Mark');
const Material = require('../models/Material');
const TimetableSlot = require('../models/TimetableSlot');
const Notice = require('../models/Notice');
const Enquiry = require('../models/Enquiry');

(async () => {
  await connectDB();

  // Clear previous demo data (safe to re-run)
  await User.deleteMany({
    email: { $in: ['teacher.demo@studentjunction.com', 'student1.demo@studentjunction.com', 'student2.demo@studentjunction.com', 'student3.demo@studentjunction.com'] },
  });
  await Course.deleteMany({ code: 'CL7-MATH' });

  const teacher = await User.create({
    name: 'Neha Sinha',
    email: 'teacher.demo@studentjunction.com',
    password: 'teacher123',
    role: 'teacher',
    employeeId: 'EMP-001',
    subject: 'Mathematics',
  });

  const students = await User.create([
    { name: 'Aman Kumar', email: 'student1.demo@studentjunction.com', password: 'student123', role: 'student', rollNumber: 'SJ-C7-001', batch: 'Class VII' },
    { name: 'Priya Sharma', email: 'student2.demo@studentjunction.com', password: 'student123', role: 'student', rollNumber: 'SJ-C7-002', batch: 'Class VII' },
    { name: 'Rohit Verma', email: 'student3.demo@studentjunction.com', password: 'student123', role: 'student', rollNumber: 'SJ-C7-003', batch: 'Class VII' },
  ]);

  const course = await Course.create({
    title: 'Class VII — Mathematics',
    code: 'CL7-MATH',
    description: 'Full syllabus coverage for Class VII Mathematics, with weekly tests.',
    batch: 'Class VII',
    teacher: teacher._id,
    students: students.map((s) => s._id),
    schedule: 'Mon/Wed/Fri, 4:00 PM - 5:30 PM',
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  await Attendance.create([
    {
      course: course._id,
      date: yesterday,
      records: students.map((s, i) => ({ student: s._id, status: i === 1 ? 'Absent' : 'Present' })),
      markedBy: teacher._id,
    },
    {
      course: course._id,
      date: today,
      records: students.map((s) => ({ student: s._id, status: 'Present' })),
      markedBy: teacher._id,
    },
  ]);

  await Test.create({
    title: 'Weekly Test — Fractions',
    course: course._id,
    description: 'Basics of fractions and simplification',
    isPublished: true,
    createdBy: teacher._id,
    durationMinutes: 15,
    questions: [
      { text: 'What is 1/2 + 1/4?', options: ['1/6', '2/6', '3/4', '2/4'], correctOption: 2, marks: 2 },
      { text: 'Which fraction is the simplest form of 4/8?', options: ['2/4', '1/2', '4/8', '8/16'], correctOption: 1, marks: 2 },
      { text: 'A fraction with numerator greater than denominator is called:', options: ['Proper fraction', 'Improper fraction', 'Unit fraction', 'Decimal'], correctOption: 1, marks: 1 },
    ],
  });

  await Mark.create([
    { student: students[0]._id, course: course._id, examType: 'Class Test 1', marksObtained: 18, totalMarks: 20, enteredBy: teacher._id },
    { student: students[1]._id, course: course._id, examType: 'Class Test 1', marksObtained: 15, totalMarks: 20, enteredBy: teacher._id },
  ]);

  await Material.create({
    course: course._id,
    title: 'Fractions — Notes (Week 1)',
    description: 'Summary notes covering fraction basics and simplification rules',
    type: 'Link',
    link: 'https://example.com/fractions-notes',
    uploadedBy: teacher._id,
  });

  await TimetableSlot.create([
    { course: course._id, day: 'Mon', startTime: '16:00', endTime: '17:30', room: 'Room 1' },
    { course: course._id, day: 'Wed', startTime: '16:00', endTime: '17:30', room: 'Room 1' },
    { course: course._id, day: 'Fri', startTime: '16:00', endTime: '17:30', room: 'Room 1' },
  ]);

  await Notice.create({
    title: 'Weekly test every Saturday',
    message: 'Reminder: weekly assessment tests are held every Saturday. Please revise the week\'s topics beforehand.',
    course: null, // institute-wide
    postedBy: teacher._id,
  });

  await Enquiry.create({
    name: 'Sunita Devi',
    phone: '9123456780',
    classInterested: 'Class VI',
    message: 'Interested in admission for the upcoming session. Please call back.',
    status: 'New',
  });

  console.log('Demo data seeded:');
  console.log('  Teacher login -> teacher.demo@studentjunction.com / teacher123');
  console.log('  Student login -> student1.demo@studentjunction.com / student123');
  console.log('  A sample admission enquiry was also added — check Admin > Enquiries');

  await mongoose.disconnect();
  process.exit(0);
})();
