import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircleHeart,
  X,
  Send,
  Trash2,
  Sparkles,
  ShieldAlert,
  Heart,
  Info,
  Users,
  Building2,
  FileEdit,
  PhoneCall,
  Minimize2,
  Maximize2,
  AlertTriangle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

const QUICK_ACTIONS = [
  {
    id: 'emotional_support',
    label: 'I need emotional support.',
    icon: Heart,
    prompt: 'I am going through a difficult time and I need emotional support and someone to listen to me without judgment.',
  },
  {
    id: 'understand_assault',
    label: 'I want to understand sexual assault.',
    icon: Info,
    prompt: 'Can you help me understand what constitutes sexual assault, consent, and boundaries in simple and supportive language?',
  },
  {
    id: 'help_someone',
    label: 'I want to help someone.',
    icon: Users,
    prompt: 'Someone I care about told me they experienced assault or harassment. How can I support them respectfully without victim-blaming?',
  },
  {
    id: 'find_ngo',
    label: 'I want to find an NGO.',
    icon: Building2,
    prompt: 'Can you recommend verified NGOs, government helplines, or professional mental health organizations I can contact?',
  },
  {
    id: 'share_story',
    label: 'I want to share my story anonymously.',
    icon: FileEdit,
    prompt: 'How can I submit my story or confession anonymously to Aawaaz Setu? Is it safe, and how does the review process work?',
  },
  {
    id: 'help_right_now',
    label: 'I need help right now.',
    icon: PhoneCall,
    prompt: 'I need immediate help and emergency support right now.',
  },
];

