import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Bubble animation variants
  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 0.6, transition: { duration: 0.5 } },
  };

  // Staggered text animation for the tagline
  const taglineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    },
  };

  const tagline = "Empowering educators, enhancing learning—AI-driven grading for a smarter future.";

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left side - Login form */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center  relative bg-white"
      >
        {/* Bubbles in background */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={bubbleVariants}
            initial="initial"
            animate="animate"
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              borderRadius: '100%',
              backgroundColor: '#E6D5F7',
              zIndex: 0,
            }}
          />
        ))}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md z-10"
        >
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-purple-700"
            style={{ background: 'linear-gradient(90deg, #9747FF -7.34%, #6563FF 58.94%, #AB04B7 125.23%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Login
          </motion.h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 text-red-700 p-3 rounded-md mb-4"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="alice@gmail.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md text-white font-medium"
              style={{ background: 'linear-gradient(90deg, #30184F 0%, #9747FF 100%)' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Or Sign in with</p>
            <div className="flex justify-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaGoogle className="text-red-500" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaFacebook className="text-blue-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <FaXTwitter />
              </motion.button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600">
              Don't have an account?{' '}
              <motion.a
                whileHover={{ scale: 1.05 }}
                className="text-purple-600 font-medium hover:underline"
                href="/register"
              >
                Register
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right side - Gradient and tagline */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex w-1/2 relative items-center justify-center"
        style={{ background: 'radial-gradient(71.11% 50% at 50% 50%, #9902A3 33.5%, #30184F 100%)' }}
      >
        {/* Animated bubbles for the gradient side */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`gradient-bubble-${i}`}
            initial={{ 
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: 0.3
            }}
            animate={{ 
              x: Math.random() * 400 - 200,
              y: Math.random() * 400 - 200,
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              repeat: Infinity,
              duration: Math.random() * 10 + 10,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-purple-300 opacity-30"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
            }}
          />
        ))}

        {/* Tagline with staggered animation */}
        <motion.div 
          className="z-10 p-12 max-w-md text-white text-xl font-medium"
          variants={taglineVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p>
            {tagline.split('').map((char, index) => (
              <motion.span key={index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;