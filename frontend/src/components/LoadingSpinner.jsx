import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ label = 'Processing...' }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-12 h-12 border-4 border-[#2A2A2A] border-t-[#8B5CF6] rounded-full"
      />
      <p className="text-[#9CA3AF] text-sm animate-pulse">{label}</p>
    </div>
  );
};

export default LoadingSpinner;
