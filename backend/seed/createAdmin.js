// Bootstraps the very first admin account.
// Usage: node seed/createAdmin.js "Admin Name" admin@institute.com "yourPassword123"
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  const [, , name, email, password] = process.argv;
  if (!name || !email || !password) {
    console.log('Usage: node seed/createAdmin.js "Admin Name" admin@institute.com "yourPassword123"');
    process.exit(1);
  }

  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`A user with email ${email} already exists.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin account created: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
})();
