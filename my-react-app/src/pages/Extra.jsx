import React from 'react';
import { motion } from 'framer-motion';
import Logo from "../assets/image 99.png"
const AutoGradHero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.3 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const bubbleVariants = {
    animate: (i) => ({
      y: [0, -15, 0],
      transition: {
        duration: 4 + i,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    })
  };

  // Generate random bubble positions
  const bubbles = [
    { size: 120, top: '10%', left: '70%', delay: 0 },
    { size: 80, top: '75%', left: '15%', delay: 0.5 },
    { size: 180, top: '65%', left: '80%', delay: 1 },
    { size: 60, top: '15%', left: '20%', delay: 1.5 },
    { size: 100, top: '40%', left: '8%', delay: 2 },
  ];

  return (
    <div className="relative w-full overflow-hidden  py-16 md:py-24" >
      {/* Background Bubbles */}
      {bubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full opacity-20 bg-purple-200"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            zIndex: 0
          }}
          custom={bubble.delay}
          variants={bubbleVariants}
          animate="animate"
        />
      ))}

      {/* Hero Content */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 text-center max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold mb-8"
          variants={itemVariants}
        >
          Trusted by Industry Leaders
        </motion.h1>
        
        <motion.div 
          className="mb-10"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex justify-center items-center">
          <img src={Logo} alt="logo"
          className='w-56 h-34'
          />
          </div>
        </motion.div>
        
        <motion.p 
          className="text-gray-700 text-base md:text-xl max-w-2xl mx-auto "
          variants={itemVariants}
        >
          AutoGrad is an AI-powered teacher assistant that automates grading, provides personalized feedback, and streamlines student evaluations.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AutoGradHero;