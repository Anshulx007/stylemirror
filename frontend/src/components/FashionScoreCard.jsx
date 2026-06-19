import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const FashionScoreCard = ({ score }) => {
  const percentage = Math.min(Math.max((score / 10) * 100, 0), 100);
  
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B]" />
      
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Circle Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="50"
            className="stroke-[#2A2A2A] fill-none"
            strokeWidth="8"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            className="stroke-[#8B5CF6] fill-none"
            strokeWidth="8"
            strokeDasharray="314"
            initial={{ strokeDashoffset: 314 }}
            animate={{ strokeDashoffset: 314 - (314 * percentage) / 100 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white font-display">{score?.toFixed(1) || '0.0'}</span>
          <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Score</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-[#F59E0B] font-semibold text-sm">
        <Flame className="w-4 h-4 fill-current" />
        <span>Style Standing</span>
      </div>
    </div>
  );
};

export default FashionScoreCard;
