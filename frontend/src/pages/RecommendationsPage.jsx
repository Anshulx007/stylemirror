import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useRecommendationStore } from '../store/useRecommendationStore';
import { useImageStore } from '../store/useImageStore';

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const fashionScore = useImageStore((state) => state.fashionScore);
  const recStore = useRecommendationStore();

  if (!recStore.recommendationId) {
    return (
      <PageWrapper>
        <div className="text-center py-12">
          <p className="text-[#9CA3AF]">No recommendations found. Generate them first.</p>
          <button 
            onClick={() => navigate('/preferences')}
            className="mt-4 font-eyebrow-sm text-xs uppercase tracking-widest text-[#0A0A0A] bg-[#F5F5F0] px-6 py-3 border border-[#F5F5F0] hover:bg-[#0A0A0A] hover:text-[#F5F5F0] transition-colors"
          >
            Preferences
          </button>
        </div>
      </PageWrapper>
    );
  }

  const { outfit, hairstyles, accessories, palette, makeup, occasion, season, budget } = recStore;

  // Format header strings
  const formattedOccasion = occasion ? occasion.toUpperCase() : 'INTERVIEW';
  const formattedSeason = season ? season.toUpperCase() : 'WINTER';
  const formattedBudget = budget ? `₹${budget}` : '₹5000';

  // Dynamic Scores
  const currentScore = fashionScore ? fashionScore.toFixed(1) : '7.2';
  const suggestedScore = fashionScore 
    ? Math.min(9.9, parseFloat((fashionScore * 1.25).toFixed(1))).toFixed(1) 
    : '9.1';

  // Helper to map color names to CSS colors
  const getColorHex = (name) => {
    const colors = {
      "navy blue": "#1B2A4A",
      "emerald green": "#046A38",
      "cool grey": "#8A9A86",
      "lavender": "#E6E6FA",
      "burgundy": "#800020",
      "white": "#FFFFFF",
      "olive green": "#3B5323",
      "warm sand": "#E6D7B9",
      "mustard yellow": "#E1AD01",
      "terracotta": "#C34A2C",
      "cream": "#FFFDD0",
      "coral": "#FF7F50",
      "dusty rose": "#DCAE96",
      "charcoal": "#36454F",
      "taupe": "#483C32",
      "black": "#000000",
      "obsidian": "#0A0A0A",
      "electric violet": "#7C3AED",
      "antique gold": "#D4AF37"
    };
    return colors[name.toLowerCase()] || "#444748";
  };

  // Dynamic outfits
  const outfitTitle = outfit?.tops?.[0]
    ? `${outfit.tops[0]} & ${outfit.bottoms?.[0] || 'Tailored Trousers'}`
    : "Structured Wool Trench & Tailored Trousers";

  const outfitDesc = outfit?.tops?.[0]
    ? `Featuring ${outfit.tops.join(', ')} paired with ${outfit.bottoms?.join(', ')}. Grounded by ${outfit.footwear?.join(', ')}. This styling coordinate elevates your profile while preserving identity.`
    : "The structured shoulders project immediate authority, while the monochromatic dark tones keep the visual focus entirely on your face and communication. A perfect, uncompromising balance.";

  return (
    <PageWrapper>
      {/* Header Section */}
      <header className="flex flex-col items-center text-center pt-8 pb-12">
        <p className="font-eyebrow-sm text-xs tracking-widest text-[#9CA3AF] mb-6 uppercase">
          {formattedOccasion} · {formattedSeason} · {formattedBudget}
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-white max-w-4xl leading-tight">
          Your Look, Reimagined
        </h1>
      </header>

      {/* Score Comparison Section */}
      <section className="mb-20">
        <div className="border border-[#262626] bg-[#141414] py-12 px-6 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1A1A1A] to-transparent opacity-50 pointer-events-none"></div>
          
          <div className="text-center z-10 flex flex-col items-center">
            <p className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest mb-4 uppercase">Current Score</p>
            <p className="font-display text-5xl md:text-7xl text-[#8e9192] font-bold tabular-nums">{currentScore}</p>
          </div>
          
          <div className="hidden md:block w-px h-32 bg-[#D4AF37] opacity-40 z-10"></div>
          <div className="md:hidden h-px w-32 bg-[#D4AF37] opacity-40 z-10"></div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0A0A0A] p-3 rounded-full border border-[#D4AF37] z-20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <span className="material-symbols-outlined text-[#D4AF37]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
          </div>
          
          <div className="text-center z-10 flex flex-col items-center">
            <p className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest mb-4 uppercase">Suggested Score</p>
            <p className="font-display text-5xl md:text-7xl text-white font-bold tabular-nums">{suggestedScore}</p>
          </div>
        </div>
      </section>

      {/* Recommendations Editorial Grid */}
      <section className="mb-20">
        <h2 className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest mb-8 border-b border-[#262626] pb-4 uppercase">The Dossier</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-min">
          {/* Outfit (Featured, spans 8 cols on desktop) */}
          <article className="lg:col-span-8 border border-[#262626] bg-[#141414] hover:bg-[#1C1C1C] transition-colors duration-150 flex flex-col group">
            <div className="aspect-[16/9] lg:aspect-[21/9] w-full bg-[#0A0A0A] relative overflow-hidden border-b border-[#262626]">
              <img 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0" 
                data-alt="A striking high-end editorial fashion photography shot focusing on a structured dark charcoal wool trench coat layered over tailored trousers." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9NkMJl7dY4WglDJW-SfgMS2w7wJMrkMF_xetAnLYxIZzbX94rL5T6GSz0FC-6P3nmUFSyjT41nEi26kyi9HMJTFCw1_Cw2omhqAESsMwyNfownG9fnA_-cJpk6as8siFdMXHJ7gfDVfUI7WXwZXOO1sfaKcEpQyGShCiDhcBGcFHn7TxOU_-HaOsXko5mbpxj-EaYfWlaqKolOE3ROvo98thHWPSYJgemiIo76mpW1arZPdIKcm5XANWQaOdbDCmZ-GEcWtqXFVI" 
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest uppercase">Outfit</span>
                <span className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest">
                  {budget ? `Under ₹${budget}` : '₹3000 - ₹4500'}
                </span>
              </div>
              <h3 className="font-display text-2xl text-white mb-4 capitalize">{outfitTitle}</h3>
              <p className="font-body text-sm text-[#9CA3AF] max-w-2xl leading-relaxed">{outfitDesc}</p>
            </div>
          </article>

          {/* Hairstyle (Spans 4 cols) */}
          <article className="lg:col-span-4 border border-[#262626] bg-[#141414] hover:bg-[#1C1C1C] transition-colors duration-150 flex flex-col group">
            <div className="aspect-square lg:aspect-auto lg:h-[300px] w-full bg-[#0A0A0A] relative overflow-hidden border-b border-[#262626]">
              <img 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                data-alt="A close-up editorial portrait showcasing a sleek, architectural hairstyle, parted sharply and styled with flawless precision." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDF-KypuP7zgeUb0hxY7jy8s8QhLPAWbIxD_VU_qDNEGCCA_x_dLGdDVCJdBWAsOp29b1UXZcwIWf8iKG4qSGjJsqU0AHARBJdlOFmYgwiexFeI7A_04AjdplaYD3IcJ6lP_oK7GH59DE6kji_X922hl3pwQerg7EW96geLH1I8XE6anN9y1xnvYX0bm-N4LAx2YejM4JydobcePUSk4lzB8cp8t4kvivGn0Bf3F9vmO6VMu9VBkTr-3fkX1hGSKLvVkWg0FsUbTEI" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest uppercase">Hairstyle</span>
                <span className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest">Selected</span>
              </div>
              <h3 className="font-display text-xl text-white mb-3 capitalize">
                {hairstyles?.[0] || "Architectural Part"}
              </h3>
              <p className="font-body text-sm text-[#9CA3AF] mt-auto leading-relaxed">
                {hairstyles ? `Suggested cut: ${hairstyles.join(', ')}. Engineered to balance your face shape.` : "Clean lines frame the face, minimizing distraction and demonstrating meticulous attention."}
              </p>
            </div>
          </article>

          {/* Makeup */}
          <article className="lg:col-span-4 border border-[#262626] bg-[#141414] hover:bg-[#1C1C1C] transition-colors duration-150 flex flex-col group">
            <div className="aspect-[4/3] w-full bg-[#0A0A0A] relative overflow-hidden border-b border-[#262626]">
              <img 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                data-alt="A stunning macro beauty shot highlighting a flawless, minimalist makeup look." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvHB5KCKligMJDyjkEFxA6RbENd0wTKa0w-3Bb8OzK6RaUi84XMkGFzFBCkbgacel5h37e7_igwu5ndQbmma02ib55CUG2WojweQhPie4HB_Dq4kN7FXk9Bne_WTblTnHbRsgWzqQ_ui580-0PKVFU8LEjHYj3bgqxPsEkKfeTkoZmW6DBjzhr6VINZ00gWw8G1HyS6swcmLwZ1c9sVbtl8XLECDCc8E420jxujvHcbs5YldhQA26Xtq12IjwmpuQ46LwHv6DRk-A" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest uppercase">Grooming & Makeup</span>
                <span className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest">Profiled</span>
              </div>
              <h3 className="font-display text-xl text-white mb-3 capitalize">
                {makeup?.look || "Matte Neutral Polish"}
              </h3>
              <p className="font-body text-sm text-[#9CA3AF] mt-auto leading-relaxed">
                {makeup 
                  ? `Archetype: ${makeup.look}. Lip shade: ${makeup.lip_color}. Eye: ${makeup.eye_style}. Foundation: ${makeup.foundation}.`
                  : "Subtle contouring enhances natural features without appearing overly done. High confidence, low noise."
                }
              </p>
            </div>
          </article>

          {/* Accessories */}
          <article className="lg:col-span-4 border border-[#262626] bg-[#141414] hover:bg-[#1C1C1C] transition-colors duration-150 flex flex-col group">
            <div className="aspect-[4/3] w-full bg-[#0A0A0A] relative overflow-hidden border-b border-[#262626]">
              <img 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                data-alt="A macro still-life shot of a minimalist geometric silver watch with a black leather strap." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGqstdq0hKDW6NbtuhCC6sPcNAE7uP_6Ivaf7N1Zmh3pc8SRKoG2W_79ndqRGnXk2EXTrQTlvWU3THKkL3ZFhcnfL0HQ4jklrOldbXYtM1Tj_BpNH7xhvXigHWlvK1niO8aAGRm3PuB4a5UES2NCEHSiST-4nJ4QjH6ypg9dIPI6Mz_YPCwM4w80SUCVhskUL3LkpAhwNmMqMrtNHhcTupzI3Ar62ebjkAcdWlZvBMJLlGPG5EAFm0YgjTnlC_xSul00VLKufbCdU" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest uppercase">Accessories</span>
                <span className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest">Curated</span>
              </div>
              <h3 className="font-display text-xl text-white mb-3 capitalize">
                {accessories?.watch || "Geometric Timepiece"}
              </h3>
              <p className="font-body text-sm text-[#9CA3AF] mt-auto leading-relaxed">
                {accessories
                  ? `Recommended: ${accessories.watch || 'Metallic'} watch, ${accessories.belt || 'Leather'} belt, and ${accessories.glasses || 'Geometric'} glasses.`
                  : "A single, purposeful accessory. It signals punctuality and an appreciation for understated design."
                }
              </p>
            </div>
          </article>

          {/* Footwear */}
          <article className="lg:col-span-4 border border-[#262626] bg-[#141414] hover:bg-[#1C1C1C] transition-colors duration-150 flex flex-col group">
            <div className="aspect-[4/3] w-full bg-[#0A0A0A] relative overflow-hidden border-b border-[#262626]">
              <img 
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300" 
                data-alt="A low-angle editorial photograph of polished black leather Chelsea boots." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpa7WsnaLebMW7OuHlN5JywVuuLqKBqCrQidmsmu3CxMyHtBj3EebyHZYT2zOatVL44N2H2sXPBCFdvHuXXapTcayllulFwwm7ug6vm2ycTzasPpiHSFovOissAXoEmoLGtBBIAarzi13fb5iKdyzCcvxKZw_8ao8ma5lo5tnq46UVem4Y-T1MQd6CLpNEaRFbvxFqX6jzNeqX8uq8D_KLi98_GkC8WGy1dXzqbvuCSeFfRkY9c3fLrVdKU7MHAWhWTywAgvgZ0VY" 
              />
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest uppercase">Footwear</span>
                <span className="font-eyebrow-sm text-xs text-[#D4AF37] tracking-widest">Grounding</span>
              </div>
              <h3 className="font-display text-xl text-white mb-3 capitalize">
                {outfit?.footwear?.[0] || "Polished Leather Chelsea"}
              </h3>
              <p className="font-body text-sm text-[#9CA3AF] mt-auto leading-relaxed">
                {outfit?.footwear
                  ? `Recommended footwear styling coordinates: ${outfit.footwear.join(', ')}.`
                  : "Grounds the look with weight and tradition, while the profile maintains a modern edge."
                }
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="mb-32">
        <h2 className="font-eyebrow-sm text-xs text-[#9CA3AF] tracking-widest mb-8 border-b border-[#262626] pb-4 uppercase">Color Architecture</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Best Colors */}
          <div>
            <h3 className="font-eyebrow-sm text-xs text-emerald-400 tracking-widest mb-6 uppercase">Best Colors to Wear</h3>
            <div className="flex flex-wrap gap-4">
              {palette?.best_colors?.map((color, idx) => {
                const hex = getColorHex(color);
                return (
                  <div key={idx} className="flex flex-col gap-3 group">
                    <div 
                      className="w-16 h-16 border border-[#262626] group-hover:border-[#D4AF37] transition-colors duration-150"
                      style={{ backgroundColor: hex }}
                    ></div>
                    <span className="font-eyebrow-sm text-[10px] text-[#9CA3AF] tracking-widest uppercase truncate max-w-[80px]">
                      {color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colors to Avoid */}
          <div>
            <h3 className="font-eyebrow-sm text-xs text-red-400 tracking-widest mb-6 uppercase">Colors to Avoid</h3>
            <div className="flex flex-wrap gap-4">
              {palette?.avoid?.map((color, idx) => {
                const hex = getColorHex(color);
                return (
                  <div key={idx} className="flex flex-col gap-3 group">
                    <div 
                      className="w-16 h-16 border border-[#262626] group-hover:border-red-500 transition-colors duration-150"
                      style={{ backgroundColor: hex }}
                    ></div>
                    <span className="font-eyebrow-sm text-[10px] text-[#9CA3AF] tracking-widest uppercase truncate max-w-[80px]">
                      {color}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-md border-t border-[#262626] p-4 md:p-6 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => navigate('/makeover')}
          className="w-full md:w-auto bg-[#7C3AED] text-white border border-[#D4AF37] px-10 py-4 font-eyebrow-sm text-xs uppercase tracking-widest hover:bg-[#6D28D9] hover:border-white transition-all duration-150 shadow-[0_0_20px_rgba(124,58,237,0.15)] flex justify-center items-center gap-3"
          style={{ borderRadius: '0px' }}
        >
          Generate My Makeover
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
        </button>
        <button 
          onClick={() => navigate('/preferences')}
          className="font-eyebrow-sm text-xs text-[#9CA3AF] hover:text-[#D4AF37] transition-colors duration-150 underline decoration-[#262626] underline-offset-4 hover:decoration-[#D4AF37] bg-transparent border-none cursor-pointer"
        >
          Adjust Preferences
        </button>
      </div>
    </PageWrapper>
  );
};

export default RecommendationsPage;

