import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import assignmentService from '../../api/assignments';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaPlus, FaDownload, FaClipboardList, FaCalendarAlt, FaUser } from 'react-icons/fa';

const AssignmentList = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await assignmentService.getAssignments(user.token);
        setAssignments(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user.token]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-t-4 border-purple-600 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading assignments...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="bg-red-50 text-red-700 p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-8 relative  overflow-hidden ">
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
        className="container mx-auto max-w-4xl z-10 relative"
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
                  <FaClipboardList size={24} />
                </div>
                <h2 className="text-2xl font-bold">Assignments</h2>
              </div>
              
              {user.role === 'teacher' && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/assignments/create"
                    className="flex items-center bg-white text-purple-700 py-2 px-4 rounded-full hover:bg-purple-50 shadow-md"
                  >
                    <FaPlus className="mr-2" />
                    Create Assignment
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Assignment list */}
        {assignments.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="bg-white rounded-xl p-8 text-center shadow-lg"
          >
            <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
              <FaClipboardList size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No assignments found</h3>
            <p className="text-gray-600">
              {user.role === 'teacher' 
                ? "Create your first assignment by clicking the 'Create Assignment' button above."
                : "There are no assignments available for you at the moment."}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {assignments?.map((assignment) => (
              <motion.div 
                key={assignment._id} 
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white border border-purple-100 rounded-xl p-6 shadow-md hover:shadow-lg"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="flex-1">
                    <Link to={`/assignments/${assignment._id}`}>
                      <h3 className="text-xl font-semibold text-purple-800 hover:text-purple-600 transition-colors">
                        {assignment.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 mt-2 mb-4">{assignment.description}</p>
                    
                    <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 space-x-4">
                      <div className="flex items-center">
                        <FaUser className="text-purple-400 mr-2" />
                        <span>Created by: {assignment.teacher?.name || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        <FaCalendarAlt className="text-purple-400 mr-2" />
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/question`}
                      download
                      className="flex items-center justify-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <FaDownload className="mr-2" />
                      <span>Download Questions</span>
                    </motion.a>
                    
                    {user.role === 'teacher' && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`${process.env.REACT_APP_API_URL}/api/assignments/${assignment._id}/download/answer`}
                        download
                        className="flex items-center justify-center bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <FaDownload className="mr-2" />
                        <span>Download Answers</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AssignmentList;