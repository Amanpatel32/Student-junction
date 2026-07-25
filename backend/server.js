require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const testRoutes = require('./routes/testRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const markRoutes = require('./routes/markRoutes');
const materialRoutes = require('./routes/materialRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const galleryRoutes = require('./routes/galleryRoutes');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serves uploaded videos/documents (e.g. /uploads/171234-lecture1.mp4)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/marks', markRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/gallery', galleryRoutes);

app.get('/', (req, res) => res.send('Student Junction API is running'));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Central error handler (catches anything thrown outside try/catch, including multer errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message && err.message.includes('Unsupported file type')) {
    return res.status(400).json({ message: err.message });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File is too large. Maximum upload size is 300MB.' });
  }
  res.status(500).json({ message: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
