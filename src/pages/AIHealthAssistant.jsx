import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, ArrowLeft, HeartPulse, Paperclip, X, FileText, Loader2, Plus, MessageSquare, Trash2, Layout, Share2, MoreHorizontal, Activity, Maximize2, Minimize2, Settings, Square, Minus, Mic, Image, Edit2, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ClinicalAIIcon from '../components/ClinicalAIIcon';

const AIHealthAssistant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(localStorage.getItem('current_conv_id'));
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const abortControllerRef = useRef(null);

  const suggestions = [
    { title: "ECG Analysis", desc: "Interpret heart report informatics", icon: <Activity className="text-[#14B8A6]" /> },
    { title: "Wellness Protocol", desc: "Suggest a heart-healthy diet", icon: <HeartPulse className="text-red-400" /> },
    { title: "Arrhythmia Risks", desc: "Signs of potential cardiac strain", icon: <ShieldCheck className="text-sky-500" /> },
    { title: "Diagnostic FAQ", desc: "Neural classification logic", icon: <FileText className="text-teal-600" /> },
  ];

  const fetchConversations = async () => {
    try {
      const response = await api.get('/ai/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    }
  };

  const fetchMessages = async (convId) => {
    if (!convId) return;
    setIsTyping(true);
    try {
      const response = await api.get(`/ai/conversations/${convId}`);
      const formattedMessages = response.data.map(msg => ({
        id: msg._id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    if (currentConversationId) {
      fetchMessages(currentConversationId);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleNewChat = () => {
    setCurrentConversationId(null);
    localStorage.removeItem('current_conv_id');
    setMessages([]);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const loadConversation = (convId) => {
    setCurrentConversationId(convId);
    localStorage.setItem('current_conv_id', convId);
    fetchMessages(convId);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (window.confirm("Delete this session from archive?")) {
      try {
        await api.delete(`/ai/conversations/${convId}`);
        fetchConversations();
        if (currentConversationId === convId) {
          handleNewChat();
        }
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = textOverride || input;
    if (!messageText.trim() && !selectedFile) return;

    const userMessage = { 
      id: Date.now(), 
      text: messageText, 
      sender: 'user', 
      file: selectedFile 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const fileToSend = selectedFile;
    removeFile();
    setIsTyping(true);

    try {
      const formData = new FormData();
      formData.append('message', userMessage.text);
      if (currentConversationId) {
        formData.append('conversation_id', currentConversationId);
      }
      if (fileToSend) formData.append('file', fileToSend);

      abortControllerRef.current = new AbortController();

      const response = await api.post('/ai/chat', formData, {
        signal: abortControllerRef.current.signal
      });

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.data.reply,
        sender: 'bot'
      }]);

      if (response.data.is_new_chat) {
        const newId = response.data.conversation_id;
        setCurrentConversationId(newId);
        localStorage.setItem('current_conv_id', newId);
        fetchConversations();
      }
    } catch (error) {
      if (error.name === 'CanceledError' || error.name === 'AbortError') return;
      console.error('AI chat failed:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Clinical engine timed out. Please re-initialize transmission.",
        sender: 'bot'
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

  const handleFileSelect = (e) => {
    if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditStart = (msg) => {
    setEditingId(msg.id);
    setEditInput(msg.text);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditInput('');
  };

  const handleEditSubmit = async (msgId) => {
    if (!editInput.trim()) return;
    const text = editInput;
    handleEditCancel();
    await handleSend(null, text);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-[#1A1A1A]">
      <AnimatePresence>
        {!showSidebar && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setShowSidebar(true)}
            className="fixed left-5 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[#1A1A1A] shadow-xl hover:bg-[#14B8A6] hover:text-white transition-all group"
            title="Show Archive"
          >
            <MessageSquare size={18} className="group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#1A1A1A] text-white flex flex-col shrink-0 h-full relative z-50 shadow-2xl"
          >
            <div className="p-6 flex flex-col h-full">
              {/* Vertical Toggle Handle */}
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[#1A1A1A] hover:bg-[#14B8A6] hover:text-white transition-all shadow-xl z-[70] group"
                title="Hide Archive"
              >
                <ChevronLeft size={12} className="group-hover:scale-125 transition-transform" />
              </button>
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#14B8A6] text-[#1A1A1A] rounded-xl flex items-center justify-center shadow-lg">
                    <HeartPulse size={20} />
                  </div>
                  <span className="font-bold text-lg tracking-tight">Clinical<span className="text-[#14B8A6]">AI</span></span>
                </div>
              </div>

              <button 
                onClick={handleNewChat}
                className="btn-premium-teal w-full p-3 text-[9px] uppercase tracking-[0.3em] mb-8 rounded-xl shadow-lg"
              >
                <Plus size={16} /> New Consultation
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar-dark space-y-1">
                <div className="text-[9px] font-bold text-white/30 uppercase tracking-[0.4em] px-3 mb-4">Chat Archive</div>
                {conversations.length === 0 ? (
                  <div className="px-3 py-4 text-[9px] text-white/20 font-bold uppercase tracking-widest italic text-center border border-white/5 rounded-xl">Empty Registry</div>
                ) : (
                  conversations.map((conv) => (
                    <button 
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`flex items-center gap-3 w-full p-3 transition-all text-left group relative rounded-xl mb-0.5 ${currentConversationId === conv._id ? 'bg-white/10 text-[#14B8A6] border border-white/5' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                    >
                      <MessageSquare size={12} className={currentConversationId === conv._id ? 'text-[#14B8A6]' : 'text-white/10'} />
                      <span className="truncate flex-1 text-[10px] font-bold uppercase tracking-widest">{conv.title}</span>
                      <button 
                        onClick={(e) => deleteConversation(e, conv._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-all"
                      >
                        <Trash2 size={10} />
                      </button>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3 group hover:bg-white/10 transition-colors border border-white/5">
                  <div className="w-9 h-9 bg-[#14B8A6] text-[#1A1A1A] rounded-lg flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/80 font-bold uppercase tracking-widest truncate">{user?.name}</div>
                    <div className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-medium">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full relative bg-[#F8FAFC]">
        <header className="h-16 flex items-center justify-between px-8 bg-[#F8FAFC] border-b border-slate-50 sticky top-0 z-40">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#1A1A1A] tracking-tight text-base">Diagnostic Assistant</span>
              <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-50 text-[9px] font-bold text-[#14B8A6] border border-teal-100 shadow-sm">
                <div className="w-1 h-1 bg-[#14B8A6] rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.5)]" /> Neural Sync Active
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-slate-300 mr-2">
                <Activity size={14} />
                <span className="text-[8px] font-bold uppercase tracking-widest">v4.2</span>
             </div>
            <button 
              onClick={() => navigate(user?.role === 'doctor' ? '/doctor' : '/dashboard')} 
              className="w-9 h-9 flex items-center justify-center hover:bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
              title="Close Assistant"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col bg-[#F8FAFC]">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col px-6">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 bg-teal-50 text-[#14B8A6] rounded-2xl flex items-center justify-center mb-8 shadow-inner"
                >
                  <ClinicalAIIcon size={32} />
                </motion.div>
                <h1 className="text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3 tracking-tight">Clinical Consultation</h1>
                <p className="text-slate-500 text-base max-w-lg mb-12 font-medium">Expert insights on cardiac telemetry and diagnostic protocols.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                  {suggestions.map((s, i) => (
                    <motion.button 
                      key={i} 
                      whileHover={{ y: -2 }}
                      onClick={() => handleSend(null, s.desc)} 
                      className="premium-card bg-white hover:border-[#14B8A6] text-left flex gap-4 items-start p-5 group rounded-2xl shadow-sm"
                    >
                      <div className="w-10 h-10 bg-slate-50 text-[#1A1A1A] rounded-xl flex items-center justify-center group-hover:bg-[#14B8A6] group-hover:text-white transition-all shrink-0 border border-slate-100 group-hover:border-transparent">
                        {React.cloneElement(s.icon, { size: 18, className: 'group-hover:text-white transition-colors' })}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#1A1A1A] mb-0.5 group-hover:text-[#14B8A6] transition-colors">{s.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-70">{s.desc}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 space-y-8 pb-40">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${msg.sender === 'user' ? 'bg-[#1A1A1A] border-white/10 text-white' : 'bg-white border-teal-50 text-[#14B8A6]'}`}>
                        {msg.sender === 'user' ? <User size={18} /> : <ClinicalAIIcon size={18} />}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className={`text-[14px] leading-relaxed group relative ${msg.sender === 'user' ? 'bg-[#1A1A1A] text-white px-6 py-4 rounded-[1.75rem] rounded-tr-none shadow-lg' : 'text-[#1A1A1A] bg-white border border-slate-100 px-6 py-4 rounded-[1.75rem] rounded-tl-none shadow-sm'}`}>
                          {editingId === msg.id ? (
                            <div className="flex flex-col gap-3 min-w-[240px]">
                              <textarea className="w-full bg-white/10 border border-white/20 rounded-xl p-3 outline-none text-sm font-medium text-white" value={editInput} onChange={(e) => setEditInput(e.target.value)} autoFocus rows={2} />
                              <div className="flex justify-end gap-3">
                                <button onClick={handleEditCancel} className="text-[9px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Cancel</button>
                                <button onClick={() => handleEditSubmit(msg.id)} className="text-[9px] font-bold uppercase tracking-widest bg-[#14B8A6] text-[#1A1A1A] px-4 py-1.5 rounded-lg hover:scale-105 transition-all">Re-Sync</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.sender === 'bot' ? (
                                <div className="prose prose-slate prose-p:my-0 prose-headings:my-2 max-w-none text-[14px] leading-relaxed text-[#1A1A1A]">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                </div>
                              ) : (
                                <>
                                  {msg.text}
                                  <button onClick={() => handleEditStart(msg)} className="absolute -left-10 top-4 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-[#14B8A6] transition-all bg-white border border-slate-50 rounded-lg shadow-sm"><Edit2 size={12} /></button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <div className={`text-[8px] font-bold uppercase tracking-widest text-slate-300 px-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                           {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4"
                  >
                    <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-xl text-[#14B8A6] flex items-center justify-center shadow-sm"><ClinicalAIIcon size={18} /></div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-50 rounded-[1.75rem] rounded-tl-none shadow-sm border-dashed">
                      <div className="flex gap-1">
                        <div className="w-1 h-1 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-1 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-1 h-1 bg-[#14B8A6] rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#14B8A6]">Processing informatics...</span>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 md:p-8 bg-[#F8FAFC] border-t border-slate-50">
          <div className="max-w-4xl mx-auto relative">
            {selectedFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="mb-4 p-3 bg-white border border-teal-100 rounded-xl flex items-center gap-4 w-fit pr-12 relative shadow-xl"
              >
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 flex items-center justify-center rounded-xl text-[#14B8A6] shadow-inner"><Image size={20} /></div>
                <div>
                  <div className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest truncate max-w-[200px]">{selectedFile.name}</div>
                  <div className="text-[#14B8A6] font-bold uppercase tracking-[0.2em] text-[8px] mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB • READY</div>
                </div>
                <button onClick={removeFile} className="absolute right-2.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"><X size={16} /></button>
              </motion.div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center gap-3 bg-white border border-slate-100 p-2 pl-6 rounded-[2rem] focus-within:border-[#14B8A6] focus-within:shadow-[0_20px_40px_-10px_rgba(20,184,166,0.1)] transition-all shadow-xl">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf" />
              
              <div className="relative">
                <button type="button" onClick={() => setShowAddMenu(!showAddMenu)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-[#14B8A6] hover:bg-teal-50 rounded-xl transition-all">
                  <Plus size={22} className={showAddMenu ? 'rotate-45' : ''} />
                </button>
                <AnimatePresence>
                  {showAddMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: -12, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-3 bg-white shadow-2xl border border-slate-100 p-2 min-w-[220px] z-50 rounded-2xl overflow-hidden">
                        <button type="button" onClick={() => { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-4 hover:bg-teal-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] transition-all group">
                          <div className="w-8 h-8 bg-slate-50 text-slate-400 group-hover:bg-[#14B8A6] group-hover:text-white rounded-lg flex items-center justify-center transition-all"><Image size={16} /></div> Medical Image
                        </button>
                        <button type="button" onClick={() => { fileInputRef.current.accept = ".pdf,.doc,.docx"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-4 hover:bg-teal-50 rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] transition-all group">
                          <div className="w-8 h-8 bg-slate-50 text-slate-400 group-hover:bg-[#14B8A6] group-hover:text-white rounded-lg flex items-center justify-center transition-all"><FileText size={16} /></div> Diagnostic File
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <textarea className="flex-1 max-h-[160px] min-h-[48px] py-3 bg-transparent outline-none resize-none text-[14px] text-[#1A1A1A] font-medium placeholder:text-slate-200 placeholder:uppercase placeholder:text-[9px] placeholder:tracking-[0.4em] custom-scrollbar" placeholder="INITIALIZE CLINICAL PROMPT..." rows={1} value={input} onChange={(e) => { setInput(e.target.value); e.target.style.height = 'inherit'; e.target.style.height = `${e.target.scrollHeight}px`; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} />
              <div className="flex items-center gap-2 pr-2">
                {isTyping ? (
                  <button type="button" onClick={handleStop} className="w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Square size={16} fill="currentColor" /></button>
                ) : (
                  <button type="submit" disabled={!input.trim() && !selectedFile} className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${input.trim() || selectedFile ? 'bg-[#14B8A6] text-[#1A1A1A] shadow-lg shadow-[#14B8A6]/20 hover:scale-105' : 'bg-slate-50 text-slate-200'}`}>
                    <Send size={20} />
                  </button>
                )}
              </div>
            </form>
            <div className="flex items-center justify-center gap-8 mt-5 opacity-30 group hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} className="text-[#14B8A6]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">Clinical Security Active</span>
              </div>
              <div className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
              <div className="flex items-center gap-2">
                <Activity size={12} className="text-[#14B8A6]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#1A1A1A]">Neural Sync Connected</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIHealthAssistant;
