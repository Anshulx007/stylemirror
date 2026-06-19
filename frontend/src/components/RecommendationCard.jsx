import React from 'react';
import { Shirt, Scissors, Wand2, Compass } from 'lucide-react';

const RecommendationCard = ({ title, category, children, icon: Icon = Compass }) => {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl hover:border-[#8B5CF6]/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#2A2A2A]">
        <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#8B5CF6]" />
        </div>
        <div>
          <span className="text-xs text-[#8B5CF6] uppercase font-bold tracking-wider">{category}</span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="text-sm text-[#9CA3AF] leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default RecommendationCard;
