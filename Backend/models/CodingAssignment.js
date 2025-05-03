const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input:   { type: String, required: true },
  output:  { type: String, required: true }
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  question:           { type: String, required: true },
  sampleTestCases:    { type: [TestCaseSchema], required: true },
  hiddenTestCases:    { type: [TestCaseSchema], required: true }
}, { _id: false });

const CodingAssignmentSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  dueDate:      { type: Date, required: true },
  questions:    { type: [QuestionSchema], required: true },
  teacher:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // <-- Added teacher field
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('CodingAssignment', CodingAssignmentSchema);