import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useImageStore } from '../store/useImageStore';
import { useReportStore } from '../store/useReportStore';
import { FileText, Download, BarChart2 } from 'lucide-react';

const StyleReportPage = () => {
  const navigate = useNavigate();
  const imageStore = useImageStore();
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

  return (
    <PageWrapper>
      <div className="border-b border-[#2A2A2A] pb-6 mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-white font-display">Style Coordinates Report</h2>
          <p className="text-[#9CA3AF] text-sm mt-1">Full analysis summary generated for project registry.</p>
        </div>
        
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-sm font-semibold transition-all duration-300"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 space-y-6 shadow-xl max-w-2xl mx-auto">
        <div className="flex items-center gap-4 border-b border-[#2A2A2A] pb-4">
          <FileText className="w-8 h-8 text-[#8B5CF6]" />
          <div>
            <h3 className="text-xl font-bold text-white font-display">StyleMirror AI Profile</h3>
            <p className="text-xs text-[#9CA3AF]">ID: {imageId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
            <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">Face Shape</span>
            <p className="text-white text-lg font-semibold mt-1 capitalize">{imageStore.faceShape}</p>
          </div>
          
          <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
            <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">Skin Undertone</span>
            <p className="text-white text-lg font-semibold mt-1 capitalize">{imageStore.skinTone}</p>
          </div>

          <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
            <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">Hair Type</span>
            <p className="text-white text-lg font-semibold mt-1 capitalize">{imageStore.hairType}</p>
          </div>

          <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A]">
            <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">Aesthetic Style</span>
            <p className="text-white text-lg font-semibold mt-1 capitalize">{imageStore.currentStyle}</p>
          </div>
        </div>

        <div className="p-4 bg-[#0A0A0A] rounded-xl border border-[#2A2A2A] flex items-center justify-between text-sm">
          <div>
            <span className="text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">Style Standing (Fashion Score)</span>
            <p className="text-[#8B5CF6] text-2xl font-bold mt-1 font-display">{imageStore.fashionScore?.toFixed(1) || '0.0'}/10</p>
          </div>
          <BarChart2 className="w-10 h-10 text-[#8B5CF6] opacity-35" />
        </div>
      </div>
    </PageWrapper>
  );
};

export default StyleReportPage;
