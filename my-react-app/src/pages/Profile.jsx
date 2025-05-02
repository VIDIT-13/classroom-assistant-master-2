import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../api/auth';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser, FaEnvelope, FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getProfile(user.token);
        setProfile(profileData);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  // Bubble animation variants
  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.6, transition: { duration: 0.5 } },
  };

  // Profile card animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
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
          <p className="text-gray-600 font-medium">Loading profile...</p>
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
    <div className="p-10 flex items-center justify-center relative " 
      >
      
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
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full mx-4 bg-white rounded-xl shadow-lg overflow-hidden z-10"
      >
        {/* Profile header with gradient */}
        <div className="p-6 text-white relative" 
          style={{ background: 'linear-gradient(90deg, #6820C6 0%, #6563FF 65.5%, #AB04B7 100%)' }}>
          
          <motion.div 
            className="flex items-center mb-4"
            variants={itemVariants}
          >
            {/* Profile avatar */}
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-purple-600 mr-4 shadow-md">
              <FaUser size={36} />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold">{profile?.name}</h1>
              <div className="flex items-center text-purple-100 mt-1">
                <FaEnvelope className="mr-2" size={14} />
                <span className="text-sm">{profile?.email}</span>
              </div>
            </div>
          </motion.div>
          
          {/* <motion.div variants={itemVariants}>
            <span className="inline-flex items-center px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium">
              {profile?.role === 'teacher' ? (
                <>
                  <FaChalkboardTeacher className="mr-2" />
                  Teacher
                </>
              ) : (
                <>
                  <FaUserGraduate className="mr-2" />
                  Student
                </>
              )}
            </span>
          </motion.div> */}
        </div>
        
        {/* Profile content */}
        <div className="p-6">
          <motion.div 
            className="mt-2 mb-6"
            variants={itemVariants}
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <FaCalendarAlt className="mr-2 text-purple-600" />
                  <span className="text-sm font-medium">Account Created</span>
                </div>
                <div className="text-sm text-gray-900 font-semibold">
                  {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="space-y-3"
            variants={itemVariants}
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center"
              style={{ background: 'linear-gradient(90deg, #30184F 0%, #9747FF 100%)' }}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;