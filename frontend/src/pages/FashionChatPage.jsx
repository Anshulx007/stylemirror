import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import { useChatStore } from '../store/useChatStore';
import { useImageStore } from '../store/useImageStore';
import { useRecommendationStore } from '../store/useRecommendationStore';

const FashionChatPage = () => {
  const navigate = useNavigate();
  const imageId = useImageStore((state) => state.imageId);
  const previewUrl = useImageStore((state) => state.previewUrl);
  const makeoverUrl = useRecommendationStore((state) => state.makeoverUrl);
  
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const typing = useChatStore((state) => state.typing);
  const clearChat = useChatStore((state) => state.clearChat);

  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, typing]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || typing) return;
    sendMessage(input, imageId);
    setInput('');
  };

  const handleSuggestionClick = (text) => {
    if (typing) return;
    sendMessage(text, imageId);
  };

  return (
    <PageWrapper>
      <main className="flex-grow flex flex-col max-w-[1000px] w-full mx-auto relative h-[calc(100vh-140px)]">
        
        {/* Slim Header within Chat */}
        <div className="w-full pt-6 pb-4 bg-[#0A0A0A] z-10 flex justify-between items-center border-b border-[#262626]/50">
          <h1 className="font-display text-2xl text-white border-b border-[#D4AF37] pb-2 inline-block">
            Fashion Assistant
          </h1>
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              className="font-eyebrow-sm text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#262626] text-[#9CA3AF] hover:text-white transition-colors"
              style={{ borderRadius: '0px' }}
            >
              Clear History
            </button>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto pb-36 pt-6 flex flex-col gap-6 hide-scrollbar">
          
          {/* Assistant Welcome Message */}
          <div className="flex items-start gap-4 max-w-[85%] md:max-w-[70%]">
            <div className="shrink-0 mt-1">
              <span className="material-symbols-outlined text-[#D4AF37]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
            </div>
            <div className="border border-[#D4AF37] bg-transparent text-[#F5F5F0] p-4 font-body text-sm leading-relaxed">
              Welcome to your personal StyleMirror atelier. I am here to assist with color analysis, outfit curation, and tailoring advice. How may I refine your look today?
            </div>
          </div>

          {/* Empty State / Suggestion Chips */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-3 mt-2 ml-10">
              <button 
                type="button"
                onClick={() => handleSuggestionClick("What should I wear for an interview?")}
                className="border border-[#262626] bg-transparent hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#9CA3AF] px-4 py-2 font-label text-xs transition-colors duration-150 whitespace-nowrap"
                style={{ borderRadius: '0px' }}
              >
                What should I wear for an interview?
              </button>
              <button 
                type="button"
                onClick={() => handleSuggestionClick("Which colors suit me?")}
                className="border border-[#262626] bg-transparent hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#9CA3AF] px-4 py-2 font-label text-xs transition-colors duration-150 whitespace-nowrap"
                style={{ borderRadius: '0px' }}
              >
                Which colors suit me?
              </button>
              <button 
                type="button"
                onClick={() => handleSuggestionClick("Explain my skin tone analysis.")}
                className="border border-[#262626] bg-transparent hover:border-[#7C3AED] hover:text-[#7C3AED] text-[#9CA3AF] px-4 py-2 font-label text-xs transition-colors duration-150 whitespace-nowrap"
                style={{ borderRadius: '0px' }}
              >
                Explain my skin tone analysis.
              </button>
            </div>
          )}

          {/* Chat History Messages */}
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${m.role === 'user' ? 'ml-auto justify-end' : ''}`}
            >
              {m.role !== 'user' && (
                <div className="shrink-0 mt-1">
                  <span className="material-symbols-outlined text-[#D4AF37]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
                </div>
              )}
              
              <div 
                className={`p-4 font-body text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user' 
                    ? 'bg-[#7C3AED] text-white' 
                    : 'border border-[#D4AF37] bg-transparent text-[#F5F5F0]'
                }`}
                style={{ borderRadius: '0px' }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {/* Typing state */}
          {typing && (
            <div className="flex gap-4 max-w-[85%] md:max-w-[70%]">
              <div className="shrink-0 mt-1">
                <span className="material-symbols-outlined text-[#D4AF37]" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
              </div>
              <div className="border border-[#D4AF37] bg-transparent text-[#9CA3AF] p-4 font-body text-sm leading-relaxed animate-pulse">
                Consulting coordinates...
              </div>
            </div>
          )}

          {/* AI Mirror Preview card injected dynamically if portrait or makeover exists */}
          {(makeoverUrl || previewUrl) && (
            <div className="flex items-start gap-4 max-w-[85%] md:max-w-[70%] mt-2 ml-10">
              <div 
                onClick={() => navigate(makeoverUrl ? '/makeover' : '/preferences')}
                className="border border-[#D4AF37] p-2 bg-[#1A1A1A] w-full max-w-sm group cursor-pointer hover:bg-[#141313] transition-colors duration-150"
              >
                <div className="aspect-[3/4] relative overflow-hidden bg-[#0E0E0E]">
                  <img 
                    className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-300" 
                    alt="Generated Preview" 
                    src={makeoverUrl || previewUrl} 
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-[#262626] pointer-events-none"></div>
                </div>
                <div className="mt-3 mb-1 flex justify-between items-center px-1">
                  <span className="font-eyebrow-sm text-[10px] uppercase tracking-widest text-[#D4AF37]">
                    {makeoverUrl ? "Generated Makeover" : "Uploaded Portrait"}
                  </span>
                  <span className="material-symbols-outlined text-[#9CA3AF] text-sm">zoom_in</span>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form 
          onSubmit={handleSend}
          className="absolute bottom-0 left-0 w-full bg-[#0A0A0A] border-t border-[#262626] py-4 z-20"
        >
          <div className="flex items-end gap-2">
            <div className="flex-grow border-b border-[#262626] focus-within:border-[#7C3AED] transition-colors duration-150 bg-[#1A1A1A] px-4 py-3 relative">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about style, color, or fit..." 
                rows={1}
                style={{ minHeight: '24px' }}
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-white font-body text-sm placeholder:text-[#9CA3AF]/40 resize-none outline-none overflow-hidden block"
              />
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="bg-[#7C3AED] hover:bg-white hover:text-black text-white w-12 h-12 flex items-center justify-center shrink-0 transition-colors duration-150 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">arrow_upward</span>
            </button>
          </div>
          <div className="mt-2 text-center">
            <span className="font-eyebrow-sm text-[10px] text-[#9CA3AF]/60 tracking-widest uppercase">
              StyleMirror AI can make mistakes. Verify stylistic advice.
            </span>
          </div>
        </form>
      </main>
    </PageWrapper>
  );
};

export default FashionChatPage;
