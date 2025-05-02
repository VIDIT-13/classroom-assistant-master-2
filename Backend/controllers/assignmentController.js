const Assignment = require('../models/Assignment');
const User = require('../models/User');
const { processDocument } = require('../services/doucumentAIServices');
const asyncHandler = require('express-async-handler');
const path = require('path');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  
  if (!req.files ||  !req.files.questionFile ||  !req.files.answerFile) {
    res.status(400);
    throw new Error('Please upload both question and answer files');
  }

  const questionFilePath = req.files.questionFile[0].path;
  const answerFilePath = req.files.answerFile[0].path;

  // Process documents to extract text
  const [questionText, answerText] = await Promise.all([
    processDocument(questionFilePath),
    processDocument(answerFilePath),
  ]);

  const assignment = await Assignment.create({
    title,
    description,
    teacher: req.user._id,
    questionFile: req.files.questionFile[0].filename,
    answerFile: req.files.answerFile[0].filename,
    questionText,
    answerText,
    dueDate,
  });

  res.status(201).json(assignment);
});

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
  let assignments;
  
  if (req.user.role === 'teacher') {
    assignments = await Assignment.find({ teacher: req.user._id })
      .populate('teacher', 'name email');
  } else {
    assignments = await Assignment.find()
      .populate('teacher', 'name email');
  }

  res.json(assignments);
});

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .populate('teacher', 'name email');

  if (assignment) {
    res.json(assignment);
  } else {
    res.status(404);
    throw new Error('Assignment not found');
  }
});

// @desc    Download assignment file
// @route   GET /api/assignments/:id/download/:fileType
// @access  Private
const downloadAssignmentFile = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  let filePath;
  if (req.params.fileType === 'question') {
    filePath = path.join(__dirname, '../../uploads/assignments/questions', assignment.questionFile);
  } else if (req.params.fileType === 'answer') {
    // Only teacher can download answer file
    if (req.user.role !== 'teacher' && req.user._id.toString() !== assignment.teacher.toString()) {
      res.status(403);
      throw new Error('Not authorized to download answer file');
    }
    filePath = path.join(__dirname, '../../uploads/assignments/answers', assignment.answerFile);
  } else {
    res.status(400);
    throw new Error('Invalid file type');
  }

  res.download(filePath);
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  downloadAssignmentFile,
};
