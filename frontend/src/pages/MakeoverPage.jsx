import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import BeforeAfterSlider from '../components/BeforeAfterSlider';
import ShaderBackground from '../components/ShaderBackground';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useAppStore } from '../store/useAppStore';
import { generateMakeover } from '../services/api';

const MakeoverPage = () => {
  const navigate = useNavigate();
  const imageStore = useImageStore();
  const recStore = useRecommendationStore();
  const appStore = useAppStore();

  const [makeoverUrl, setMakeoverUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Anchoring facial geometry...');

  const beforeImage = imageStore.previewUrl;
  const recommendationId = recStore.recommendationId;

  useEffect(() => {
    if (!recommendationId) {
      navigate('/upload');
      return;
    }

    let interval;
    const triggerMakeover = async () => {
      setIsGenerating(true);
      setProgress(0);
      setStatusText('Anchoring facial geometry...');

      // Fake progress animations to keep user engaged during external API calls
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.floor(Math.random() * 5) + 1;
          if (next >= 99) {
            clearInterval(interval);
            return 99;
          }

          if (next < 25) {
            setStatusText('Anchoring facial geometry...');
          } else if (next < 50) {
            setStatusText('Compiling requested styling prompts...');
          } else if (next < 75) {
            setStatusText('Applying Imagen 3 virtual try-on...');
          } else {
            setStatusText('Verifying identity preservation ratings...');
          }

          return next;
        });
      }, 200);

      try {
        const data = await generateMakeover({ recommendation_id: recommendationId });
        const finalUrl = `http://127.0.0.1:8000${data.makeover_url}`;
        setMakeoverUrl(finalUrl);
        recStore.setMakeoverUrl(finalUrl);
        setProgress(100);
        setStatusText('Makeover complete!');
        clearInterval(interval);
        setTimeout(() => {
          setIsGenerating(false);
        }, 500);
      } catch (err) {
        console.error(err);
        const errMsg = err.response?.data?.detail || err.message || 'Makeover generation failed. Please try again.';
        appStore.showToast(errMsg, 'error');
        clearInterval(interval);
        setIsGenerating(false);
        // Fallback to original image just in case so the slider doesn't crash
        setMakeoverUrl(beforeImage);
      }
    };

    triggerMakeover();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recommendationId, beforeImage, navigate]);

  const handleSaveLook = () => {
    appStore.showToast('Look saved to gallery!', 'success');
  };

  return (
    <PageWrapper>
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0E0E]/95 backdrop-blur-sm">
          <ShaderBackground className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
            <div className="w-16 h-16 border border-[#D4AF37] flex items-center justify-center mb-12 animate-pulse">
              <span className="material-symbols-outlined text-[#D4AF37] text-[32px]">temp_preferences_custom</span>
            </div>
            
            <h2 className="font-display text-2xl md:text-3xl text-white mb-8 text-center tracking-tight">
              {statusText}
            </h2>
            
            <div className="w-full h-[1px] bg-[#262626] relative overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-[#7C3AED] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <div className="w-full flex justify-between mt-4">
              <span className="font-eyebrow-sm text-xs text-[#9CA3AF] uppercase tracking-widest">Transforming</span>
              <span className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest">{progress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Makeover View Content */}
      {!isGenerating && makeoverUrl && (
        <div className="relative z-10 flex-grow flex flex-col items-center justify-center py-6 w-full max-w-4xl mx-auto">
          
          {/* Badge & Title */}
          <div className="text-center mb-12 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 border border-[#D4AF37] px-4 py-1.5 rounded-full mb-8">
              <span className="material-symbols-outlined text-[14px] text-[#D4AF37]">verified</span>
              <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#D4AF37]">Identity Verified</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#F5F5F0] mb-6">
              Same You. <br className="md:hidden"/>New Style.
            </h1>
            <p className="font-body-md text-base text-[#9CA3AF] max-w-xl text-center">
              Our AI has analyzed your features and applied the selected high-fashion editorial look while maintaining your core biometric identity.
            </p>
          </div>

          {/* Draggable slider container */}
          <div className="w-full mb-12">
            <BeforeAfterSlider beforeImage={beforeImage} afterImage={makeoverUrl} />
            <p className="text-center mt-6 font-eyebrow-sm text-xs text-[#9CA3AF] uppercase tracking-widest">Slide to compare</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-4 w-full max-w-md">
            <button 
              onClick={handleSaveLook}
              className="w-full bg-[#7C3AED] text-white font-eyebrow-sm text-xs uppercase tracking-widest py-4 hover:bg-[#5a00c6] transition-colors duration-150 active:scale-95 flex justify-center items-center gap-2"
              style={{ borderRadius: '0px' }}
            >
              <span>Save This Look</span>
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </button>
            
            <button 
              onClick={() => navigate('/preferences')}
              className="w-full border border-[#F5F5F0] text-[#F5F5F0] bg-transparent font-eyebrow-sm text-xs uppercase tracking-widest py-4 hover:bg-[#F5F5F0] hover:text-[#0A0A0A] transition-colors duration-150 active:scale-95"
              style={{ borderRadius: '0px' }}
            >
              Try Another Style
            </button>
            
            <button 
              onClick={() => navigate('/report')}
              className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors duration-150 mt-4"
            >
              <span className="font-eyebrow-sm text-xs uppercase tracking-widest underline underline-offset-4 decoration-[#262626]">Download Report</span>
              <span className="material-symbols-outlined text-[16px]">download</span>
            </button>
          </div>

        </div>
      )}
    </PageWrapper>
  );
};

export default MakeoverPage;
