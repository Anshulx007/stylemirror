import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import PreferencesPage from './pages/PreferencesPage';
import RecommendationsPage from './pages/RecommendationsPage';
import MakeoverPage from './pages/MakeoverPage';
import StyleReportPage from './pages/StyleReportPage';
import FashionChatPage from './pages/FashionChatPage';
import SavedLooksGallery from './pages/SavedLooksGallery';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col font-body">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/makeover" element={<MakeoverPage />} />
            <Route path="/report" element={<StyleReportPage />} />
            <Route path="/chat" element={<FashionChatPage />} />
            <Route path="/gallery" element={<SavedLooksGallery />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
