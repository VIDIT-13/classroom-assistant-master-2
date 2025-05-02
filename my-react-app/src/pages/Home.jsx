import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import OutReach from "./OutreachSection"
import Feature from "./Feature"
import Extra from "./Extra"
const Home = () => {
  const { isAuthenticated } = useAuth();
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  
  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  // const featureCardVariants = {
  //   initial: { opacity: 0, y: 30 },
  //   animate: { opacity: 1, y: 0 },
  //   transition: { duration: 0.5, ease: "easeOut" }
  // };

  return (
    <div className="min-h-screen flex flex-col ">
     
        <main className="flex-grow container mx-auto px-4   flex flex-col items-center justify-center">
          <motion.div 
            className="text-center max-w-3xl"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div 
          className="mb-6 inline-block  px-3 py-1 rounded-full text-black text-sm font-sm"
          variants={fadeIn}
            >
          AI-powered feedback assistant for automated grading and personalized feedback
            </motion.div>
            
            <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-4 text-black "
          
          variants={fadeIn}
            >
          Seamless learning experience & outcomes
            </motion.h1>
            
            <motion.span 
          className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent  mb-10"
          style={{ backgroundImage: 'radial-gradient(50% 469.44% at 50% 50%, #9747FF 45%, #A81ED6 84.75%, #3137E4 100%)' }}
          variants={fadeIn}
            >
          using AI
            </motion.span>
            <div className="flex mb-6 items-center justify-center space-x-4 text-sm text-gray-500 mt-6">
            <span>30 Days Free Trial</span>
            <span className="h-1 w-1 bg-gray-400 rounded-full"></span>
            <span>No Credit Card Required</span>
              </div>
            {/* <motion.p 
          className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          variants={fadeIn}
            >
          Transform your evaluation with intelligent automation
            </motion.p> */}
            
            <motion.div 
          className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center"
          variants={fadeIn}
            >
          {!isAuthenticated ? (
            <>
              <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
              >
            <Link
              to="/register"
              className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 text-lg font-medium block md:inline-block w-full md:w-auto"
            >
              Create Account
            </Link>
              </motion.div>
              
              
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
            to="/dashboard"
            className="bg-black text-white py-3 px-8 rounded-full hover:bg-gray-800 text-lg font-medium block md:inline-block w-full md:w-auto"
              >
            Go to Dashboard
              </Link>
            </motion.div>
          )}
            </motion.div>
          </motion.div>
        </main>
        
        {/* AI Assistant Outreach Section */}
      {/* <motion.section 
        className="py-16 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              className="text-3xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              AI Assistant Outreach
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Transform your evaluation with intelligent automation
            </motion.p>
          </div>
        </div>
      </motion.section> */}
<OutReach/>  
<Feature/>   
<Extra/> 
      {/* Features Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Features
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureCardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Teacher Tools</h3>
              <p className="text-gray-600">Create assignments with questions and model answers. Track student submissions and provide feedback.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureCardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Portal</h3>
              <p className="text-gray-600">Access assignments, submit handwritten solutions, and receive AI-generated feedback.</p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              variants={featureCardVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Evaluation</h3>
              <p className="text-gray-600">Automated analysis of handwritten submissions with AI integration for fast and accurate feedback.</p>
            </motion.div>
          </div>
        </div>
      </section> */}
      
    
    </div>
  );
};

export default Home;