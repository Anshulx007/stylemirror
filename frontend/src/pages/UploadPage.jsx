import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ImageUploader from '../components/ImageUploader';
import ShaderBackground from '../components/ShaderBackground';
import { useImageStore } from '../store/useImageStore';
import { useAppStore } from '../store/useAppStore';

const UploadPage = () => {
  const navigate = useNavigate();
  const setImage = useImageStore((state) => state.setImage);
  const analyzeImage = useImageStore((state) => state.analyzeImage);
  const error = useAppStore((state) => state.error);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Detecting face shape...');

  const handleUpload = async (file, previewUrl) => {
    setImage(file, previewUrl);
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setStatusText('Detecting face shape...');
    
    // Trigger the analysis call in parallel
    const analysisPromise = analyzeImage();
    
    // Run fake progress bar intervals to match the premium loading mockup
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 2;
        if (next >= 99) {
          clearInterval(interval);
          return 99;
        }
        
        // Update labels based on progress range
        if (next < 25) {
          setStatusText('Detecting face shape...');
        } else if (next < 50) {
          setStatusText('Reading skin tone...');
        } else if (next < 75) {
          setStatusText('Analyzing structural markers...');
        } else {
          setStatusText('Mapping style profile...');
        }
        
        return next;
      });
    }, 150);

    try {
      await analysisPromise;
      setProgress(100);
      setStatusText('Complete!');
      clearInterval(interval);
      setTimeout(() => {
        navigate('/preferences');
      }, 500);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  return (
    <PageWrapper>
      
      {/* Header Block */}
      <div className="text-center mb-12 flex flex-col items-center">
        <div className="flex flex-col items-center gap-2 mb-6">
          <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF]">Step 1 of 3</span>
          <div className="flex gap-2 w-32">
            <div className="h-[2px] bg-[#7C3AED] flex-1"></div>
            <div className="h-[2px] bg-[#262626] flex-1"></div>
            <div className="h-[2px] bg-[#262626] flex-1"></div>
          </div>
        </div>
        
        <h1 className="font-display text-4xl md:text-6xl text-white mb-4">Identity First</h1>
        <p className="font-body-md text-base text-[#9CA3AF] max-w-md mx-auto">
          We need a clear front-facing photo to map your unique features and generate your bespoke digital wardrobe.
        </p>
      </div>
      
      {/* Upload Zone */}
      <div className="flex flex-col gap-6 items-center w-full max-w-xl mx-auto">
        <div className="w-full border border-dashed border-[#D4AF37] p-2 bg-[#141414]/30">
          <ImageUploader onUpload={handleUpload} loading={isAnalyzing} />
        </div>
        
        {useImageStore.getState().image && !isAnalyzing && (
          <button
            onClick={handleStartAnalysis}
            className="w-full font-eyebrow-sm text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] py-4 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors duration-150 active:scale-95 flex justify-center items-center gap-2"
            style={{ borderRadius: '0px' }}
          >
            <span>Analyze My Style</span>
            <span className="material-symbols-outlined text-[16px]">analytics</span>
          </button>
        )}
        
        {error && (
          <div className="w-full p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm text-center">
            {error}
          </div>
        )}

        {/* Trust features */}
        <div className="w-full mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#262626] pt-8">
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#9CA3AF]">lock</span>
            <p className="text-xs text-[#9CA3AF]">Your face is preserved,<br/>never altered</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#9CA3AF]">delete</span>
            <p className="text-xs text-[#9CA3AF]">Photos deleted<br/>after 24 hours</p>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#9CA3AF]">bolt</span>
            <p className="text-xs text-[#9CA3AF]">Takes under 5 seconds<br/>to analyze</p>
          </div>
        </div>
      </div>

      {/* Full screen loading state with ambient WebGL Shader */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0E0E0E]/95 backdrop-blur-sm">
          <ShaderBackground className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center w-full max-w-md px-8">
            <div className="w-16 h-16 border border-[#D4AF37] flex items-center justify-center mb-12 animate-pulse">
              <span className="material-symbols-outlined text-[#D4AF37] text-[32px]">face</span>
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
              <span className="font-eyebrow-sm text-xs text-[#9CA3AF] uppercase tracking-widest">Analyzing</span>
              <span className="font-eyebrow-sm text-xs text-[#7C3AED] uppercase tracking-widest">{progress}%</span>
            </div>
          </div>
        </div>
      )}

    </PageWrapper>
  );
};

export default UploadPage;
