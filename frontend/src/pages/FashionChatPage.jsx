import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import { useChatStore } from '../store/useChatStore';
import { useImageStore } from '../store/useImageStore';
import { Send, User, Bot, Sparkles } from 'lucide-react';

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
      <div className="flex flex-col h-[70vh] bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-xl max-w-3xl mx-auto w-full">
        {/* Chat Header */}
        <div className="px-6 py-4 bg-[#0A0A0A] border-b border-[#2A2A2A] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="font-bold text-white">StyleMirror AI Assistant</h3>
              <p className="text-xs text-[#9CA3AF]">Real-time fashion & grooming advice</p>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="text-xs px-3 py-1.5 border border-[#2A2A2A] rounded-lg text-[#9CA3AF] hover:text-white transition"
          >
            Clear History
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-grow p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
              <Bot className="w-12 h-12 text-[#8B5CF6] opacity-40 animate-bounce" />
              <div className="max-w-md">
                <p className="text-white font-medium">Hello! I am your AI Fashion Assistant.</p>
                <p className="text-sm text-[#9CA3AF] mt-1">Ask me anything about hairstyles, makeup palettes, accessories, or outfits. Select one of the ideas below to start:</p>
              </div>
              <div className="flex flex-col gap-2 mt-4 w-full max-w-sm">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="px-4 py-2 border border-[#2A2A2A] bg-[#0A0A0A] text-[#9CA3AF] hover:text-white rounded-xl text-xs text-left transition hover:border-[#8B5CF6]/40"
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
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  m.role === 'user' 
                    ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20' 
                    : 'bg-[#141414] border-[#2A2A2A]'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-[#8B5CF6]" /> : <Bot className="w-4 h-4 text-[#8B5CF6]" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#8B5CF6] text-white rounded-tr-none' 
                    : 'bg-[#0A0A0A] border border-[#2A2A2A] text-[#9CA3AF] rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))
          )}
          {typing && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#2A2A2A] flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-[#2A2A2A] text-[#9CA3AF] rounded-2xl rounded-tl-none text-sm animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#0A0A0A] border-t border-[#2A2A2A] flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your styling question here..."
            className="flex-grow px-4 py-3 bg-[#141414] border border-[#2A2A2A] rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none text-sm"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="p-3 bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default FashionChatPage;
