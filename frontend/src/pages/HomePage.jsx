import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ShaderBackground from '../components/ShaderBackground';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* WebGL Ambient Shader behind homepage */}
      <ShaderBackground className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none" />

      <div className="relative z-10 flex-grow flex flex-col items-center justify-center py-12 md:py-24 max-w-4xl mx-auto w-full">
        
        {/* Editorial Sub-badge */}
        <div className="inline-flex items-center gap-2 border border-[#D4AF37] px-4 py-1.5 rounded-full mb-8">
          <span className="material-symbols-outlined text-[14px] text-[#D4AF37]">verified</span>
          <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#D4AF37]">Digital Atelier MVP</span>
        </div>

        {/* Masthead Header */}
        <h1 className="font-display text-4xl md:text-7xl text-[#F5F5F0] text-center mb-6 leading-[1.1] tracking-tight">
          See yourself in <br />
          <span className="text-[#D4AF37] italic"> bespoke coordinates</span>
        </h1>

        {/* Intro Body */}
        <p className="font-body-md text-base text-[#9CA3AF] max-w-xl text-center mb-12 leading-relaxed">
          Upload a portrait and receive personalized recommendations for outfit sets, hairstyles, accessories, and colors, verified by automated identity metrics.
        </p>

        {/* Snappy Primary CTA Button */}
        <button
          onClick={() => navigate('/upload')}
          className="font-eyebrow-sm text-sm uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] px-8 py-4 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors duration-150 active:scale-95 flex items-center gap-2 font-bold"
          style={{ borderRadius: '0px' }}
        >
          <span>Start Your Transform</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>

        {/* Editorial Trust Columns */}
        <div className="w-full mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#262626] pt-12">
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#7C3AED]">lock</span>
            <div>
              <h4 className="font-eyebrow-sm text-xs uppercase tracking-widest text-white mb-1">Identity Preserved</h4>
              <p className="text-xs text-[#9CA3AF]">Core face geometry and skin tone remains unaltered</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#7C3AED]">delete</span>
            <div>
              <h4 className="font-eyebrow-sm text-xs uppercase tracking-widest text-white mb-1">24h Autodelete</h4>
              <p className="text-xs text-[#9CA3AF]">Your original uploaded photo is stored safely and wiped</p>
            </div>
          </div>
          <div className="flex flex-col items-center text-center gap-3">
            <span className="material-symbols-outlined text-[24px] text-[#7C3AED]">query_stats</span>
            <div>
              <h4 className="font-eyebrow-sm text-xs uppercase tracking-widest text-white mb-1">Benchmarked Suite</h4>
              <p className="text-xs text-[#9CA3AF]">ArcFace, CLIP, and LPIPS verification feedback</p>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default HomePage;
