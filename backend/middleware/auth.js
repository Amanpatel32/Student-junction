const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT and attaches the user (minus password) to req.user
exports.protect = async (req, res, next) => {
  let token;
  const header = req.headers.authorization;

  if (header && header.startsWith('Bearer')) {
    token = header.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ message: 'User for this token no longer exists' });
    }
    if (req.user.status === 'Inactive') {
      return res.status(403).json({ message: 'This account has been deactivated' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

// Restricts a route to specific roles, e.g. authorize('admin', 'teacher')
exports.authorize = (...roles) => (req, res, next) => {
  // Map teacher role to admin since teacher is no longer used
  const effectiveRole = req.user.role === 'teacher' ? 'admin' : req.user.role;
  if (!roles.includes(effectiveRole)) {
    return res.status(403).json({ message: `Role "${req.user.role}" is not permitted to perform this action` });
  }
  next();
};
