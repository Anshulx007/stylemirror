import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useChatStore } from '../store/useChatStore';
import { useImageStore } from '../store/useImageStore';

const FashionChatPage = () => {
  const imageId = useImageStore((state) => state.imageId);
  const messages = useChatStore((state) => state.messages);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const typing = useChatStore((state) => state.typing);
  const clearChat = useChatStore((state) => state.clearChat);

  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || typing) return;
    sendMessage(input, imageId);
    setInput('');
  };

  const suggestions = [
    "What necklines work best for an oval face?",
    "Which styling combinations fit warm skin tones?",
    "Suggest formal footwear coordinates.",
  ];

  return (
    <PageWrapper>
      {/* Editorial Header */}
      <div className="text-center mb-12 flex flex-col items-center">
        <span className="font-eyebrow-sm text-xs uppercase tracking-widest text-[#9CA3AF] mb-4">Chat Assistant</span>
        <h1 className="font-display text-4xl md:text-5xl text-white">Digital Atelier Assistant</h1>
      </div>

      <div className="flex flex-col h-[65vh] bg-[#141414]/30 border border-[#262626] max-w-3xl mx-auto w-full relative z-10">
        
        {/* Chat Header */}
        <div className="px-6 py-4 bg-[#0A0A0A]/50 border-b border-[#262626] flex justify-between items-center">
          <div className="flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-[#7C3AED]">chat</span>
            <div>
              <h3 className="font-eyebrow-sm text-xs uppercase tracking-widest font-bold text-white">StyleMirror AI</h3>
              <p className="text-[10px] text-[#9CA3AF]">Real-time fashion & grooming advice</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="font-eyebrow-sm text-[10px] uppercase tracking-widest px-3 py-1.5 border border-[#262626] text-[#9CA3AF] hover:text-white transition-colors"
            style={{ borderRadius: '0px' }}
          >
            Clear History
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 overflow-y-auto space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
              <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] animate-pulse">
                <span className="material-symbols-outlined text-[24px]">face</span>
              </div>
              <div className="max-w-md">
                <p className="text-white font-medium">Hello! I am your AI Fashion Assistant.</p>
                <p className="text-xs text-[#9CA3AF] mt-2 leading-relaxed">Ask me anything about hairstyles, makeup palettes, accessories, or outfits. Select one of the ideas below to start:</p>
              </div>
              <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-4 py-3 border border-[#262626] bg-[#0A0A0A]/50 text-[#9CA3AF] hover:text-white text-xs text-left transition-colors font-medium hover:border-[#7C3AED]/40"
                    style={{ borderRadius: '0px' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-8 h-8 flex items-center justify-center border flex-shrink-0 ${
                  m.role === 'user' 
                    ? 'bg-[#7C3AED]/10 border-[#7C3AED]/20 text-[#7C3AED]' 
                    : 'bg-[#141414] border-[#262626] text-white'
                }`}>
                  <span className="material-symbols-outlined text-[16px]">
                    {m.role === 'user' ? 'person' : 'face'}
                  </span>
                </div>
                <div className={`p-4 text-xs leading-relaxed border ${
                  m.role === 'user' 
                    ? 'bg-[#7C3AED] border-[#7C3AED] text-white' 
                    : 'bg-[#0A0A0A]/50 border-[#262626] text-[#9CA3AF]'
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {typing && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 bg-[#141414] border border-[#262626] flex items-center justify-center text-white flex-shrink-0">
                <span className="material-symbols-outlined text-[16px]">face</span>
              </div>
              <div className="p-4 bg-[#0A0A0A]/50 border border-[#262626] text-[#9CA3AF] text-xs animate-pulse">
                Consulting coordinates...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#0A0A0A]/50 border-t border-[#262626] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your styling question here..."
            className="flex-grow px-4 py-3 bg-transparent border-b border-[#262626] text-white focus:border-[#7C3AED] focus:outline-none text-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="px-4 py-3 bg-[#7C3AED] hover:bg-[#5a00c6] disabled:opacity-50 text-white transition-colors flex items-center justify-center"
            style={{ borderRadius: '0px' }}
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default FashionChatPage;
