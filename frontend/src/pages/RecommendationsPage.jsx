import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import RecommendationCard from '../components/RecommendationCard';
import ColorPaletteCard from '../components/ColorPaletteCard';
import FashionScoreCard from '../components/FashionScoreCard';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useImageStore } from '../store/useImageStore';
import { Shirt, Scissors, Wand2, Compass, ArrowRight } from 'lucide-react';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const imageId = useImageStore((state) => state.imageId);
  const fashionScore = useImageStore((state) => state.fashionScore);
  const recStore = useRecommendationStore();

  if (!recStore.recommendationId) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No recommendations found. Generate them first.</p>
          <button 
            onClick={() => navigate('/preferences')}
            className="mt-4 px-6 py-2 bg-[#8B5CF6] text-white rounded-xl font-semibold"
          >
            Preferences
          </button>
        </div>
      </PageWrapper>
    );
  }

  const { outfit, hairstyles, accessories, palette, makeup } = recStore;

  return (
    <PageWrapper>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#2A2A2A] pb-6 mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Your Style Suggestions</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">Recommendations optimized for your face profile.</p>
        </div>
        
        <button
          onClick={() => navigate('/report')}
          className="flex items-center gap-2 px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-all duration-300"
        >
          <span>View Detailed Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column - Cards */}
        <div className="md:col-span-2 space-y-6">
          <RecommendationCard title="Outfit Set" category="Clothing" icon={Shirt}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Tops Suggested:</p>
                <ul className="list-disc list-inside mt-1 text-[#9CA3AF] space-y-1">
                  {outfit?.tops?.map((top, idx) => (
                    <li key={idx} className="capitalize">{top}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Bottoms Suggested:</p>
                <ul className="list-disc list-inside mt-1 text-[#9CA3AF] space-y-1">
                  {outfit?.bottoms?.map((bot, idx) => (
                    <li key={idx} className="capitalize">{bot}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Footwear Suggested:</p>
                <ul className="list-disc list-inside mt-1 text-[#9CA3AF] space-y-1">
                  {outfit?.footwear?.map((ft, idx) => (
                    <li key={idx} className="capitalize">{ft}</li>
                  ))}
                </ul>
              </div>
            </div>
          </RecommendationCard>
          
          <RecommendationCard title="Recommended Hairstyles" category="Hair" icon={Scissors}>
            <ul className="list-disc list-inside space-y-2">
              {hairstyles?.map((hair, idx) => (
                <li key={idx} className="text-[#9CA3AF] text-sm">{hair}</li>
              ))}
            </ul>
          </RecommendationCard>
          
          <RecommendationCard title="Grooming & Makeup" category="Cosmetics" icon={Wand2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Look:</span>
                <p className="text-[#9CA3AF] mt-1 capitalize">{makeup?.look}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Lip color:</span>
                <p className="text-[#9CA3AF] mt-1 capitalize">{makeup?.lip_color}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Eye style:</span>
                <p className="text-[#9CA3AF] mt-1 capitalize">{makeup?.eye_style}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">Foundation Shade:</span>
                <p className="text-[#9CA3AF] mt-1 capitalize">{makeup?.foundation}</p>
              </div>
            </div>
          </RecommendationCard>
        </div>

        {/* Right column - Side panel (Score, Palette, Accessories) */}
        <div className="space-y-6">
          <FashionScoreCard score={fashionScore} />
          
          <ColorPaletteCard 
            bestColors={palette?.best_colors} 
            avoidColors={palette?.avoid} 
          />
          
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 shadow-xl">
            <h3 className="text-md font-semibold text-white mb-4">Accessory Grid</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Watch:</span>
                <span className="text-white font-medium capitalize">{accessories?.watch}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Belt:</span>
                <span className="text-white font-medium capitalize">{accessories?.belt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#9CA3AF]">Glasses:</span>
                <span className="text-white font-medium capitalize">{accessories?.glasses}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RecommendationsPage;
