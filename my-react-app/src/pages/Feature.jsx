import React from 'react';
import { motion } from 'framer-motion';
import im1 from "../assets/image 92.png"
import im2 from "../assets/image 91.png"
import im3 from "../assets/image 90.png"
import im4 from "../assets/image 89.png"
const AutoGradFeatures = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const bubbleVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  // Key benefits data
  const benefits = [
    {
      icon: im1,  // Placeholder for your icon
      title: "Increased Efficiency",
      description: "Grade more assignments in less time"
    },
    {
      icon: im2, // Placeholder for your icon
      title: "Man-Power Reduction",
      description: "Reduce manual grading workload"
    },
    {
      icon: im3, // Placeholder for your icon
      title: "Scalable Solutions",
      description: "Works for any class size"
    },
    {
      icon: im4, // Placeholder for your icon
      title: "Time Saving",
      description: "Focus on teaching, not grading"
    }
  ];

 

  // Random bubble positions
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 120 + 20,
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    delay: Math.random() * 2
  }));

  return (
    <div className="relative w-full  " >
      {/* Background Bubbles */}
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full opacity-20 bg-purple-300"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            zIndex: 0
          }}
          variants={bubbleVariants}
          animate="animate"
          transition={{
            delay: bubble.delay,
            duration: 3 + bubble.delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      {/* Key Benefits Section */}
      <div className="relative z-10 px-4 py-16 mx-auto max-w-6xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-2">Key Benefits</h2>
          <p className="text-lg text-gray-600">Why teachers choose AutoGrad?</p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center"
              variants={itemVariants}
            >
              <div className="w-46 h-46 mb-4 flex items-center justify-center rounded-full">
                <div className="w-46 h-46 flex items-center justify-center text-4xl">
                    <img src={benefit.icon} alt="hello" />
                  
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-1">{benefit.title}</h3>
              <p className="text-sm text-gray-600 text-center">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    

      
    </div>
  );
};

export default AutoGradFeatures;