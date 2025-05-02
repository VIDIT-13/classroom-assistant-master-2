import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FaClipboardList, FaUser, FaArrowRight, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.6, transition: { duration: 0.5 } },
  };

  return (
    <div className="p-10 min-h-screen flex items-center justify-center relative">
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
      
      {/* Floating animated bubbles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`floating-bubble-${i}`}
          initial={{ 
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: 0.3
          }}
          animate={{ 
            x: Math.random() * 400 - 200,
            y: Math.random() * 400 - 200,
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: Math.random() * 10 + 10,
            ease: "easeInOut"
          }}
          className="absolute rounded-full bg-purple-300 opacity-20"
          style={{
            width: `${Math.random() * 100 + 40}px`,
            height: `${Math.random() * 80 + 40}px`,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl w-full mx-auto z-10"
      >
        {/* Welcome Header */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 text-white relative" 
            style={{ background: 'linear-gradient(90deg, #6820C6 0%, #6563FF 65.5%, #AB04B7 100%)' }}>
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-purple-600 mr-4 shadow-md">
                {user?.role === 'teacher' ? (
                  <FaChalkboardTeacher size={30} />
                ) : (
                  <FaUserGraduate size={30} />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
                {/* <div className="inline-flex items-center px-3 py-1 mt-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium">
                  {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                </div> */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignments Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                  <FaClipboardList size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Assignments</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                {user?.role === 'teacher'
                  ? 'Create and manage assignments for your students and view their submissions'
                  : 'View and submit your assignments'}
              </p>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/assignments" 
                  className="flex items-center justify-between w-full py-3 px-4 rounded-lg text-white font-medium"
                  style={{ background: 'linear-gradient(90deg, #30184F 0%, #9747FF 100%)' }}
                >
                  <span>{user?.role === 'teacher' ? 'Manage Assignments' : 'View Assignments'}</span>
                  <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            variants={cardVariants}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                  <FaUser size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
              </div>
              
              <p className="text-gray-600 mb-6">
                Update your profile information and view your account details
              </p>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-between w-full py-3 px-4 rounded-lg text-white font-medium"
                  style={{ background: 'linear-gradient(90deg, #30184F 0%, #9747FF 100%)' }}
                >
                  <span>View Profile</span>
                  <FaArrowRight />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;