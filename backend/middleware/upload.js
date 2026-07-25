const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedTypes = /video\/.*|application\/pdf|image\/.*|application\/msword|application\/vnd\.openxmlformats-officedocument.*/;

const fileFilter = (req, file, cb) => {
  if (allowedTypes.test(file.mimetype)) return cb(null, true);
  cb(new Error('Unsupported file type. Upload a video, PDF, image, or document.'));
};

// 300MB cap — generous for lecture videos while keeping the server disk sane.
// For production on hosts with ephemeral disks (Render/Railway free tier), swap this
// storage engine for cloud storage (Cloudinary/S3) so uploads survive redeploys.
const upload = multer({ storage, fileFilter, limits: { fileSize: 300 * 1024 * 1024 } });

module.exports = upload;
