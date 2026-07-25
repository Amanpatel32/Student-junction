const jwt = require('jsonwebtoken');

const generateToken = (userId, role) => {
  // Map teacher role to admin since teacher is no longer used
  const normalizedRole = role === 'teacher' ? 'admin' : role;
  return jwt.sign({ id: userId, role: normalizedRole }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
