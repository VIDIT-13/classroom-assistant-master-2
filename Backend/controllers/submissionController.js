const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const { processDocument } = require('../services/doucumentAIServices');
const { generateSummary } = require('../services/geminiServices');
const asyncHandler = require('express-async-handler');
const path = require('path');
const { evaluateCodingAssignment } = require('./assignmentController');
// @desc    Get student's submission for an assignment
// @route   GET /api/submissions/assignment/:assignmentId/student/:studentId
// @access  Private
const getStudentSubmission = asyncHandler(async (req, res) => {
  const { assignmentId, studentId } = req.params;
  
  console.log('Fetching submission with params:', {
    assignmentId,
    studentId,
    requestUserRole: req.user.role,
    requestUserId: req.user._id.toString()
  });

  // Verify the requesting user has access
  if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
    console.warn('Unauthorized submission access attempt by student');
    res.status(403);
    throw new Error('Not authorized to view this submission');
  }

  const submission = await Submission.findOne({
    assignment: assignmentId,
    student: studentId
  })
  .populate('assignment', 'title dueDate')
  .populate('student', 'name email');

  console.log('Submission query result:', submission ? 'Found' : 'Not Found');

  // If no submission found, return an empty array instead of throwing an error
  if (!submission) {
    console.warn(`No submission found for Assignment: ${assignmentId}, Student: ${studentId}`);
    return res.json([]);
  }

  // If teacher, verify they own the assignment
  if (req.user.role === 'teacher') {
    const assignment = await Assignment.findById(assignmentId);
    
    console.log('Assignment query for teacher:', {
      assignmentId,
      assignmentTeacherId: assignment?.teacher.toString(),
      requestUserId: req.user._id.toString()
    });

    if (assignment && assignment.teacher.toString() !== req.user._id.toString()) {
      console.warn('Unauthorized teacher access attempt');
      res.status(403);
      throw new Error('Not authorized to view this submission');
    }
  }

  res.json(submission);
});

// @desc    Create a new submission
// @route   POST /api/assignments/:id/submit
// @access  Private/Student
const createSubmission = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit assignments');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a solution file');
  }

  // Check if student has already submitted
  const existingSubmission = await Submission.findOne({
    assignment: assignment._id,
    student: req.user._id,
  });

  if (existingSubmission) {
    res.status(400);
    throw new Error('You have already submitted this assignment');
  }

  // Process the handwritten solution
  const solutionFilePath = req.file.path;
  const extractedText = await processDocument(solutionFilePath);

  // Generate summary using Gemini
  const summary = await generateSummary(
    assignment.questionText,
    assignment.answerText,
    extractedText
  );

  const submission = await Submission.create({
    assignment: assignment._id,
    student: req.user._id,
    solutionFile: req.file.filename,
    extractedText,
    summary,
  });

  res.status(201).json(submission);
});
// @desc    Create or update a submission
// @route   POST /api/submissions/assignment/:assignmentId
// @access  Private/Student
const createOrUpdateSubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.params.assignmentId;
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (req.user.role !== 'student') {
    res.status(403);
    throw new Error('Only students can submit assignments');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a solution file');
  }

  // Check for existing submission
  let submission = await Submission.findOne({
    assignment: assignmentId,
    student: req.user._id
  });

  try {
    // Process the handwritten solution
    const solutionFilePath = req.file.path;
    const extractedText = await processDocument(solutionFilePath);

    // Generate summary using Gemini
    const summary = await generateSummary(
      assignment.questionText,
      assignment.answerText,
      extractedText
    );

    if (submission) {
      // Update existing submission
      submission.solutionFile = req.file.filename;
      submission.extractedText = extractedText;
      submission.summary = summary;
      submission.submittedAt = Date.now();
      submission.grade = undefined;
      submission.feedback = undefined;
      await submission.save();
    } else {
      // Create new submission
      submission = await Submission.create({
        assignment: assignmentId,
        student: req.user._id,
        solutionFile: req.file.filename,
        extractedText,
        summary
      });
    }

    res.status(201).json({
      _id: submission._id,
      assignment: submission.assignment,
      student: submission.student,
      solutionFile: `/uploads/submissions/${submission.solutionFile}`,
      extractedText: submission.extractedText,
      summary: submission.summary,
      submittedAt: submission.submittedAt,
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    res.status(500);
    throw new Error('Server error during submission processing');
  }
});

// @desc    Get submissions for an assignment (teacher view)
// @route   GET /api/assignments/:id/submissions
// @access  Private/Teacher
// @desc    Get submissions for an assignment (teacher view)
// @route   GET /api/assignments/:assignmentId/submissions
// @access  Private/Teacher
const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  // Check if the requesting teacher is the owner of the assignment
  if (req.user.role !== 'teacher' || assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view submissions for this assignment');
  }

  const submissions = await Submission.find({ assignment: assignmentId })
    .populate('student', 'name email _id')
    .sort({ submittedAt: -1 }); // Sort by most recent first

  // Format the response to include student details properly
  const formattedSubmissions = submissions.map(sub => ({
    _id: sub._id,
    student: {
      _id: sub.student._id,
      name: sub.student.name,
      email: sub.student.email
    },
    solutionFile: sub.solutionFile,
    extractedText: sub.extractedText,
    summary: sub.summary,
    submittedAt: sub.submittedAt,
    grade: sub.grade,
    feedback: sub.feedback
  }));

  res.json(formattedSubmissions);
});

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate('student', 'name email')
    .populate('assignment', 'title description');

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check authorization
  if (req.user.role === 'student' && submission.student._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this submission');
  }

  if (req.user.role === 'teacher') {
    const assignment = await Assignment.findById(submission.assignment._id);
    if (assignment.teacher.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to view this submission');
    }
  }

  res.json(submission);
});

// @desc    Download submission file
// @route   GET /api/submissions/:id/download
// @access  Private
const downloadSubmissionFile = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // Check authorization
  if (req.user.role === 'student' && submission.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to download this submission');
  }

  if (req.user.role === 'teacher') {
    const assignment = await Assignment.findById(submission.assignment);
    if (assignment.teacher.toString() !== req.user._id.toString()) {
res.status(403);
      throw new Error('Not authorized to download this submission');
    }
  }

  const filePath = path.join(__dirname, '../../uploads/submissions', submission.solutionFile);
  res.download(filePath);
});

// @desc    Add grade and feedback to submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Teacher
const gradeSubmission = asyncHandler(async (req, res) => {
  const { grade, feedback } = req.body;
  const submission = await Submission.findById(req.params.id);

  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  const assignment = await Assignment.findById(submission.assignment);

  // Check if the requesting teacher is the owner of the assignment
  if (assignment.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to grade this submission');
  }

  submission.grade = grade;
  submission.feedback = feedback;
  await submission.save();

  res.json(submission);
});

module.exports = {
  getStudentSubmission,
  createOrUpdateSubmission,
  createSubmission,
  getSubmissionsForAssignment,
  getSubmissionById,
  downloadSubmissionFile,
  gradeSubmission,
  evaluateCodingAssignment
};