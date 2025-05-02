const express = require('express');
const router = express.Router();
const { protect, teacher, student } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createOrUpdateSubmission,
  getStudentSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission
} = require('../controllers/submissionController');

// Submission routes with clear, consistent naming
router.post(
  '/assignments/:assignmentId/submissions', // Updated to match client-side method
  protect,
  student,
  upload.single('solutionFile'),
  createOrUpdateSubmission
);

router.get(
  '/assignments/:assignmentId/student/:studentId', 
  protect, 
  getStudentSubmission
);

router.get(
  '/assignments/:assignmentId/submissions', 
  protect, 
  teacher,
  getSubmissionsForAssignment
);

router.put(
  '/submissions/:id/grade', 
  protect, 
  teacher, 
  gradeSubmission
);

router.get(
  '/submissions/:id', 
  protect, 
  getSubmissionById
);

router.get(
  '/submissions/:id/download', 
  protect, 
  downloadSubmissionFile
);

module.exports = router;