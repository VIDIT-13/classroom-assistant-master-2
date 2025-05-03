import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import assignmentService from '../../api/assignments';
import { FaClipboardList, FaPlus, FaCalendarAlt, FaFileAlt, FaTrash, FaEyeSlash, FaRegEye } from 'react-icons/fa';

const inputClasses = "w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
const labelClasses = "block text-gray-700 font-medium mb-2";

const CodingAssignmentCreate = () => {
  const { user } = useAuth();
    
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Handle main form fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle question changes
  const handleQuestionChange = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  // Handle test case changes
  const handleTestCaseChange = (qIdx, type, tIdx, field, value) => {
    const updated = [...questions];
    updated[qIdx][type][tIdx][field] = value;
    setQuestions(updated);
  };

  // Add new question
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        sampleTestCases: [{ input: '', output: '' }],
        hiddenTestCases: [{ input: '', output: '' }],
      },
    ]);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // Add test case
  const handleAddTestCase = (qIdx, type) => {
    const updated = [...questions];
    updated[qIdx][type].push({ input: '', output: '' });
    setQuestions(updated);
  };

  // Remove test case
  const handleRemoveTestCase = (qIdx, type, tIdx) => {
    const updated = [...questions];
    updated[qIdx][type].splice(tIdx, 1);
    setQuestions(updated);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!formData.title || !formData.description || !formData.dueDate) {
      setError('Please fill all assignment fields.');
      return;
    }
    if (questions.length === 0) {
      setError('Add at least one question.');
      return;
    }
    for (const q of questions) {
      if (!q.question) {
        setError('Each question must have a question text.');
        return;
      }
      if (q.sampleTestCases.length === 0 || q.hiddenTestCases.length === 0) {
        setError('Each question must have at least one sample and one hidden test case.');
        return;
      }
    }
  
    setError('');
    setLoading(true);
  
    try {
      // Prepare the payload
      const payload = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate,
        questions: questions.map(q => ({
          question: q.question,
          sampleTestCases: q.sampleTestCases.map(tc => ({
            input: tc.input,
            output: tc.output,
          })),
          hiddenTestCases: q.hiddenTestCases.map(tc => ({
            input: tc.input,
            output: tc.output,
          })),
        })),
      };
  
      // Submit to backend 
      await assignmentService.createCodingAssignment(payload, user.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create coding assignment');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start"
        >
          <div className="mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span>{error}</span>
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <label className={labelClasses} htmlFor="title">
          <span className="flex items-center">
            <FaClipboardList className="text-purple-500 mr-2" />
            Assignment Title
          </span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={inputClasses}
          placeholder="Enter assignment title"
          required
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className={labelClasses} htmlFor="description">
          <span className="flex items-center">
            <FaFileAlt className="text-purple-500 mr-2" />
            Description
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={`${inputClasses} resize-none`}
          rows="4"
          placeholder="Enter assignment description"
          required
        ></textarea>
      </motion.div>

      <motion.div variants={itemVariants}>
        <label className={labelClasses} htmlFor="dueDate">
          <span className="flex items-center">
            <FaCalendarAlt className="text-purple-500 mr-2" />
            Due Date
          </span>
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className={inputClasses}
          required
        />
      </motion.div>

      {/* Questions Section */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClasses}>
            <span className="flex items-center">
              <FaPlus className="text-purple-500 mr-2" />
              Questions
            </span>
          </label>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 shadow-md"
          >
            <FaPlus className="mr-2" /> Add Question
          </button>
        </div>

        {questions.length === 0 && (
          <div className="text-gray-400 italic text-sm mb-4">No questions added yet.</div>
        )}

        {questions.map((q, qIdx) => (
          <motion.div
            key={qIdx}
            variants={itemVariants}
            className="border border-purple-200 rounded-lg p-4 mb-6 bg-purple-50 relative"
          >
            <button
              type="button"
              onClick={() => handleRemoveQuestion(qIdx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              title="Remove question"
            >
              <FaTrash />
            </button>
            <div className="mb-4">
              <label className={labelClasses}>Question {qIdx + 1}</label>
              <textarea
                className={`${inputClasses} resize-none`}
                rows="2"
                placeholder="Enter question text"
                value={q.question}
                onChange={e => handleQuestionChange(qIdx, 'question', e.target.value)}
                required
              />
            </div>
            {/* Sample Test Cases */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className={labelClasses}>
                  <span className="flex items-center">
                    <FaRegEye className="text-green-500 mr-2" />
                    Sample Test Cases
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAddTestCase(qIdx, 'sampleTestCases')}
                  className="flex items-center text-green-600 hover:text-green-800 text-sm"
                >
                  <FaPlus className="mr-1" /> Add Sample
                </button>
              </div>
              {q.sampleTestCases.map((tc, tIdx) => (
                <div key={tIdx} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    className={`${inputClasses} flex-1`}
                    placeholder="Sample Input"
                    value={tc.input}
                    onChange={e => handleTestCaseChange(qIdx, 'sampleTestCases', tIdx, 'input', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className={`${inputClasses} flex-1`}
                    placeholder="Sample Output"
                    value={tc.output}
                    onChange={e => handleTestCaseChange(qIdx, 'sampleTestCases', tIdx, 'output', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(qIdx, 'sampleTestCases', tIdx)}
                    className="text-red-400 hover:text-red-700"
                    title="Remove sample"
                    disabled={q.sampleTestCases.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
            {/* Hidden Test Cases */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelClasses}>
                  <span className="flex items-center">
                    <FaEyeSlash className="text-orange-500 mr-2" />
                    Hidden Test Cases
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => handleAddTestCase(qIdx, 'hiddenTestCases')}
                  className="flex items-center text-orange-600 hover:text-orange-800 text-sm"
                >
                  <FaPlus className="mr-1" /> Add Hidden
                </button>
              </div>
              {q.hiddenTestCases.map((tc, tIdx) => (
                <div key={tIdx} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    className={`${inputClasses} flex-1`}
                    placeholder="Hidden Input"
                    value={tc.input}
                    onChange={e => handleTestCaseChange(qIdx, 'hiddenTestCases', tIdx, 'input', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className={`${inputClasses} flex-1`}
                    placeholder="Hidden Output"
                    value={tc.output}
                    onChange={e => handleTestCaseChange(qIdx, 'hiddenTestCases', tIdx, 'output', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTestCase(qIdx, 'hiddenTestCases', tIdx)}
                    className="text-red-400 hover:text-red-700"
                    title="Remove hidden"
                    disabled={q.hiddenTestCases.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium shadow-md flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Assignment...
            </>
          ) : (
            <>
              <FaPlus className="mr-2" />
              Create Assignment
            </>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
};

export default CodingAssignmentCreate;