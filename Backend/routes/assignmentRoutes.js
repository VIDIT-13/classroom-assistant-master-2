const express = require('express');
const router = express.Router();
const { protect, teacher } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  createAssignment,
  createCodingAssignment,
  getAssignments,
  getAssignmentById,
  getCodingAssignmentById,
  downloadAssignmentFile,
  evaluateCodingAssignment,
} = require('../controllers/assignmentController');

router.route('/')
  .post(protect, teacher, upload.fields([
    { name: 'questionFile', maxCount: 1 },
    { name: 'answerFile', maxCount: 1 },
  ]), createAssignment)
  .get(protect, getAssignments);

router.route('/:id')
  .get(protect, getAssignmentById);

router.route('/coding/:id')
  .get(protect, getCodingAssignmentById);

router.route('/coding')
  .post(protect, teacher, createCodingAssignment);

router.route('/coding/:id/attempt/submit')
  .post(protect, evaluateCodingAssignment);


router.get('/:id/download/:fileType', protect, downloadAssignmentFile);

module.exports = router;