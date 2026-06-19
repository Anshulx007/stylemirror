import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import ImageUploader from '../components/ImageUploader';
import LoadingSpinner from '../components/LoadingSpinner';
import { useImageStore } from '../store/useImageStore';
import { useAppStore } from '../store/useAppStore';

const UploadPage = () => {
  const navigate = useNavigate();
  const setImage = useImageStore((state) => state.setImage);
  const analyzeImage = useImageStore((state) => state.analyzeImage);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file, previewUrl) => {
    setImage(file, previewUrl);
  };

  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await analyzeImage();
      // On success, navigate to preferences selection
      navigate('/preferences');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <PageWrapper>
      <div className="text-center py-6">
        <h2 className="text-3xl font-extrabold text-white font-display">Upload Portrait</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Please provide a clear front-facing portrait image.</p>
      </div>
      
      <div className="flex flex-col gap-6 items-center mt-6">
        <ImageUploader onUpload={handleUpload} loading={isAnalyzing} />
        
        {useImageStore.getState().image && !isAnalyzing && (
          <button
            onClick={handleStartAnalysis}
            className="px-8 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold transition-all duration-300 shadow-[0_4px_12px_rgba(139,92,246,0.2)] hover:scale-105"
          >
            Analyze My Style
          </button>
        )}
        
        {isAnalyzing && (
          <LoadingSpinner label="AI Models analyzing facial structures and styles..." />
        )}
        
        {error && (
          <div className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444] text-sm text-center max-w-md">
            {error}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default UploadPage;
