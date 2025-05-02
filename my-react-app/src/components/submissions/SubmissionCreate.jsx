import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import submissionService from '../../api/submissions';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaUpload, FaFilePdf, FaArrowLeft } from 'react-icons/fa';

const SubmissionCreate = () => {
  const { id: assignmentId } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please upload a solution file');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('solutionFile', file);
      
      await submissionService.createOrUpdateSubmission(
        assignmentId,
        formData,
        user.token
      );
      
      navigate(`/assignments/${assignmentId}`, {
        state: { message: 'Submission successful!' }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
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

  return (
    <div className="p-8 relative overflow-hidden">
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
        className="container mx-auto max-w-2xl z-10 relative"
      >
        {/* Header section with gradient background */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 text-white relative" 
            style={{ background: 'linear-gradient(90deg, #6820C6 0%, #6563FF 65.5%, #AB04B7 100%)' }}>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-600 mr-4 shadow-md">
                <FaUpload size={24} />
              </div>
              <h2 className="text-2xl font-bold">Submit Assignment Solution</h2>
            </div>
          </div>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div 
            variants={itemVariants}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {/* Submission form */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl p-6 shadow-lg mb-6"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-purple-800 font-medium mb-2" htmlFor="solutionFile">
                Your Handwritten Solution (PDF only)
              </label>
              
              <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center bg-purple-50 hover:bg-purple-100 transition-colors">
                <div className="mb-4">
                  <FaFilePdf className="mx-auto text-purple-500" size={48} />
                </div>
                
                {file ? (
                  <div className="text-purple-700 font-medium">
                    <p>Selected file: {file.name}</p>
                    <p className="text-xs text-purple-500 mt-1">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <p className="text-purple-600 mb-4">
                    Please upload a PDF file of your handwritten solution
                  </p>
                )}
                
                <input
                  type="file"
                  id="solutionFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <label
                  htmlFor="solutionFile"
                  className="inline-block bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors cursor-pointer"
                >
                  {file ? 'Change File' : 'Select File'}
                </label>
              </div>
            </div>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate(`/assignments/${assignmentId}`)}
                className="flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" />
                Cancel
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="flex items-center bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 transition-colors"
              >
                <FaUpload className="mr-2" />
                {loading ? 'Submitting...' : 'Submit Solution'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SubmissionCreate;