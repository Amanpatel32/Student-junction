const express = require('express');
const router = express.Router();
const { login, register, registerStudent, getMe } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
// Public: students can self-register, but land in Pending status until an admin approves them
router.post('/register-student', registerStudent);
// Only admins create accounts directly (teachers/other admins, or pre-approved students)
router.post('/register', protect, authorize('admin'), register);

module.exports = router;
