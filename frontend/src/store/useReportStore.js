import { create } from 'zustand';

export const useReportStore = create((set) => ({
  report: null,
  pdfUrl: null,
  
  generateReport: async (imageId) => {
    // Basic mock generator for Phase 4 Style Report
    const mockReport = {
      title: 'StyleMirror AI Style Report',
      date: new Date().toLocaleDateString(),
      imageId: imageId,
    };
    set({ report: mockReport, pdfUrl: `http://127.0.0.1:8000/api/v1/report/pdf/${imageId}` });
    return mockReport;
  },
  
  downloadReport: async (imageId) => {
    window.open(`http://127.0.0.1:8000/api/v1/report/pdf/${imageId}`, '_blank');
  },
}));
