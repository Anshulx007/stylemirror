import React from 'react';

const FeatureCard = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl hover:border-[#8B5CF6]/40 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-[#8B5CF6]" />
      </div>
      <h4 className="text-lg font-semibold text-white font-display">{title}</h4>
      <p className="text-sm text-[#9CA3AF] leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
