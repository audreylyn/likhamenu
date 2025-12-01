import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Bot, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';
import { sendChatbotMessage } from '../services/chatbotService';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatSupportProps {
  websiteId: string;
}

export const ChatSupport: React.FC<ChatSupportProps> = ({ websiteId }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! I'm here to help you with your questions. How can I assist you today?", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Check if chat support is enabled for this website
  useEffect(() => {
    if (websiteId) {
      checkChatSupportEnabled();
    }
  }, [websiteId]);

  const checkChatSupportEnabled = async () => {
    try {
      if (!websiteId) {
        setIsEnabled(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('chat_support_config')
        .select('is_enabled, greeting_message')
        .eq('website_id', websiteId)
        .single();

      if (error) {
        // If config doesn't exist (PGRST116) or any other error, default to disabled
        if (error.code === 'PGRST116') {
          // Config doesn't exist, create it as disabled
          const { error: insertError } = await supabase
            .from('chat_support_config')
            .insert({
              website_id: websiteId,
              is_enabled: false,
              greeting_message: 'Hi! How can we help you today?',
              agent_name: 'Support',
              position: 'bottom-right',
            });
          
          if (insertError) {
            console.error('Error creating chat support config:', insertError);
          }
        }
        setIsEnabled(false);
        setLoading(false);
        return;
      }

      if (data) {
        // Explicitly check is_enabled - only enable if it's explicitly true
        setIsEnabled(data.is_enabled === true);
        // Update greeting message if available
        if (data.greeting_message && messages.length > 0 && messages[0].sender === 'bot') {
          setMessages(prev => prev.map((msg, idx) => 
            idx === 0 ? { ...msg, text: data.greeting_message } : msg
          ));
        }
      } else {
        setIsEnabled(false);
      }
    } catch (error) {
      console.error('Error checking chat support:', error);
      setIsEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  // Initialize conversation ID on mount
  useEffect(() => {
    if (!conversationId) {
      setConversationId(`conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const userMessageText = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      // Use chatbot service to get response
      const botResponse = await sendChatbotMessage(userMessageText, websiteId, conversationId);
      
      const botMsg: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your message. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Don't render if disabled or still loading
  if (loading || !isEnabled) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className={`fixed bottom-8 right-8 z-40 p-5 rounded-full shadow-2xl transition-colors flex items-center justify-center ${
            isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
        {!isOpen && messages.length === 1 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
            </span>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-8 w-[90vw] md:w-[400px] h-[600px] max-h-[75vh] bg-white rounded-3xl shadow-2xl z-40 flex flex-col overflow-hidden border border-slate-200 font-sans"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 flex items-center gap-4 shadow-lg relative z-10">
                <div className="relative">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-sm border border-white/20">
                        <MessageCircle size={24} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-white font-serif font-bold text-xl leading-tight">Chat Support</h3>
                    <p className="text-white text-xs mt-0.5">Typically replies in minutes</p>
                </div>
                <button 
                    onClick={() => setIsOpen(false)} 
                    className="ml-auto text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                    <Minimize2 size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50 scroll-smooth">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {/* Bot Avatar */}
                        {msg.sender === 'bot' && (
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                             <Bot size={16} className="text-blue-600" />
                          </div>
                        )}

                        <div className={`flex flex-col max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-700 border border-slate-200 rounded-bl-none'
                                }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1 px-1">
                                {formatTime(msg.timestamp)}
                            </span>
                        </div>

                         {/* User Avatar */}
                         {msg.sender === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-sm">
                             <User size={16} className="text-white" />
                          </div>
                        )}
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex items-end gap-3 justify-start">
                         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 border border-blue-100">
                             <Bot size={16} className="text-blue-600" />
                          </div>
                         <div className="bg-white text-gray-500 border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none text-xs flex gap-1 items-center shadow-sm">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 z-10">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-14 py-3 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20 transition-all font-sans placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim()}
                        className="absolute right-2 bg-blue-600 hover:bg-slate-900 text-white p-2 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-105 active:scale-95"
                    >
                        <Send size={16} className={inputValue.trim() ? 'ml-0.5' : ''} />
                    </button>
                </div>
                <div className="text-center mt-3">
                     <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                        Powered by LikhaSiteWorks Team
                     </span>
                </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
