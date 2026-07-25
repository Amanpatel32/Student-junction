const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  // Map teacher role to admin since teacher is no longer used
  role: user.role === 'teacher' ? 'admin' : user.role,
  phone: user.phone,
  rollNumber: user.rollNumber,
  batch: user.batch,
  employeeId: user.employeeId,
  subject: user.subject,
  status: user.status,
  approvalStatus: user.approvalStatus,
});

// @desc    Log in with email + password
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status === 'Inactive') {
      return res.status(403).json({ message: 'This account has been deactivated. Contact the administrator.' });
    }
    if (user.approvalStatus === 'Pending') {
      return res.status(403).json({ message: 'Your account is awaiting admin approval. Please check back soon.' });
    }
    if (user.approvalStatus === 'Rejected') {
      return res.status(403).json({ message: 'Your registration was not approved. Contact the administrator for details.' });
    }

    const token = generateToken(user._id, user.role);
    res.status(200).json({ token, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create a new user account (admin creates teachers/students; admin can also create other admins)
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(publicUser(user));
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${field} "${err.keyValue[field]}" is already in use` });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Public self-registration for students; account starts Pending until an admin approves it
// @route   POST /api/auth/register-student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, rollNumber, batch, guardianName, guardianPhone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Force role/approval server-side — never trust these from the request body on a public route
    const payload = { name, email, password, phone, role: 'student', approvalStatus: 'Pending' };
    // Only set optional unique-indexed fields if actually provided, so multiple blank
    // submissions don't collide on the sparse unique index
    if (rollNumber) payload.rollNumber = rollNumber;
    if (batch) payload.batch = batch;
    if (guardianName) payload.guardianName = guardianName;
    if (guardianPhone) payload.guardianPhone = guardianPhone;

    await User.create(payload);
    res.status(201).json({ message: 'Registration received. An administrator will review and approve your account before you can log in.' });
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ message: `${field} "${err.keyValue[field]}" is already in use` });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(err.errors).map((e) => e.message).join(', ') });
    }
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get the logged-in user's own profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  res.status(200).json(publicUser(req.user));
};

exports.publicUser = publicUser;
