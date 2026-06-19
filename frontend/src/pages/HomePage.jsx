import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import FeatureCard from '../components/FeatureCard';
import { Sparkles, Scan, MessageSquare, Compass, Play, BarChart2 } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    { title: 'AI Face & Skin Analysis', description: 'Analyzes your facial structure and skin tones to map your optimal style coordinates.', icon: Scan },
    { title: 'FastAPI Backend', description: 'Modularized recommendations running high-speed analysis in milliseconds.', icon: BarChart2 },
    { title: 'Interactive Style Chat', description: 'Chat with StyleMirror AI to query coordinates, occasion ideas, or fit adjustments.', icon: MessageSquare },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col items-center text-center py-12 gap-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 rounded-full text-xs font-bold text-[#8B5CF6] uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Research Grade MVP v0.1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white font-display max-w-3xl leading-tight">
          See yourself in <span className="bg-gradient-to-r from-[#8B5CF6] to-[#F59E0B] bg-clip-text text-transparent">style coordinates</span>
        </h1>
        
        <p className="text-[#9CA3AF] text-lg max-w-xl leading-relaxed">
          Upload a portrait and receive personalized recommendations for outfit tops, bottoms, hairstyles, accessories, and colors.
        </p>
        
        <button 
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl font-bold transition-all duration-300 shadow-[0_8px_30px_rgba(139,92,246,0.3)] hover:scale-105"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>Get Started</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </PageWrapper>
  );
};

export default HomePage;
