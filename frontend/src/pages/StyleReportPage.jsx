import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useReportStore } from '../store/useReportStore';
import { FileText, Download, BarChart2, Shirt, Scissors, Wand2, ShieldAlert } from 'lucide-react';

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
            className="mt-4 px-6 py-2 bg-[#8B5CF6] text-white rounded-xl"
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
      <div className="border-b border-[#2A2A2A] pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Style Coordinates Report</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">Full analysis and recommendations summary.</p>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
        </button>
      </div>

      {/* Main Report Page Container */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 sm:p-8 space-y-8 shadow-xl max-w-3xl mx-auto">
        
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 border-b border-[#2A2A2A] pb-6">
          <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-display">StyleMirror AI Profile Summary</h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Profile Coordinate ID: {imageId}</p>
          </div>
        </div>

        {/* 1. Visual Profile Grid */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest">1. Visual Analysis</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Face Shape</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.faceShape || 'N/A'}</span>
            </div>
            
            <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Skin undertone</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.skinTone || 'N/A'}</span>
            </div>

            <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Hair Type</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.hairType || 'N/A'}</span>
            </div>

            <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Current Style</span>
              <span className="text-white text-md font-semibold mt-1 block capitalize">{imageStore.currentStyle || 'N/A'}</span>
            </div>
          </div>

          <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] flex items-center justify-between text-sm">
            <div>
              <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Style Standing (Fashion Score)</span>
              <span className="text-[#8B5CF6] text-2xl font-bold mt-1 block font-display">
                {imageStore.fashionScore?.toFixed(1) || '0.0'} / 10.0
              </span>
            </div>
            <BarChart2 className="w-10 h-10 text-[#8B5CF6] opacity-30" />
          </div>
        </div>

        {/* 2. Outfit Recommendations */}
        {outfit && (
          <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
            <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1.5">
              <Shirt className="w-4 h-4" />
              <span>2. Outfit Set Recommendations</span>
            </h4>
            <div className="p-5 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block mb-1">Tops Suggested</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {outfit.tops?.map((top, idx) => (
                      <li key={idx} className="capitalize">{top}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block mb-1">Bottoms Suggested</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {outfit.bottoms?.map((bot, idx) => (
                      <li key={idx} className="capitalize">{bot}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block mb-1">Footwear Suggested</span>
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
          <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
            <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1.5">
              <Scissors className="w-4 h-4" />
              <span>3. Hair & Accessories Coordinate</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {hairstyles && (
                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-2">
                  <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Recommended Hairstyles</span>
                  <ul className="list-disc list-inside text-white space-y-1">
                    {hairstyles.map((hair, idx) => (
                      <li key={idx} className="capitalize">{hair}</li>
                    ))}
                  </ul>
                </div>
              )}
              {accessories && (
                <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-3">
                  <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider block">Accessories Grid</span>
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
          <div className="space-y-4 pt-2 border-t border-[#2A2A2A]">
            <h4 className="text-xs font-bold text-[#8B5CF6] uppercase tracking-widest flex items-center gap-1.5">
              <Wand2 className="w-4 h-4" />
              <span>4. Color Palette Guidance</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-2">
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider block">Best Colors to Wear</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {palette.best_colors?.map((color, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-lg capitalize">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] space-y-2">
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider block flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Colors to Avoid</span>
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {palette.avoid?.map((color, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-lg capitalize">
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
