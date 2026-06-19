import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useAppStore } from '../store/useAppStore';
import LoadingSpinner from '../components/LoadingSpinner';

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
            className="mt-4 px-6 py-2 bg-[#8B5CF6] text-white rounded-xl font-semibold"
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
      <div className="text-center py-4">
        <h2 className="text-3xl font-extrabold text-white font-display">Styling Preferences</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Refine your recommendation parameters.</p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 mt-6 space-y-6 shadow-xl">
        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Occasion</label>
          <select 
            value={occasion} 
            onChange={(e) => setOccasion(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
          >
            <option>Casual</option>
            <option>Wedding</option>
            <option>Festive</option>
            <option>Formal</option>
            <option>Party</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Season</label>
          <select 
            value={season} 
            onChange={(e) => setSeason(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
          >
            <option>Summer</option>
            <option>Winter</option>
            <option>Monsoon</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Gender Category</label>
          <div className="grid grid-cols-2 gap-4">
            <button
               type="button"
              onClick={() => setGender('male')}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                gender === 'male' 
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white' 
                  : 'border-[#2A2A2A] bg-[#0A0A0A] text-[#9CA3AF]'
              }`}
            >
              Male
            </button>
            <button
               type="button"
              onClick={() => setGender('female')}
              className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                gender === 'female' 
                  ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-white' 
                  : 'border-[#2A2A2A] bg-[#0A0A0A] text-[#9CA3AF]'
              }`}
            >
              Female
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Max Budget (INR)</label>
          <input 
            type="number" 
            value={budget} 
            onChange={(e) => setBudget(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Color Theme</label>
          <select 
            value={colorTheme} 
            onChange={(e) => setColorTheme(e.target.value)}
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
          >
            <option>Warm tones (gold, peach, warm olive)</option>
            <option>Cool tones (silver, blue, emerald)</option>
            <option>Neutral tones (gray, white, beige)</option>
            <option>Vibrant / Bright colors</option>
            <option>Pastel colors</option>
            <option>Monochrome (Black & White)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-2">Desired Style Description</label>
          <textarea 
            value={styleInput} 
            onChange={(e) => setStyleInput(e.target.value)}
            placeholder="e.g. minimalist blue kurta, elegant style..."
            className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none h-24 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-[0_4px_12px_rgba(139,92,246,0.2)]"
        >
          {loading ? 'Generating...' : 'Generate Recommendations'}
        </button>
      </form>
      
      {loading && (
        <div className="mt-6">
          <LoadingSpinner label="Compiling outfits, hairstyles, makeup and accessory coordinate systems..." />
        </div>
      )}

      {error && (
        <div className="max-w-md mx-auto mt-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-sm text-center">
          {error}
        </div>
      )}
    </PageWrapper>
  );
};

export default PreferencesPage;
