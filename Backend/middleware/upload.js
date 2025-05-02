const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../../uploads/assignments/questions'),
  path.join(__dirname, '../../uploads/assignments/answers'),
  path.join(__dirname, '../../uploads/submissions'),
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = '';
    
    if (file.fieldname === 'questionFile') {
      uploadPath = path.join(__dirname, '../../uploads/assignments/questions');
    } else if (file.fieldname === 'answerFile') {
      uploadPath = path.join(__dirname, '../../uploads/assignments/answers');
    } else if (file.fieldname === 'solutionFile') {
      uploadPath = path.join(__dirname, '../../uploads/submissions');
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
});

module.exports = upload;