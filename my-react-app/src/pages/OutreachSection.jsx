import React from 'react';
import { motion } from 'framer-motion';
import im1 from "../assets/image.png"
import im2 from "../assets/Chat bot-pana 1.png"
import im3 from "../assets/Voice assistant-pana 1.png"

// This would be part of your Home component
const AIAssistantOutreachSection = () => {
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const bubbleVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: i => ({
      scale: 1,
      opacity: 0.6,
      transition: {
        delay: i * 0.2,
        duration: 0.5
      }
    }),
    float: i => ({
      y: [0, -10, 0],
      transition: {
        delay: i * 0.1,
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    })
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const cardsData = [
    {
      title: "Teachers",
      description: "Say goodbye to manual grading. Save hours and focus on inspiring minds.",
      image: im3,
      imageAlt: "Teacher working at desk with computer",
      accent: "purple"
    },
    {
      title: "Admin",
      description: "Digitize & automate evaluations, ensuring a seamless AI-driven workflow.",
      image: im2,
      imageAlt: "Robot admin assistant with mobile app",
      accent: "blue"
    },
    {
      title: "Students",
      description: "Get instant, intelligent feedback that helps you learn faster & improve smarter.",
      image: im1,
      imageAlt: "Student using phone with feedback system",
      accent: "purple"
    }
  ];

  const bubbles = [
    { size: 100, top: "10%", left: "5%", delay: 0 },
    { size: 200, top: "20%", right: "15%", delay: 1 },
    { size: 75, bottom: "30%", left: "10%", delay: 2 },
    { size: 55, bottom: "15%", right: "8%", delay: 3 },
    { size: 80, top: "40%", left: "20%", delay: 4 },
    { size: 55, bottom: "40%", right: "25%", delay: 5 }
  ];

  return (
    <motion.section 
      className="py-16 relative overflow-hidden"
    //   style={{ background: "rgba(246, 236, 254, 1)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Bubbles */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-purple-300 opacity-30"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: bubble.top,
            left: bubble.left,
            right: bubble.right,
            bottom: bubble.bottom,
          }}
          custom={bubble.delay}
          initial="initial"
          animate={["animate", "float"]}
          variants={bubbleVariants}
        />
      ))}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={titleVariants}
        >
          <h2 className="text-3xl font-bold mb-3">AI Assistant Outreach</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Transform your evaluation with intelligent automation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {cardsData.map((card, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              initial="offscreen"
              whileInView="onscreen"
              whileHover="hover"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardVariants}
              transition={{ delay: index * 0.2 }}
            >
              <div className="p-6 flex flex-col items-center">
                <motion.div 
                  className="mb-6 w-full h-48 flex justify-center items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="max-h-full object-contain"
                  />
                </motion.div>
                
                <motion.h3 
                  className={`text-xl font-bold mb-2 text-${card.accent}-700`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.2 }}
                >
                  {card.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.2 }}
                >
                  {card.description}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default AIAssistantOutreachSection;

// Usage in your Home component:
// Replace the AI Assistant Outreach section with:
// <AIAssistantOutreachSection />