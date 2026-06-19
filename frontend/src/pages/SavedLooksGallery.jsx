import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { Sparkles, Layers } from 'lucide-react';

const SavedLooksGallery = () => {
  return (
    <PageWrapper>
      <div className="text-center py-6">
        <h2 className="text-3xl font-extrabold text-white font-display">Style Gallery</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Your saved looks and virtual makeovers.</p>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-20 gap-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
          <Layers className="w-8 h-8 text-[#8B5CF6]" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white">Gallery is currently empty</h4>
          <p className="text-sm text-[#9CA3AF] mt-1">Virtual makeover generation and style-saving features belong to Phase 6. Go generate recommendations to establish your style coordinates!</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SavedLooksGallery;
