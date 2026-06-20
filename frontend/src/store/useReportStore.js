import { create } from 'zustand';
import { generateReport as apiGenerateReport } from '../services/api';
import { useAppStore } from './useAppStore';

export const useReportStore = create((set) => ({
  report: null,
  pdfUrl: null,
  
  generateReport: async (imageId) => {
    const { setLoading, setError } = useAppStore.getState();
    setLoading(true);
    setError(null);
    try {
      const data = await apiGenerateReport(imageId);
      set({ report: data, pdfUrl: `http://127.0.0.1:8000/api/v1/report/pdf/${imageId}` });
      return data;
    } catch (err) {
      const errMsg = err.response?.data?.detail || err.message || 'Failed to generate report.';
      setError(errMsg);
      useAppStore.getState().showToast(errMsg, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  },
  
  downloadReport: async (imageId) => {
    window.open(`http://127.0.0.1:8000/api/v1/report/pdf/${imageId}`, '_blank');
  },
}));
