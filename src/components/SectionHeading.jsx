import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({ title }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="text-xl md:text-2xl font-bold text-center text-white mb-8 p-4 rounded-lg shadow-lg"
      style={{
        background: 'linear-gradient(to right, #6366f1, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
        display: 'inline-block',
        padding: '10px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      {title}
    </motion.h2>
  );
};

export default SectionHeading;
