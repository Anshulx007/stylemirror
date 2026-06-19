import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Image, MessageSquare, BookOpen, Layers } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Sparkles },
    { path: '/upload', label: 'Upload', icon: Image },
    { path: '/chat', label: 'Style Chat', icon: MessageSquare },
    { path: '/report', label: 'Report', icon: BookOpen },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-[#2A2A2A] bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight font-display">
          <Sparkles className="w-6 h-6 text-[#8B5CF6]" />
          <span>StyleMirror <span className="text-[#8B5CF6]">AI</span></span>
        </Link>
        
        <div className="flex gap-1 md:gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  isActive 
                    ? 'text-white bg-[#8B5CF6]/15 border border-[#8B5CF6]/30' 
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#141414]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8B5CF6]' : ''}`} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
