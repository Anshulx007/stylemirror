import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { path: '/', label: 'Explore' },
    { path: '/gallery', label: 'My Gallery' },
    { path: '/chat', label: 'Style Chat' },
    { path: '/report', label: 'Report' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Brand area */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer">
          <span className="material-symbols-outlined text-white group-hover:text-[#7C3AED] transition-colors duration-150" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
          <span className="font-headline-md text-xl font-bold tracking-tighter text-white font-display">StyleMirror AI</span>
        </Link>
        
        {/* Links */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`font-eyebrow-sm text-xs uppercase tracking-widest transition-colors duration-150 relative py-1 ${
                  isActive 
                    ? 'text-white border-b border-white' 
                    : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-3">
          {/* Mobile menu trigger or chat fallback */}
          <Link to="/chat" className="md:hidden p-2 text-[#9CA3AF] hover:text-white">
            <span className="material-symbols-outlined">chat</span>
          </Link>
          <button 
            onClick={() => navigate('/upload')}
            className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] px-4 py-2 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors duration-150 active:scale-95 flex items-center gap-1.5"
          >
            Transform
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
