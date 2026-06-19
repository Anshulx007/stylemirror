import { create } from 'zustand';
import { chat as apiChat } from '../services/api';

export const useChatStore = create((set, get) => ({
  messages: [],
  typing: false,
  
  sendMessage: async (text, imageId) => {
    const newMsg = { role: 'user', content: text };
    set((state) => ({ 
      messages: [...state.messages, newMsg],
      typing: true 
    }));
    
    try {
      const allMessages = get().messages;
      const data = await apiChat(allMessages, imageId);
      const assistantMsg = { role: 'assistant', content: data.reply };
      set((state) => ({ 
        messages: [...state.messages, assistantMsg] 
      }));
    } catch (err) {
      console.error('Chat error', err);
      set((state) => ({ 
        messages: [...state.messages, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }] 
      }));
    } finally {
      set({ typing: false });
    }
  },
  
  clearChat: () => set({ messages: [], typing: false }),
}));
