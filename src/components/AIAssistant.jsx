import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

import { 
  MessageSquare, 
  Send, 
  X, 
  User, 
  Sparkles, 
  Loader2, 
  Stethoscope, 
  Activity,
  Plus,
  ExternalLink,
  Trash2,
  Square,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ClinicalAIIcon from './ClinicalAIIcon';

const AIAssistant = ({ role = 'patient' }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: role === 'doctor' 
        ? "Hello Doctor. I'm your Clinical AI Assistant. How can I assist you with patient analysis or ECG interpretation today?" 
        : "Hello! I'm your AI Health Assistant. How are you feeling today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [conversationId, setConversationId] = useState(localStorage.getItem('current_conv_id'));
  const abortControllerRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const activeId = localStorage.getItem('current_conv_id');
      setConversationId(activeId);
      
      const fetchHistory = async () => {
        if (!activeId) return;
        try {
          const response = await api.get(`/ai/conversations/${activeId}`);
          if (response.data.length > 0) {
            const historicalMessages = response.data.map(msg => ({
              role: msg.sender === 'bot' ? 'assistant' : 'user',
              content: msg.text
            }));
            setMessages(historicalMessages);
          }
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setConversationId(null);
    localStorage.removeItem('current_conv_id');
    setMessages([
      { 
        role: 'assistant', 
        content: role === 'doctor' 
          ? "Hello Doctor. I'm your Clinical AI Assistant. How can I assist you with patient analysis or ECG interpretation today?" 
          : "Hello! I'm your AI Health Assistant. How are you feeling today?" 
      }
    ]);
    setInput('');
  };

  const clearHistory = async () => {
    if (window.confirm("Clear all chat history?")) {
      try {
        await api.delete('/ai/history');
        handleNewChat();
      } catch (error) {
        console.error('Failed to clear history:', error);
      }
    }
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageToSend = textOverride || input;
    if (!messageToSend.trim()) return;

    const userMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!textOverride) setInput('');
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('message', messageToSend);
      if (conversationId) {
        formData.append('conversation_id', conversationId);
      }
      
      abortControllerRef.current = new AbortController();

      const response = await api.post('/ai/chat', formData, {
        signal: abortControllerRef.current.signal
      });

      if (response.data.is_new_chat) {
        setConversationId(response.data.conversation_id);
        localStorage.setItem('current_conv_id', response.data.conversation_id);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        return;
      }
      console.error('AI chat failed:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I am having trouble connecting to my server right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsTyping(false);
    }
  };

  const handleEditStart = (index, text) => {
    setEditingIndex(index);
    setEditInput(text);
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditInput('');
  };

  const handleEditSubmit = async (index) => {
    if (!editInput.trim()) return;
    const newText = editInput;
    handleEditCancel();
    // For floating assistant, we just append a new one or replace? 
    // Usually append is safer for history.
    setInput(newText);
    // Trigger handleSend manually
    const syntheticEvent = { preventDefault: () => {} };
    await handleSend(syntheticEvent, newText);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              width: window.innerWidth > 480 ? '384px' : '90vw',
              height: 'min(600px, 80vh)'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden mb-4 flex flex-col"
          >
            {/* Header */}
            <div className={`p-4 ${role === 'doctor' ? 'bg-healthcare-dark' : 'bg-healthcare-blue'} text-white flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  {role === 'doctor' ? <Stethoscope size={20} /> : <ClinicalAIIcon size={20} />}
                </div>
                <div>
                  <div className="text-sm font-bold">AI Assistant</div>
                  <div className="text-[10px] opacity-70 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div> Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleNewChat} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                  title="New Chat"
                >
                  <Plus size={18} />
                </button>
                <button 
                  onClick={clearHistory} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                  title="Clear History"
                >
                  <Trash2 size={16} />
                </button>
                <button 
                  onClick={() => navigate('/ai-assistant')} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                  title="Full Screen Chat"
                >
                  <ExternalLink size={18} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="hover:bg-white/10 p-2 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 min-h-0"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group relative`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm break-words whitespace-pre-wrap relative ${
                    msg.role === 'user' 
                      ? (role === 'doctor' ? 'bg-healthcare-dark text-white rounded-tr-none' : 'bg-healthcare-blue text-white rounded-tr-none')
                      : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none'
                  }`}>
                    {editingIndex === i ? (
                      <div className="flex flex-col gap-2 min-w-[150px]">
                        <textarea 
                          className="w-full bg-white/10 text-white border border-white/20 rounded-lg p-2 outline-none text-xs"
                          value={editInput}
                          onChange={(e) => setEditInput(e.target.value)}
                          autoFocus
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={handleEditCancel} className="text-[10px] opacity-70">Cancel</button>
                          <button onClick={() => handleEditSubmit(i)} className="text-[10px] bg-white text-healthcare-blue px-2 py-1 rounded">Resend</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {msg.content}
                        {msg.role === 'user' && (
                          <button 
                            onClick={() => handleEditStart(i, msg.content)}
                            className="absolute -left-8 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-healthcare-blue opacity-0 group-hover:opacity-100 transition-all"
                            title="Edit and resend"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <Loader2 size={18} className="animate-spin text-healthcare-blue" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3 mt-auto">
              <input 
                type="text" 
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-healthcare-blue/20 outline-none"
                placeholder="Ask a clinical question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {isTyping ? (
                <button 
                  type="button"
                  onClick={handleStop}
                  className="p-3 rounded-xl bg-rose-500 text-white transition-transform active:scale-95 shadow-lg shadow-rose-500/20"
                >
                  <Square size={20} fill="currentColor" />
                </button>
              ) : (
                <button 
                  type="submit" 
                  className={`p-3 rounded-xl text-white transition-transform active:scale-95 ${role === 'doctor' ? 'bg-healthcare-dark' : 'bg-healthcare-blue'}`}
                >
                  <Send size={20} />
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all duration-300 ${
          role === 'doctor' 
            ? 'bg-healthcare-dark shadow-healthcare-dark/20' 
            : 'bg-healthcare-blue shadow-healthcare-blue/20'
        }`}
      >
        {isOpen ? <X size={24} /> : (role === 'doctor' ? <Sparkles size={24} /> : <MessageSquare size={24} />)}
      </button>
    </div>
  );
};

export default AIAssistant;
