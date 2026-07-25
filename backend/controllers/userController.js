const User = require('../models/User');
const { publicUser } = require('./authController');

// @desc    List users, optionally filtered by role and/or search term
// @route   GET /api/users?role=student&search=term
exports.getUsers = async (req, res) => {
  try {
    const { role, search, approvalStatus } = req.query;
    const query = {};
    if (role) query.role = role;
    if (approvalStatus) query.approvalStatus = approvalStatus;
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      query.$or = [{ name: regex }, { email: regex }, { rollNumber: regex }, { batch: regex }, { employeeId: regex }];
    }
    const users = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json(users.map(publicUser));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get a single user
// @route   GET /api/users/:id
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(publicUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a user (profile fields, status, or reset password)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const updates = { ...req.body };
    // Only re-hash if a new password was actually provided
    if (!updates.password) delete updates.password;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    Object.assign(user, updates);
    await user.save();
    res.status(200).json(publicUser(user));
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

// @desc    Delete a user
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
