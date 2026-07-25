const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  rollNumber: user.rollNumber,
  batch: user.batch,
  employeeId: user.employeeId,
  subject: user.subject,
  status: user.status,
  approvalStatus: user.approvalStatus,
});

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

exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, rollNumber, batch, guardianName, guardianPhone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const payload = { name, email, password, phone, role: 'student', approvalStatus: 'Pending' };
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

exports.bootstrap = async (req, res) => {
  try {
    const { name, email, password, force } = req.body;
    const existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      if (force === true && email && password) {
        existingAdmin.password = password;
        if (name) existingAdmin.name = name;
        if (email) existingAdmin.email = email.toLowerCase();
        await existingAdmin.save();
        const token = generateToken(existingAdmin._id, existingAdmin.role);
        return res.status(200).json({ message: 'Admin password reset successfully', token, user: publicUser(existingAdmin) });
      }
      return res.status(400).json({ message: 'An admin already exists. Use the login page instead.' });
    }

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const user = await User.create({ name, email, password, role: 'admin' });
    const token = generateToken(user._id, user.role);
    res.status(201).json({ message: 'Admin account created', token, user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }
    res.status(400).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json(publicUser(req.user));
};

exports.publicUser = publicUser;
