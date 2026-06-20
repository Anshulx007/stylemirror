import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { CheckCircle, Info, AlertTriangle, XCircle, X } from 'lucide-react';

const PageWrapper = ({ children }) => {
  const toast = useAppStore((state) => state.toast);
  const hideToast = useAppStore((state) => state.hideToast);

  const getToastConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
          classes: 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300',
        };
      case 'info':
        return {
          icon: <Info className="w-5 h-5 text-blue-400" />,
          classes: 'bg-blue-950/40 border-blue-500/20 text-blue-300',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          classes: 'bg-amber-950/40 border-amber-500/20 text-amber-300',
        };
      case 'error':
      default:
        return {
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          classes: 'bg-red-955/40 border-red-500/20 text-red-300',
        };
    }
  };

  const toastConfig = toast ? getToastConfig(toast.type) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen pt-24 pb-16 px-6 bg-[#0A0A0A] text-[#F5F5F5] flex flex-col items-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />
      <div className="w-full max-w-5xl relative z-10 flex flex-col flex-grow">
        {children}
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && toastConfig && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl border backdrop-blur-md shadow-2xl max-w-sm ${toastConfig.classes}`}
          >
            <div className="flex-shrink-0">{toastConfig.icon}</div>
            <div className="flex-grow text-sm font-medium">{toast.message}</div>
            <button
              onClick={hideToast}
              className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PageWrapper;
