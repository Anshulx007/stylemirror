import React from 'react';

const ColorPaletteCard = ({ bestColors = [], avoidColors = [] }) => {
  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
      <h3 className="text-md font-semibold text-white mb-4">Color Blueprint</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wider font-bold">Best Colors</p>
          <div className="flex flex-wrap gap-2">
            {bestColors.map((color) => (
              <span 
                key={color} 
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 capitalize"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-xs text-[#9CA3AF] mb-2 uppercase tracking-wider font-bold">Avoid Colors</p>
          <div className="flex flex-wrap gap-2">
            {avoidColors.map((color) => (
              <span 
                key={color} 
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 capitalize"
              >
                {color}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteCard;
