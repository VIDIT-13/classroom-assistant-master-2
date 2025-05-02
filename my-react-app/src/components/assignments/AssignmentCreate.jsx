import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import assignmentService from '../../api/assignments';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaClipboardList, FaPlus, FaUpload, FaCalendarAlt, FaFileAlt, FaArrowLeft } from 'react-icons/fa';

const AssignmentCreate = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
  });
  const [questionFile, setQuestionFile] = useState(null);
  const [answerFile, setAnswerFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e, type) => {
    if (type === 'question') {
      setQuestionFile(e.target.files[0]);
    } else {
      setAnswerFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionFile || !answerFile) {
      setError('Please upload both question and answer files');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('dueDate', formData.dueDate);
      data.append('questionFile', questionFile);
      data.append('answerFile', answerFile);

      await assignmentService.createAssignment(data, user.token);
      navigate('/assignments');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.6, transition: { duration: 0.5 } },
  };

  const inputClasses = "w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent";
  const labelClasses = "block text-gray-700 font-medium mb-2";
  const fileInputWrapperClasses = "w-full px-4 py-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer";

  return (
    <div className="p-8 relative min-h-screen">
      {/* Animated background bubbles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          variants={bubbleVariants}
          initial="initial"
          animate="animate"
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 100 + 20}px`,
            height: `${Math.random() * 100 + 20}px`,
            borderRadius: '100%',
            backgroundColor: '#E6D5F7',
            zIndex: 0,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto max-w-3xl z-10 relative"
      >
        {/* Header section with gradient background */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 text-white relative" 
            style={{ background: 'linear-gradient(90deg, #6820C6 0%, #6563FF 65.5%, #AB04B7 100%)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 mr-4 shadow-md">
                  <FaPlus size={24} />
                </div>
                <h2 className="text-2xl font-bold">Create Assignment</h2>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/assignments"
                  className="flex items-center bg-white text-purple-700 py-2 px-4 rounded-full hover:bg-purple-50 shadow-md"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white border border-purple-100 rounded-xl p-6 shadow-md mb-6"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start"
            >
              <div className="mr-3 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <span>{error}</span>
            </motion.div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <motion.div variants={itemVariants}>
              <label className={labelClasses} htmlFor="questionFile">
                <span className="flex items-center">
                  <FaUpload className="text-purple-500 mr-2" />
                  Question File (PDF)
                </span>
              </label>
              <div className={fileInputWrapperClasses}>
                <input
                  type="file"
                  id="questionFile"
                  name="questionFile"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'question')}
                  className="hidden"
                  required
                />
                <label htmlFor="questionFile" className="flex items-center cursor-pointer">
                  <div className="bg-purple-100 p-2 rounded-md mr-3">
                    <FaUpload className="text-purple-600" />
                  </div>
                  <div className="flex-1 truncate">
                    {questionFile ? questionFile.name : "Click to upload question file"}
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Only PDF files are supported</p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className={labelClasses} htmlFor="answerFile">
                <span className="flex items-center">
                  <FaUpload className="text-purple-500 mr-2" />
                  Answer File (PDF)
                </span>
              </label>
              <div className={fileInputWrapperClasses}>
                <input
                  type="file"
                  id="answerFile"
                  name="answerFile"
                  accept=".pdf"
                  onChange={(e) => handleFileChange(e, 'answer')}
                  className="hidden"
                  required
                />
                <label htmlFor="answerFile" className="flex items-center cursor-pointer">
                  <div className="bg-purple-100 p-2 rounded-md mr-3">
                    <FaUpload className="text-purple-600" />
                  </div>
                  <div className="flex-1 truncate">
                    {answerFile ? answerFile.name : "Click to upload answer file"}
                  </div>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">Only PDF files are supported</p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="pt-4"
            >
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
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AssignmentCreate;