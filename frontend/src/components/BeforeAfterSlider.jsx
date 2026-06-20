import React, { useState, useRef, useEffect, useCallback } from 'react';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  }, [isDragging, handleMove]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging, handleMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div 
      ref={containerRef}
      className="split-container select-none relative cursor-ew-resize"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        aspectRatio: '4 / 3',
        overflow: 'hidden',
        border: '1px solid #D4AF37'
      }}
      onMouseDown={() => setIsDragging(true)}
      onTouchStart={() => setIsDragging(true)}
    >
      {/* Underlying Image (AFTER) */}
      <img 
        src={afterImage} 
        alt="After style makeover" 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />
      
      {/* Overlay Image (BEFORE) */}
      <div 
        className="absolute top-0 left-0 h-full overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%`, zIndex: 10 }}
      >
        <img 
          src={beforeImage} 
          alt="Before upload" 
          className="absolute top-0 left-0 h-full object-cover pointer-events-none max-w-none"
          style={{ width: containerRef.current ? containerRef.current.clientWidth : '800px', height: '100%' }}
        />
      </div>

      {/* Gold Divider Line */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] bg-[#D4AF37] pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)', zIndex: 20 }}
      >
        {/* Violet Drag Handle */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#7C3AED] rounded-full flex items-center justify-center text-white border-2 border-[rgba(212,175,55,0.5)] shadow-lg"
        >
          <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
        </div>
      </div>

      {/* Text Labels */}
      <div className="absolute top-4 left-6 z-30 pointer-events-none mix-blend-difference text-white font-eyebrow-sm text-xs uppercase tracking-widest">
        Before
      </div>
      <div className="absolute top-4 right-6 z-30 pointer-events-none mix-blend-difference text-white font-eyebrow-sm text-xs uppercase tracking-widest">
        After
      </div>
    </div>
  );
};

export default BeforeAfterSlider;
