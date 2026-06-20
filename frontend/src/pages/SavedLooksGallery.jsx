import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';

const SavedLooksGallery = () => {
  const navigate = useNavigate();

  // Mock looks representing the design assets in the zip file
  const mockLooks = [
    {
      id: 1,
      title: 'Sharp Creative',
      tags: ['Interview', 'Minimal'],
      imageUrl: 'https://lh3.googleusercontent.com/aida/AP1WRLvmR88oLCCkhq0wdXomNte-9Q7MrxfJwJ-Qc02bSjomCb1TPx8dxqhnjT9eOMWt06eIxzp6nr25XDLdKSRlgbI0FfOnccHsp4cADuhkZY9HNg-PU4nxwFs-usWjL2dYnBVn4GP4KSu1qDxVZ-B0k51-Tx716WLU9ku0UO14ptyqSU_Duq2vtKEGP1RAsRajEQjGs61EL0oVLr2ghTZIsSNTGjG08jCZka01JZP68C7mXj4n4rheV9ltYrM',
      isFavorite: true,
    },
    {
      id: 2,
      title: 'Midnight Gala',
      tags: ['Evening', 'Winter'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwd5REu8yGPoPcppVm8D0M3DzCjOhxGGP3O9BEpPuBqxf_la3I27lyamev301c-LMuPcZoCjzEzwVdijvNysg1WASTmBoO7y11-aa4EHJhFMdQGEz4StQqdYLpC3X9S4U9w49MmMceWAWvRi6n4y0atvYPyYpaUKiH1_J2JymJx-KuwjPSjvXY_XrGfJdu5NbR7weNKD4IQjjDJDH7l3kUkvR9BYhx3OC8EAZ3wKU2fp5B6W3FFveD6lbYX5sDd0_ywhlUD4AqHtA',
      isFavorite: true,
      offset: true,
    },
    {
      id: 3,
      title: 'Office Minimal',
      tags: ['Workwear', 'Spring'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDfuLOhdx_ODMFSWg2jTxAkUbZ4kQ0dD3kiMteb7L7kbjL3deHscroYRfTM8_7f4_DqvFtbBmBjOjRmrfTVP4CHy5uZMkf8gIo8HP3HmUGfZNokwcKsHc9y8frpv_tSYpwBnQjhPYmEyOmAQUaXai2OpQk8FWgWhhvMISNgMHH9Xq4b6OfaZ7YOZo9yAsS4t04OVlzRVaBE8iWlNojT1QWfRIDXDQMj9r-yQnT2uqwUpv-9PpOzVr9ZplgkZzmpvMYsO8_9x3gOGI',
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Urban Monochrome',
      tags: ['Street', 'Autumn'],
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1HYn8dsbJsYq385U1jDWpKH0pVLyOC8txeveCIvSbWj5xk6Ky_7p9ejd-cOIDD1qsJexayfPx_FmIIVykX73_AXpnT0YwxwAjFzZSwWjYQS-nq3zJiP704vOUmC3j2F-1e3Q3oLQwFA0e7Txek03UyLouiciRYtiEgZy4MVAjCKoLhsWOdj0iaZuOTT46MB8vmxPri777MPob9y2TaAkyUuwacIOIpX5dtl8ancgh9a4vdcW4qZkJGbXK6sLEIid4SDfGDdiilMQ',
      isFavorite: false,
      offset: true,
    },
  ];

  return (
    <PageWrapper>
      {/* Header Block */}
      <div className="mb-16 md:mb-24 flex flex-col items-center text-center">
        <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-4">4 Looks Saved</span>
        <h1 className="font-display text-4xl md:text-6xl text-white">Your Saved Looks</h1>
      </div>

      {/* Grid of Looks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 gap-x-12 max-w-4xl mx-auto w-full relative z-10">
        {mockLooks.map((look) => (
          <article 
            key={look.id} 
            className={`flex flex-col gap-6 img-hover-container group cursor-pointer ${
              look.offset ? 'md:mt-24' : ''
            }`}
          >
            <div className="relative w-full aspect-[0.67] border border-[#262626] overflow-hidden bg-[#141414]">
              <img 
                src={look.imageUrl} 
                alt={look.title}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 hover:scale-[1.02]"
              />
              {look.isFavorite && (
                <div className="absolute top-4 right-4 text-[#D4AF37] bg-[#0A0A0A]/85 backdrop-blur-sm p-2 border border-[#D4AF37]/30">
                  <span className="material-symbols-outlined block text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              <h2 className="font-headline-md text-2xl font-bold font-display text-white leading-tight group-hover:text-[#7C3AED] transition-colors duration-150">
                {look.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {look.tags.map((tag) => (
                  <span key={tag} className="font-eyebrow-sm text-[10px] px-3 py-1 border border-[#262626] text-[#9CA3AF] uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Try Transform link footer */}
      <div className="flex justify-center mt-24">
        <button
          onClick={() => navigate('/upload')}
          className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] px-8 py-4 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors duration-150 active:scale-95"
          style={{ borderRadius: '0px' }}
        >
          Transform A New Look
        </button>
      </div>
    </PageWrapper>
  );
};

export default SavedLooksGallery;
