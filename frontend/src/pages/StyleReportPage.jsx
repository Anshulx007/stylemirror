import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useReportStore } from '../store/useReportStore';

const StyleReportPage = () => {
  const navigate = useNavigate();
  const imageStore = useImageStore();
  const recStore = useRecommendationStore();
  const reportStore = useReportStore();

  const imageId = imageStore.imageId;

  useEffect(() => {
    if (imageId) {
      reportStore.generateReport(imageId);
    }
  }, [imageId]);

  if (!imageId) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No active profile found. Please upload a picture first.</p>
          <button 
            onClick={() => navigate('/upload')}
            className="mt-4 font-eyebrow-sm text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] px-6 py-3 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors"
          >
            Go to Upload
          </button>
        </div>
      </PageWrapper>
    );
  }

  const handleDownload = () => {
    reportStore.downloadReport(imageId);
  };

  const { outfit, hairstyles, accessories, palette, makeup } = recStore;

  return (
    <PageWrapper>
      {/* Title Header */}
      <div className="border-b border-[#262626] pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF]">Atelier Archive</span>
          <h2 className="text-3xl font-extrabold text-white font-display mt-2">Style Coordinates Report</h2>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-[#7C3AED] hover:bg-[#5a00c6] text-white text-xs font-semibold uppercase tracking-widest transition-colors duration-150 active:scale-95"
          style={{ borderRadius: '0px' }}
        >
          <span className="material-symbols-outlined text-[16px]">download</span>
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Main Report Page Container */}
      <div className="bg-[#141414]/30 border border-[#262626] p-8 space-y-10 max-w-3xl mx-auto w-full">
        
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-[#262626] pb-6">
          <div className="w-12 h-12 bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#7C3AED]">description</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">StyleMirror AI Profile Summary</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Profile Coordinate ID: {imageId}</p>
          </div>
        </div>

        {/* 1. Visual Profile Grid */}
        <div className="space-y-4">
          <h4 className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest">1. Visual Analysis</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Face Shape</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.faceShape || 'N/A'}</span>
            </div>
            
            <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Skin undertone</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.skinTone || 'N/A'}</span>
            </div>

            <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Hair Type</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.hairType || 'N/A'}</span>
            </div>

            <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Current Style</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.currentStyle || 'N/A'}</span>
            </div>
          </div>

          <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] flex items-center justify-between text-sm">
            <div>
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Style Standing (Fashion Score)</span>
              <span className="text-[#7C3AED] text-2xl font-bold mt-1 block font-display">
                {imageStore.fashionScore?.toFixed(1) || '0.0'} / 10.0
              </span>
            </div>
            <span className="material-symbols-outlined text-[36px] text-[#7C3AED] opacity-30">analytics</span>
          </div>
        </div>

        {/* 2. Outfit Recommendations */}
        {outfit && (
          <div className="space-y-4 pt-2 border-t border-[#262626]">
            <h4 className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">apparel</span>
              <span>2. Outfit Set Recommendations</span>
            </h4>
            <div className="p-5 bg-[#0A0A0A]/50 border border-[#262626] space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="font-eyebrow-sm text-[#9CA3AF] text-xs uppercase tracking-widest block mb-1">Tops Suggested</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {outfit.tops?.map((top, idx) => (
                      <li key={idx} className="capitalize">{top}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-eyebrow-sm text-[#9CA3AF] text-xs uppercase tracking-widest block mb-1">Bottoms Suggested</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {outfit.bottoms?.map((bot, idx) => (
                      <li key={idx} className="capitalize">{bot}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-eyebrow-sm text-[#9CA3AF] text-xs uppercase tracking-widest block mb-1">Footwear Suggested</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {outfit.footwear?.map((ft, idx) => (
                      <li key={idx} className="capitalize">{ft}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Hair & Accessories */}
        {(hairstyles || accessories) && (
          <div className="space-y-4 pt-2 border-t border-[#262626]">
            <h4 className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">content_cut</span>
              <span>3. Hair & Accessories Coordinate</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {hairstyles && (
                <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] space-y-2">
                  <span className="font-eyebrow-sm text-[#9CA3AF] text-xs uppercase tracking-widest block">Recommended Hairstyles</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {hairstyles.map((hair, idx) => (
                      <li key={idx} className="capitalize">{hair}</li>
                    ))}
                  </ul>
                </div>
              )}
              {accessories && (
                <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] space-y-3">
                  <span className="font-eyebrow-sm text-[#9CA3AF] text-xs uppercase tracking-widest block">Accessories Grid</span>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Watch:</span>
                      <span className="text-white font-medium capitalize">{accessories.watch || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Belt:</span>
                      <span className="text-white font-medium capitalize">{accessories.belt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#9CA3AF]">Glasses:</span>
                      <span className="text-white font-medium capitalize">{accessories.glasses || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. Color Palette Guidance */}
        {palette && (
          <div className="space-y-4 pt-2 border-t border-[#262626]">
            <h4 className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">brush</span>
              <span>4. Color Palette Guidance</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] space-y-2">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Best Colors to Wear</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {palette.best_colors?.map((color, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs uppercase tracking-widest">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] space-y-2">
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider block">Colors to Avoid</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {palette.avoid?.map((color, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-xs uppercase tracking-widest">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default StyleReportPage;