export const AawaazChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isLoading) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInput('');

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setIsLoading(true);

    try {
      // Send conversation to backend proxy
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.text || "I am here with you. Please take your time, and know that you are in a safe, non-judgmental space.";

      const botMessage: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        role: 'model',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorMessage(
        'We are currently experiencing a brief network pause. If you are in crisis, please call 112 or 1091 directly.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorMessage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right) */}
      <div className="fixed bottom-5 right-5 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-[#17243A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#EAE5F5] cursor-pointer border border-[#5B8F8A]/30"
          aria-label="Open Aawaaz AI Safe Chat"
        >
          <div className="w-8 h-8 rounded-full bg-[#EAE5F5] text-[#17243A] flex items-center justify-center shrink-0">
            <MessageCircleHeart className="w-4 h-4 text-[#17243A]" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold tracking-tight text-white leading-tight">
              Aawaaz AI
            </span>
            <span className="text-[10px] text-[#EAE5F5] font-medium leading-none">
              Safe Space to Be Heard
            </span>
          </div>

          {isOpen ? (
            <X className="w-4 h-4 text-[#EAE5F5] ml-1" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#5B8F8A] ml-1" />
          )}
        </motion.button>
      </div>

      {/* Chat Window Modal / Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed z-50 flex flex-col bg-white rounded-3xl shadow-2xl border border-[#17243A]/15 overflow-hidden ${
              isExpanded
                ? 'inset-3 sm:inset-6 md:inset-10 lg:inset-16 w-auto h-auto'
                : 'bottom-20 right-3 sm:right-6 w-[calc(100vw-24px)] sm:w-[420px] max-w-[440px] h-[640px] max-h-[85vh]'
            }`}
          >
            {/* Chatbot Top Header */}
            <div className="bg-[#17243A] text-white px-5 py-4 flex items-center justify-between shrink-0 border-b border-white/10 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center font-serif font-bold text-base border border-white/15">
                  आ
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-sm tracking-tight text-white leading-tight">
                      Aawaaz AI
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#5B8F8A]/30 text-[#EAE5F5] border border-[#5B8F8A]/40">
                      Safe Space
                    </span>
                  </div>
                  <p className="text-[11px] text-[#EEF3F8]/80">
                    Your Safe Space to Be Heard · Non-Judgmental
                  </p>
                </div>
              </div>

              {/* Action Buttons: Expand, Clear, Close */}
              <div className="flex items-center gap-1 text-[#EEF3F8]/80">
                {messages.length > 0 && (
                  <button
                    onClick={handleClearChat}
                    title="Clear Conversation for Privacy"
                    className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Restore default size' : 'Expand full window'}
                  className="hidden sm:inline-flex p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Immediate Emergency Strip */}
            <div className="bg-[#EEF3F8] px-4 py-2.5 border-b border-[#17243A]/10 flex items-center justify-between text-[11px] text-[#252B35] shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <ShieldAlert className="w-3.5 h-3.5 text-[#5B8F8A] shrink-0" />
                <span className="truncate">In immediate danger or crisis? Dial <strong>112</strong> or <strong>1091</strong> directly.</span>
              </div>
              <a
                href="tel:112"
                className="font-bold text-rose-700 hover:text-rose-900 underline ml-2 shrink-0"
              >
                Call 112
              </a>
            </div>

            {/* Chat Body & Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-[#F8F7F3] via-[#EEF3F8]/40 to-white space-y-4">
              
              {/* Welcome Screen when chat is fresh */}
              {messages.length === 0 ? (
                <div className="py-3 space-y-5">
                  
                  {/* Compassionate Welcome Card */}
                  <div className="bg-white rounded-2xl p-6 border border-[#17243A]/10 shadow-xs text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEF3F8] text-[#5B8F8A] flex items-center justify-center mx-auto shadow-2xs border border-[#5B8F8A]/20">
                      <Heart className="w-6 h-6 text-[#5B8F8A]" />
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#17243A] leading-snug">
                      "I am here to listen respectfully and support you without judgment. How can I assist you today?"
                    </h4>

                    <p className="text-xs text-[#252B35]/80 leading-relaxed max-w-sm mx-auto font-normal">
                      Aawaaz AI is a supportive awareness assistant created for Aawaaz Setu. Feel free to talk, explore educational guides, find accredited helplines, or learn about anonymous sharing.
                    </p>

                    <div className="pt-2 text-[11px] text-[#5B8F8A] font-semibold">
                      Student-led initiative by Shreyansh Gupta (DTU) & Shorya Panchal (USICT)
                    </div>
                  </div>

                  {/* 6 Quick Action Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#687385] block px-1">
                      Quick Support Options:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {QUICK_ACTIONS.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleSendMessage(action.prompt)}
                            className="w-full text-left p-3.5 rounded-xl bg-white hover:bg-[#EEF3F8] border border-[#17243A]/10 hover:border-[#5B8F8A]/40 transition-all flex items-center gap-3 text-xs text-[#252B35] font-medium group cursor-pointer shadow-2xs hover:-translate-y-0.5"
                          >
                            <div className="w-7 h-7 rounded-lg bg-[#EEF3F8] text-[#5B8F8A] group-hover:bg-[#17243A] group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className="truncate flex-1">{action.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ) : (
                /* Message Bubbles */
                messages.map((msg) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] sm:max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-2xs whitespace-pre-line ${
                          isUser
                            ? 'bg-[#17243A] text-white rounded-br-xs font-normal'
                            : 'bg-white text-[#252B35] border border-[#17243A]/10 rounded-bl-xs font-normal shadow-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-[#687385] mt-1 px-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Typing / Loading Animation */}
              {isLoading && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#17243A]/10 max-w-[140px] shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-[#5B8F8A] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#5B8F8A]/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-[#5B8F8A]/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-[11px] text-[#5B8F8A] font-medium ml-1">Thinking...</span>
                </div>
              )}

              {/* Error Alert with Quick Help Action */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p>{errorMessage}</p>
                    <div className="mt-2 flex gap-2">
                      <a
                        href="tel:112"
                        className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-bold inline-block"
                      >
                        Dial 112 (Emergency)
                      </a>
                      <a
                        href="tel:1091"
                        className="px-2.5 py-1 bg-[#17243A] text-white rounded text-[11px] font-bold inline-block"
                      >
                        Dial 1091 (Women Helpline)
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Section */}
            <div className="p-3.5 bg-white border-t border-[#17243A]/10 shrink-0">
              <div className="flex items-center gap-2 bg-[#F8F7F3] border border-[#17243A]/15 rounded-2xl px-3.5 py-1.5 focus-within:ring-2 focus-within:ring-[#5B8F8A] focus-within:bg-white transition-all">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question or share how you are feeling..."
                  className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#252B35] placeholder-[#687385] resize-none focus:outline-none max-h-24 leading-normal py-1"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl transition-all shrink-0 cursor-pointer ${
                    input.trim() && !isLoading
                      ? 'bg-[#17243A] text-white hover:bg-[#252B35] shadow-2xs hover:scale-105 active:scale-95'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Chatbot Required Disclaimer Footer */}
              <p className="text-[10px] text-[#687385] text-center leading-tight mt-2 px-1">
                AI-powered support by Aawaaz Setu. This chatbot is not a substitute for professional mental health care, legal advice, or emergency services.
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
