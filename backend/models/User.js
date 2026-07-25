const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Enter a valid email address'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['admin', 'teacher', 'student'], required: true },
    phone: { type: String, trim: true },

    // Student-only fields
    rollNumber: { type: String, trim: true, sparse: true, unique: true },
    batch: { type: String, trim: true }, // e.g. "BCA Sem 3 - Morning"
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },

    // Teacher-only fields
    employeeId: { type: String, trim: true, sparse: true, unique: true },
    subject: { type: String, trim: true },

    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },

    // Only meaningful for self-registered students. Accounts an admin creates directly
    // default to 'Approved' since the admin creating it is itself the approval.
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Approved' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
