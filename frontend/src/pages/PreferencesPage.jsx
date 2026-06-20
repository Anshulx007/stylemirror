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
  const getRecommendations = useRecommendationStore((state) => state.getRecommendations);
  const loading = useRecommendationStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  const [occasion, setOccasion] = useState('Casual');
  const [season, setSeason] = useState('Summer');
  const [budget, setBudget] = useState(5000);
  const [gender, setGender] = useState('male');
  const [colorTheme, setColorTheme] = useState('Warm tones');
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
        style_input: `Color Theme: ${colorTheme}. ${styleInput || "Simple, classy look"}`,
        gender
      });
      navigate('/recommendations');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.detail || err.message || 'Failed to generate recommendations. Please try again.';
      useAppStore.getState().setError(errMsg);
    }
  };

  return (
    <PageWrapper>
      {/* Header Block */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF]">Step 2 of 3</span>
          <div className="flex gap-2 w-32">
            <div className="h-[2px] bg-[#7C3AED] flex-1"></div>
            <div className="h-[2px] bg-[#7C3AED] flex-1"></div>
            <div className="h-[2px] bg-[#262626] flex-1"></div>
          </div>
        </div>
        
        <h1 className="font-display text-4xl md:text-6xl text-white mb-4">Your Context</h1>
        <p className="font-body-md text-base text-[#9CA3AF] max-w-md mx-auto">
          Specify the parameters for your outfits. We combine these with your face analysis to generate options.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#141414] border border-[#262626] p-8 space-y-8 shadow-xl relative z-10">
        
        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Occasion</label>
          <select 
            value={occasion} 
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none font-medium capitalize"
          >
            <option className="bg-[#141414] text-white">Casual</option>
            <option className="bg-[#141414] text-white">Wedding</option>
            <option className="bg-[#141414] text-white">Festive</option>
            <option className="bg-[#141414] text-white">Formal</option>
            <option className="bg-[#141414] text-white">Party</option>
          </select>
        </div>

        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Season</label>
          <select 
            value={season} 
            onChange={(e) => setSeason(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none font-medium capitalize"
          >
            <option className="bg-[#141414] text-white">Summer</option>
            <option className="bg-[#141414] text-white">Winter</option>
            <option className="bg-[#141414] text-white">Monsoon</option>
          </select>
        </div>

        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Gender Category</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setGender('male')}
              className={`py-3 text-sm font-semibold border transition-all ${
                gender === 'male' 
                  ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' 
                  : 'border-[#262626] bg-[#0A0A0A]/50 text-[#9CA3AF]'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender('female')}
              className={`py-3 text-sm font-semibold border transition-all ${
                gender === 'female' 
                  ? 'border-[#7C3AED] bg-[#7C3AED]/10 text-white' 
                  : 'border-[#262626] bg-[#0A0A0A]/50 text-[#9CA3AF]'
              }`}
              style={{ borderRadius: '0px' }}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Max Budget (INR)</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none font-medium"
          />
        </div>

        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Color Theme</label>
          <select 
            value={colorTheme} 
            onChange={(e) => setColorTheme(e.target.value)}
            className="w-full py-2 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none font-medium"
          >
            <option className="bg-[#141414] text-white">Warm tones (gold, peach, warm olive)</option>
            <option className="bg-[#141414] text-white">Cool tones (silver, blue, emerald)</option>
            <option className="bg-[#141414] text-white">Neutral tones (gray, white, beige)</option>
            <option className="bg-[#141414] text-white">Vibrant / Bright colors</option>
            <option className="bg-[#141414] text-white">Pastel colors</option>
            <option className="bg-[#141414] text-white">Monochrome (Black & White)</option>
          </select>
        </div>

        <div>
          <label className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-2 block">Desired Style Description</label>
          <textarea 
            value={styleInput} 
            onChange={(e) => setStyleInput(e.target.value)}
            placeholder="e.g. minimalist blue kurta, elegant style..."
            className="w-full py-2 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none h-24 resize-none placeholder:text-[#9CA3AF]/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#7C3AED] text-white font-eyebrow-sm text-xs uppercase tracking-widest hover:bg-[#5a00c6] disabled:opacity-50 transition-colors duration-150 active:scale-95 flex justify-center items-center gap-2"
          style={{ borderRadius: '0px' }}
        >
          <span>Compile Recommendations</span>
          <span className="material-symbols-outlined text-[16px]">draw</span>
        </button>
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
    </PageWrapper>
  );
};

export default PreferencesPage;
