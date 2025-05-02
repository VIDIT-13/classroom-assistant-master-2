import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
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

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 15px rgba(171, 4, 183, 0.7)",
      transition: { duration: 0.3 }
    }
  };

  // Current year for copyright
  const currentYear = new Date().getFullYear();

  // Glow dots animation
  const glowCircleVariants = {
    animate: {
      opacity: [0.2, 0.5, 0.2],
      scale: [1, 1.2, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }
    }
  };

  return (
    <footer className="relative overflow-hidden py-16">
      {/* Background with radial gradient */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          background: "radial-gradient(50% 50% at 50% 50%, #AB04B7 0%, #140D1D 100%)",
        }}
      />
      
      {/* Horizontal gradient overlay */}
      <div 
        className="absolute inset-0 z-10 opacity-40" 
        style={{ 
          background: "linear-gradient(90deg, #30184F 0%, #DABEFF 52.5%, #351460 100%)",
        }}
      />
      
      {/* Animated glow circles */}
      <motion.div 
        className="absolute left-1/4 top-1/4 w-32 h-32 rounded-full bg-purple-600 blur-3xl z-10 opacity-20"
        variants={glowCircleVariants}
        animate="animate"
      />
      <motion.div 
        className="absolute right-1/4 bottom-1/4 w-40 h-40 rounded-full bg-pink-500 blur-3xl z-10 opacity-20"
        variants={glowCircleVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      
      {/* Horizontal divider line with glow */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div 
          className="w-full h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent mb-12"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        />

        {/* Main footer content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Company info */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <div className="flex items-center mb-4">
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1 }}
                className="w-10 h-10 mr-3 bg-purple-600 rounded-lg flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 8L12 14L22 8L12 2Z" stroke="white" strokeWidth="2" fill="none"/>
                  <path d="M2 12L12 18L22 12" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-white">AutoGrad</h2>
            </div>
            <p className="text-purple-200 mb-6">Transform your evaluation process with AI-driven automation and personalized feedback systems.</p>
            
            <motion.button
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-6 rounded-full"
              variants={buttonVariants}
              whileHover="hover"
            >
              Schedule a Demo
            </motion.button>
          </motion.div>
          
          {/* Quick links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              {['About', 'Features', 'Pricing', 'Testimonials', 'Contact'].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href={`/${item.toLowerCase()}`} className="text-purple-200 hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
          
          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-white font-bold mb-4 text-lg">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'Privacy Policy', 'Terms of Service', 'FAQ', 'Blog'].map((item, index) => (
                <motion.li key={index} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <a href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-200 hover:text-white transition-colors">
                    {item}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
        
        {/* Social icons and copyright */}
        <motion.div 
          className="mt-12 pt-6 border-t border-purple-900/50 flex flex-col md:flex-row justify-between items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p className="text-purple-300 text-sm mb-4 md:mb-0" variants={itemVariants}>
            © {currentYear} AutoGrad. All rights reserved.
          </motion.p>
          
          <motion.div className="flex space-x-4" variants={itemVariants}>
            {/* Social icons */}
            {['twitter', 'facebook', 'instagram', 'linkedin'].map((social, index) => (
              <motion.a 
                key={index}
                href={`https://${social}.com`}
                className="w-8 h-8 rounded-full bg-purple-800/50 flex items-center justify-center text-white hover:bg-purple-600 transition-colors"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="sr-only">{social}</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                </svg>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;