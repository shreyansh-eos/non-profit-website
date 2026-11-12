import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, MessageSquare, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck, User, Lock, Copy, Check } from 'lucide-react';

interface ConversationLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

interface MessageItem {
  id: number;
  sender_type: 'admin' | 'anonymous';
  message_content: string;
  created_at: string;
}

interface ConversationData {
  id: number;
  conversation_id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
  messages: MessageItem[];
}

export const ConversationLookupModal: React.FC<ConversationLookupModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [conversation, setConversation] = useState<ConversationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialCode) {
      setCode(initialCode);
      handleLookup(initialCode);
    } else {
      try {
        const saved = localStorage.getItem('aawaaz_last_conversation_code');
        if (saved && !code) {
          setCode(saved);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, initialCode]);

  if (!isOpen) return null;

  const handleLookup = async (lookupCode: string) => {
    const clean = lookupCode.trim().toUpperCase();
    if (!clean) {
      setErrorMessage('Please enter your Conversation Code (e.g. AS-XXXX-XXXX).');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/conversation/${encodeURIComponent(clean)}`);
      if (res.ok) {
        const data = await res.json();
        setConversation(data);
        try {
          localStorage.setItem('aawaaz_last_conversation_code', clean);
        } catch (e) {
          // ignore
        }
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Invalid Conversation Code. Please verify your code and try again.');
        setConversation(null);
      }
    } catch (e) {
      setErrorMessage('Could not connect to the server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !conversation) return;

    setSendingReply(true);
    try {
      const res = await fetch(`/api/conversation/${encodeURIComponent(conversation.conversation_id)}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageContent: replyText.trim() }),
      });

      if (res.ok) {
        const newMsg = await res.json();
        setConversation({
          ...conversation,
          messages: [
            ...conversation.messages,
            {
              id: newMsg.messageId,
              sender_type: 'anonymous',
              message_content: newMsg.message_content,
              created_at: newMsg.created_at,
            },
          ],
        });
        setReplyText('');
      } else {
        setErrorMessage('Failed to send reply. Please try again.');
      }
    } catch (e) {
      setErrorMessage('Error sending message.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleCopyCode = () => {
    if (conversation?.conversation_id) {
      navigator.clipboard.writeText(conversation.conversation_id);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#17243A]/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
    >
      <div className="bg-[#F8F7F3] rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-[#17243A]/20 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#17243A] text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5B8F8A]/30 border border-[#5B8F8A]/40 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5 text-[#EAE5F5]" />
            </div>
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight">
                Check My Private Story Conversation
              </h3>
              <p className="text-xs text-[#EEF3F8]/80 font-normal">
                Enter your secure Conversation Code (e.g. AS-XXXX-XXXX) to view admin replies.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Lookup Input Form */}
          <div className="p-5 bg-white rounded-2xl border border-[#17243A]/10 shadow-2xs space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#17243A]">
              Your Conversation Code:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLookup(code)}
                placeholder="e.g. AS-4819-2091"
                className="flex-1 px-4 py-2.5 bg-[#F8F7F3] border border-[#17243A]/15 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider font-semibold focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
              />
              <button
                onClick={() => handleLookup(code)}
                disabled={loading}
                className="px-5 py-2.5 bg-[#17243A] hover:bg-[#252B35] text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{loading ? 'Finding...' : 'Open Thread'}</span>
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Conversation Thread View */}
          {conversation && (
            <div className="space-y-4">
              
              {/* Conversation Meta Bar */}
              <div className="p-4 bg-[#EEF3F8] rounded-2xl border border-[#17243A]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-[#687385] uppercase tracking-wider block">Story Reference</span>
                  <strong className="text-sm text-[#17243A] font-serif">{conversation.title}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="px-2.5 py-1 bg-white hover:bg-[#F8F7F3] border border-[#17243A]/10 rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{conversation.conversation_id}</span>
                  </button>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${
                    conversation.status === 'reviewed' ? 'bg-emerald-100 text-emerald-800' :
                    conversation.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    'bg-[#17243A] text-white'
                  }`}>
                    {conversation.status}
                  </span>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#17243A]/10 max-h-80 overflow-y-auto">
                {conversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender_type === 'admin' ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender_type === 'admin'
                          ? 'bg-[#EEF3F8] text-[#17243A] border border-[#5B8F8A]/30 rounded-tl-xs'
                          : 'bg-[#17243A] text-white rounded-tr-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1 text-[10px] opacity-75 font-semibold">
                        {msg.sender_type === 'admin' ? (
                          <>
                            <ShieldCheck className="w-3 h-3 text-[#5B8F8A]" />
                            <span>Aawaaz Setu Team</span>
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            <span>You (Anonymous)</span>
                          </>
                        )}
                        <span>·</span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="whitespace-pre-line">{msg.message_content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Anonymous Reply Input */}
              <form onSubmit={handleSendReply} className="space-y-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Send an anonymous follow-up message to the team..."
                  className="w-full px-4 py-2.5 bg-white border border-[#17243A]/15 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#5B8F8A]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    className="px-5 py-2.5 bg-[#17243A] hover:bg-[#252B35] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-[#EAE5F5]" />
                    <span>{sendingReply ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F8F7F3] border-t border-[#17243A]/10 flex items-center justify-between text-xs text-[#687385] shrink-0">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#5B8F8A]" />
            <span>End-to-End Anonymous & Confidential</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-[#17243A]/15 rounded-lg text-xs text-[#17243A] hover:bg-[#EEF3F8] cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
