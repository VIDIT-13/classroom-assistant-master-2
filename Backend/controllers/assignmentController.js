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

const createCodingAssignment = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, questions } = req.body;

    // Basic validation
    if (!title || !description || !dueDate || !Array.isArray(questions) || questions.length === 0) {
      res.status(400);
      throw new Error('Please provide title, description, dueDate, and at least one question');
    }

    for (const q of questions) {
      if (!q.question || !Array.isArray(q.sampleTestCases) || !Array.isArray(q.hiddenTestCases)) {
        res.status(400);
        throw new Error('Each question must have question text, sampleTestCases, and hiddenTestCases');
      }
      if (q.sampleTestCases.length === 0 || q.hiddenTestCases.length === 0) {
        res.status(400);
        throw new Error('Each question must have at least one sample and one hidden test case');
      }
      // Optionally, further validate test case structure here
    }

    const assignment = await CodingAssignment.create({
      title,
      description,
      dueDate,
      teacher: req.user._id, // assuming you want to track the teacher
      questions,
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating coding assignment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAssignments = asyncHandler(async (req, res) => {
  try {
    let textAssignments, codingAssignments;

    if (req.user.role === 'teacher') {
      textAssignments = await Assignment.find({ teacher: req.user._id })
        .populate('teacher', 'name email');
      codingAssignments = await CodingAssignment.find({ teacher: req.user._id })
        .populate('teacher', 'name email');
    } else {
      textAssignments = await Assignment.find()
        .populate('teacher', 'name email');
      codingAssignments = await CodingAssignment.find()
        .populate('teacher', 'name email');
    }

    const textAssignmentsWithType = textAssignments.map(a => ({
      ...a.toObject(),
      assignmentType: 'text',
    }));
    const codingAssignmentsWithType = codingAssignments.map(a => ({
      ...a.toObject(),
      assignmentType: 'coding',
    }));

    res.json([...textAssignmentsWithType, ...codingAssignmentsWithType]);
  } catch (error) {
    console.error('Error in getAssignments:', error); // Debug log
    res.status(500).json({ message: 'Internal Server Error' });
  }
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

const getCodingAssignmentById = asyncHandler(async (req, res) => {
  try {
    const assignment = await CodingAssignment.findById(req.params.id)
      .populate('teacher', 'name email');

    if (assignment) {
      res.json(assignment);
    } else {
      res.status(404);
      throw new Error('Coding assignment not found');
    }
  } catch (error) {
    console.error('Error in getCodingAssignmentById:', error); // Debug log
    res.status(500).json({ message: 'Internal Server Error' });
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


const axios = require('axios');
const CodingAssignment = require('../models/CodingAssignment');

const JUDGE0_API_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
const JUDGE0_HEADERS = {
  "Content-Type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY, // Set this in your backend .env
};

const LANGUAGE_MAP = {
  python: 71,
  javascript: 63,
  cpp: 54,
  java: 62,
};

async function evaluateCodingAssignment(req, res) {
  try {
    const { assignmentId, answers } = req.body;
    // answers: { [questionIdx]: { language, code } }

    const assignment = await CodingAssignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const evaluation = [];

    for (let i = 0; i < assignment.questions.length; i++) {
      const question = assignment.questions[i];
      const answer = answers[i];
      if (!answer) {
        evaluation.push({
          questionIdx: i,
          status: "not attempted",
          results: [],
        });
        continue;
      }
      const { language, code } = answer;
      const language_id = LANGUAGE_MAP[language];
      if (!language_id) {
        evaluation.push({
          questionIdx: i,
          status: "invalid language",
          results: [],
        });
        continue;
      }
      // Evaluate all hidden test cases
      const testCaseResults = [];
      let allPassed = true;
      for (const tc of question.hiddenTestCases) {
        // Run code on Judge0
        try {
          const response = await axios.post(
            JUDGE0_API_URL,
            {
              source_code: code,
              language_id,
              stdin: tc.input,
            },
            { headers: JUDGE0_HEADERS }
          );
          const output = (response.data.stdout ?? response.data.compile_output ?? response.data.stderr ?? '').trim();
          const expected = tc.output.trim();
          const passed = output === expected;
          if (!passed) allPassed = false;
          testCaseResults.push({
            input: tc.input,
            expectedOutput: expected,
            actualOutput: output,
            passed,
          });
        } catch (err) {
          allPassed = false;
          testCaseResults.push({
            input: tc.input,
            expectedOutput: tc.output,
            actualOutput: '',
            passed: false,
            error: 'Judge0 error',
          });
        }
      }
      evaluation.push({
        questionIdx: i,
        status: allPassed ? "passed" : "failed",
        results: testCaseResults,
      });
    }

    return res.json({
      assignmentId,
      evaluation,
    });
  } catch (err) {
    console.error('Evaluation error:', err);
    return res.status(500).json({ message: "Evaluation failed", error: err.message });
  }
}

module.exports = {
  createAssignment,
  createCodingAssignment,
  getAssignments,
  getAssignmentById,
  getCodingAssignmentById,
  downloadAssignmentFile,
  evaluateCodingAssignment,
};
