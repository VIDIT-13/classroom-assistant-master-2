import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from "../../assets/image 99.png"
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="text-white p-4 relative" 
           >
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="text-2xl font-bold flex items-center">
              <img src={Logo} alt="logo" className='h-20 w-56 mx-1 md:mx-10' />
            </Link>
          </motion.div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-800"
                >
                  Welcome, {user?.name || 'User'}
                </motion.span>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center space-x-6"
                >
                  <Link to="/profile" className="hover:text-gray-800 text-black transition-colors duration-300">
                    Profile
                  </Link>
                  <Link to="/assignments" className="hover:text-gray-800 text-black transition-colors duration-300">
                    Assignments
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Logout
                  </motion.button>
                </motion.div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-6"
              >
                <Link to="/login" className="text-black  transition-colors duration-300">
                  Login
                </Link>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-300">
                    Register
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>
          
          {/* Mobile hamburger */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6 text-black" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                />
              </svg>
            </motion.button>
          </div>
        </div>
      </nav>
      
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 overflow-y-auto"
          >
            <div className="p-4 flex flex-col">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <span className="text-xl font-bold text-blue-600">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleMenu}
                  className="text-gray-600 focus:outline-none"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <div className="mt-6 flex flex-col space-y-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-gray-600 font-medium">
                      Welcome, {user?.name || 'User'}
                    </span>
                    <Link 
                      to="/profile" 
                      className="py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/assignments" 
                      className="py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Assignments
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                    >
                      Logout
                    </motion.button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="py-2 px-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors duration-300"
                      onClick={toggleMenu}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black z-40"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;