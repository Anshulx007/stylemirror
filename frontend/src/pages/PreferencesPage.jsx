import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ShaderBackground from '../components/ShaderBackground';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useAppStore } from '../store/useAppStore';

const PreferencesPage = () => {
  const navigate = useNavigate();
  const imageId = useImageStore((state) => state.imageId);
  const previewUrl = useImageStore((state) => state.previewUrl);
  const faceShape = useImageStore((state) => state.faceShape);
  const skinTone = useImageStore((state) => state.skinTone);
  const fashionScore = useImageStore((state) => state.fashionScore);

  const getRecommendations = useRecommendationStore((state) => state.getRecommendations);
  const loading = useRecommendationStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  const [occasion, setOccasion] = useState('Casual');
  const [season, setSeason] = useState('Summer');
  const [budget, setBudget] = useState(5000);
  const [gender, setGender] = useState('male');
  const [styleInput, setStyleInput] = useState('');

  if (!imageId) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No analyzed image found. Please upload an image first.</p>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    useAppStore.getState().setError(null);
    try {
      await getRecommendations({
        image_id: imageId,
        occasion,
        season,
        budget: Number(budget),
        style_input: styleInput || "Modern and elegant look",
        gender
      });
      navigate('/recommendations');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to generate recommendations. Please try again.';
      useAppStore.getState().setError(errMsg);
    }
  };

  const occasions = [
    'College', 'Interview', 'Office', 'Party', 'Wedding', 'Festival', 'Casual', 'Date Night'
  ];

  const seasons = [
    { id: 'Summer', label: 'Summer', desc: 'Light & Breathable', icon: 'light_mode' },
    { id: 'Winter', label: 'Winter', desc: 'Layered & Insulated', icon: 'ac_unit' },
    { id: 'Monsoon', label: 'Monsoon', desc: 'Waterproof & Dark', icon: 'water_drop' }
  ];

  return (
    <PageWrapper>
      <div className="max-w-[1440px] mx-auto space-y-16 py-8 relative">
        
        {/* Face Analysis Summary Bar */}
        <section className="bg-[#141414] border border-[#262626] p-4 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden border border-[#262626]">
            <img 
              className="w-full h-full object-cover grayscale" 
              alt="Portrait" 
              src={previewUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuBk4AX00FpY0Ae4yI3h6VlhTZseG4GV2g2sN0Zi_eg8P3ZquvxLpUWWShyfgkEAC3hnutpnpE-S_XrYqb181IWSjDZpOr-pVcJ_zuZ4kjIET_M-DRVtQEz5xQDxkwZpnUDklp9UY_HAtgtI-zKWTBBTFnEw7DYbsVYXuKQpclDSxd_wSOYg4h0O-_QHVaezHnjN_1yorDnYt-fCrhMtT6aOTRB9cW8wCGRejb61yDJ-43BNPCGzHdDDLMSTzmz0iMItgVCTXuUWzoY"} 
            />
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="px-6 py-2 border border-[#262626] font-eyebrow-sm text-xs uppercase text-[#9CA3AF] flex items-center gap-2 bg-[#0E0E0E]">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>face</span>
              Face Shape: {faceShape || 'Oval'}
            </div>
            <div className="px-6 py-2 border border-[#262626] font-eyebrow-sm text-xs uppercase text-[#9CA3AF] flex items-center gap-2 bg-[#0E0E0E]">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 0" }}>palette</span>
              Skin Tone: {skinTone || 'Wheatish'}
            </div>
            <div className="px-6 py-2 border border-[#262626] font-eyebrow-sm text-xs uppercase text-[#7C3AED] flex items-center gap-2 bg-[#0E0E0E] border-[#7C3AED]/30">
              <span className="material-symbols-outlined text-[16px] text-[#7C3AED]" style={{ fontVariationSettings: "'FILL' 1" }}>vital_signs</span>
              Current Score: {fashionScore ? `${fashionScore.toFixed(1)}/10` : '7.2/10'}
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-16">

          {/* Section 0: Gender / Category */}
          <section className="space-y-8">
            <h2 className="font-display text-3xl text-white text-center md:text-left">Select Category</h2>
            <div className="flex gap-4 justify-center md:justify-start">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`px-8 py-4 border font-eyebrow-sm text-xs uppercase tracking-widest transition-colors duration-150 ${
                  gender === 'male' 
                    ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' 
                    : 'border-[#262626] bg-[#141414] text-[#9CA3AF] hover:bg-[#1C1C1C]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                Men's Fashion
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`px-8 py-4 border font-eyebrow-sm text-xs uppercase tracking-widest transition-colors duration-150 ${
                  gender === 'female' 
                    ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' 
                    : 'border-[#262626] bg-[#141414] text-[#9CA3AF] hover:bg-[#1C1C1C]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                Women's Fashion
              </button>
            </div>
          </section>

          {/* Section 1: Occasion */}
          <section className="space-y-8">
            <h2 className="font-display text-3xl text-white text-center md:text-left">Tell us the occasion.</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar">
              {occasions.map((occ) => {
                const isSelected = occasion.toLowerCase() === occ.toLowerCase();
                return (
                  <button
                    key={occ}
                    type="button"
                    onClick={() => setOccasion(occ)}
                    className={`px-8 py-4 border font-eyebrow-sm text-xs uppercase tracking-widest whitespace-nowrap snap-start transition-all duration-150 ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#7C3AED] text-white'
                        : 'border-[#262626] bg-[#141414] text-[#9CA3AF] hover:bg-[#1C1C1C]'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    {occ}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 2: Season */}
          <section className="space-y-8">
            <h2 className="font-display text-3xl text-white text-center md:text-left">Select the Season</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {seasons.map((s) => {
                const isSelected = season.toLowerCase() === s.id.toLowerCase();
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSeason(s.id)}
                    className={`border p-10 flex flex-col items-center justify-center gap-6 transition-all duration-150 group ${
                      isSelected
                        ? 'border-[#7C3AED] bg-[#7C3AED]/10'
                        : 'border-[#262626] bg-[#141414] hover:bg-[#1C1C1C]'
                    }`}
                    style={{ borderRadius: '0px' }}
                  >
                    <span 
                      className={`material-symbols-outlined text-[40px] transition-colors ${
                        isSelected ? 'text-[#7C3AED]' : 'text-[#9CA3AF] group-hover:text-white'
                      }`}
                    >
                      {s.icon}
                    </span>
                    <div className="text-center">
                      <h3 className="font-eyebrow-sm text-xs text-white uppercase tracking-widest mb-2">{s.label}</h3>
                      <p className="font-body text-sm text-[#9CA3AF]">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Section 3: Budget */}
          <section className="space-y-8 max-w-3xl mx-auto w-full">
            <h2 className="font-display text-3xl text-white text-center">Set your budget</h2>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="font-display text-6xl text-white mb-10 tracking-tight">
                ₹{Number(budget).toLocaleString('en-IN')}
              </div>
              <input 
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-[2px] bg-[#262626] appearance-none cursor-pointer accent-[#7C3AED] focus:outline-none"
              />
              <div className="flex justify-between w-full mt-6 font-eyebrow-sm text-xs uppercase text-[#9CA3AF]">
                <span>₹1,000</span>
                <span>₹10,000+</span>
              </div>
            </div>
          </section>

          {/* Section 4: Description */}
          <section className="space-y-8 max-w-3xl mx-auto w-full">
            <h2 className="font-display text-3xl text-white text-center md:text-left">Describe the look you want</h2>
            <div className="relative">
              <input 
                type="text"
                value={styleInput}
                onChange={(e) => setStyleInput(e.target.value)}
                placeholder="e.g. Modern Korean streetwear, black tones"
                className="w-full bg-transparent border-0 border-b border-[#262626] px-0 py-4 font-body text-base text-white placeholder:text-[#9CA3AF]/40 focus:ring-0 focus:border-[#7C3AED] transition-colors outline-none"
              />
            </div>
          </section>

          {/* Sticky Bottom Action */}
          <div className="sticky bottom-0 w-full bg-[#0A0A0A]/90 backdrop-blur-md border-t border-[#262626] py-6 z-40 flex justify-center">
            <button 
              type="submit"
              disabled={loading}
              className="bg-[#7C3AED] text-white border border-[#D4AF37] hover:bg-[#6D28D9] font-eyebrow-sm text-xs uppercase tracking-widest px-12 py-5 w-full md:w-auto min-w-[300px] transition-colors duration-150"
              style={{ borderRadius: '0px' }}
            >
              {loading ? 'Compiling suggestions...' : 'Generate My Recommendations'}
            </button>
          </div>

        </form>

        {error && (
          <div className="max-w-md mx-auto mt-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm text-center">
            {error}
          </div>
        )}

        {/* Full screen recommendations compiling loading state */}
        {loading && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0E0E]/95 backdrop-blur-sm">
            <ShaderBackground className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
              <div className="w-16 h-16 border border-[#D4AF37] flex items-center justify-center mb-12 animate-pulse">
                <span className="material-symbols-outlined text-[#D4AF37] text-[32px]">auto_awesome</span>
              </div>
              
              <h2 className="font-display text-2xl md:text-3xl text-white mb-8 text-center tracking-tight">
                Designing your outfits...
              </h2>
              
              <div className="w-full h-[1px] bg-[#262626] relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-[#7C3AED] animate-pulse w-3/4"></div>
              </div>
              
              <div className="w-full flex justify-between mt-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] uppercase tracking-widest">Generating Coordinates</span>
                <span className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest">Processing</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
};

export default PreferencesPage;
