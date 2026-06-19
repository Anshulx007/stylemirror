import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pt-24 pb-16 px-6 bg-[#0A0A0A] text-[#F5F5F5] flex flex-col items-center"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />
      <div className="w-full max-w-5xl relative z-10 flex flex-col flex-grow">
        {children}
      </div>
    </motion.div>
  );
};

export default PageWrapper;
