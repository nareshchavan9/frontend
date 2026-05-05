import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, HeartPulse, Paperclip, X, FileText, Loader2, Plus, MessageSquare, Trash2, Layout, Share2, MoreHorizontal, Activity, Maximize2, Minimize2, Settings, Square, Minus, Mic, Image, Edit2, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    { title: "ECG Analysis", desc: "Interpret my recent heart report", icon: <Activity className="text-[#111111]" /> },
    { title: "Wellness Plan", desc: "Suggest a heart-healthy diet", icon: <HeartPulse className="text-[#111111]" /> },
    { title: "Risk Factors", desc: "Signs of potential arrhythmia", icon: <Bot className="text-[#111111]" /> },
    { title: "Clinical FAQ", desc: "Common diagnostic questions", icon: <FileText className="text-[#111111]" /> },
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
    if (window.confirm("Delete this conversation?")) {
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
        text: "Sorry, I encountered an error. Please try again later.",
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
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden text-[#111111]">
      <AnimatePresence>
        {!showSidebar && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => setShowSidebar(true)}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[60] w-10 h-10 bg-white border border-[#E5E7EB] rounded-xl flex items-center justify-center text-[#111111] shadow-2xl hover:bg-[#111111] hover:text-white transition-all"
            title="Show Archive"
          >
            <MessageSquare size={18} />
          </motion.button>
        )}
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#111111] text-white flex flex-col shrink-0 h-full relative z-50 shadow-2xl"
          >
            <div className="p-8 flex flex-col h-full">
              {/* Vertical Toggle Handle */}
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-12 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-all shadow-xl z-[70] group"
                title="Hide Archive"
              >
                <ChevronLeft size={14} className="group-hover:scale-125 transition-transform" />
              </button>
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white text-[#111111] rounded-lg flex items-center justify-center">
                    <HeartPulse size={20} />
                  </div>
                  <span className="font-bold text-lg tracking-tight">Clinical AI</span>
                </div>
              </div>

              <button 
                onClick={handleNewChat}
                className="flex items-center justify-center gap-3 w-full p-4 bg-white text-[#111111] hover:bg-[#F9FAFB] transition-all shadow-lg active:scale-95 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 rounded-xl"
              >
                <Plus size={16} /> New Consultation
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] px-3 mb-6">Chat Archive</div>
                {conversations.length === 0 ? (
                  <div className="px-3 py-4 text-[10px] text-white/20 font-bold uppercase tracking-widest italic">No prior sessions</div>
                ) : (
                  conversations.map((conv) => (
                    <button 
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`flex items-center gap-3 w-full p-3 transition-colors text-left group relative rounded-xl ${currentConversationId === conv._id ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/60 hover:bg-white/5'}`}
                    >
                      <MessageSquare size={14} className={currentConversationId === conv._id ? 'text-white' : 'text-white/20'} />
                      <span className="truncate flex-1 text-[11px] font-bold uppercase tracking-widest">{conv.title}</span>
                      <button 
                        onClick={(e) => deleteConversation(e, conv._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 size={12} />
                      </button>
                    </button>
                  ))
                )}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
                  <div className="w-9 h-9 bg-white text-[#111111] rounded-lg flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">{user?.name}</div>
                    <div className="text-[8px] text-white/20 uppercase tracking-widest">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full relative bg-[#F5F5F5]">
        <header className="h-20 flex items-center justify-between px-10 bg-[#F5F5F5] border-b border-[#E5E7EB] sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#111111] tracking-tight">Clinical Assistant</span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-[9px] font-bold text-green-600 border border-green-100">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(user?.role === 'doctor' ? '/doctor' : '/dashboard')} 
              className="p-2.5 hover:bg-white text-[#111111] border border-transparent hover:border-[#E5E7EB] rounded-xl transition-all"
              title="Close Assistant"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-10 text-center pb-40">
                <h1 className="text-4xl font-bold text-[#111111] mb-4 tracking-tight">How can I assist?</h1>
                <p className="text-[#6B7280] text-base max-w-md mb-12 font-medium">Consult with our clinical agent for expert insights on cardiac wellness and diagnostic informatics.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSend(null, s.desc)} className="p-6 bg-white border border-[#E5E7EB] hover:border-[#111111] rounded-2xl transition-all text-left flex gap-5 items-start group shadow-sm">
                      <div className="w-10 h-10 bg-[#F9FAFB] text-[#111111] rounded-xl flex items-center justify-center group-hover:bg-[#111111] group-hover:text-white transition-all shrink-0">
                        {React.cloneElement(s.icon, { size: 20 })}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111111] mb-1">{s.title}</div>
                        <div className="text-[10px] text-[#6B7280] font-medium leading-relaxed">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-10 space-y-8 pb-40">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-[#E5E7EB] ${msg.sender === 'user' ? 'bg-[#111111] text-white' : 'bg-white text-[#111111]'}`}>
                        {msg.sender === 'user' ? <User size={18} /> : <Bot size={18} />}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className={`text-sm leading-relaxed group relative ${msg.sender === 'user' ? 'bg-white border border-[#E5E7EB] px-6 py-4 rounded-2xl rounded-tr-none text-[#111111] font-medium shadow-sm' : 'text-[#111111] bg-white border border-[#E5E7EB] px-6 py-4 rounded-2xl rounded-tl-none shadow-sm'}`}>
                          {editingId === msg.id ? (
                            <div className="flex flex-col gap-3 min-w-[240px]">
                              <textarea className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-3 outline-none text-sm font-medium" value={editInput} onChange={(e) => setEditInput(e.target.value)} autoFocus rows={2} />
                              <div className="flex justify-end gap-3">
                                <button onClick={handleEditCancel} className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Cancel</button>
                                <button onClick={() => handleEditSubmit(msg.id)} className="text-[10px] font-bold uppercase tracking-widest bg-[#111111] text-white px-4 py-1.5 rounded-lg">Resend</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.sender === 'bot' ? (
                                <div className="prose prose-slate prose-p:my-0 prose-headings:my-2 max-w-none text-sm leading-relaxed">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                </div>
                              ) : (
                                <>
                                  {msg.text}
                                  <button onClick={() => handleEditStart(msg)} className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-[#6B7280] hover:text-[#111111] transition-all"><Edit2 size={14} /></button>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-4">
                    <div className="w-9 h-9 bg-white border border-[#E5E7EB] rounded-xl text-[#111111] flex items-center justify-center shadow-sm"><Bot size={18} /></div>
                    <div className="flex items-center gap-3 px-6 py-3 bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-none shadow-sm"><Loader2 size={16} className="animate-spin text-[#111111]" /><span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Processing Inquiry...</span></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="p-8 bg-[#F5F5F5] border-t border-[#E5E7EB]">
          <div className="max-w-4xl mx-auto relative">
            {selectedFile && (
              <div className="mb-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl flex items-center gap-4 w-fit pr-12 relative shadow-lg">
                <div className="w-10 h-10 bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center rounded-xl text-[#111111]"><Image size={20} /></div>
                <div className="text-[10px]">
                  <div className="font-bold text-[#111111] uppercase tracking-widest truncate max-w-[200px]">{selectedFile.name}</div>
                  <div className="text-[#6B7280] font-bold uppercase tracking-widest mt-0.5">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button onClick={removeFile} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-[#F3F4F6] text-[#6B7280] rounded-lg"><X size={14} /></button>
              </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center gap-4 bg-white border border-[#E5E7EB] p-2 pl-6 rounded-[1.5rem] focus-within:border-[#111111] focus-within:shadow-2xl transition-all">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf" />
              
              <div className="relative">
                <button type="button" onClick={() => setShowAddMenu(!showAddMenu)} className="p-3 text-[#6B7280] hover:text-[#111111] transition-all"><Plus size={24} className={showAddMenu ? 'rotate-45' : ''} /></button>
                <AnimatePresence>
                  {showAddMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: -10, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-4 bg-white shadow-2xl border border-[#E5E7EB] p-2 min-w-[220px] z-50 rounded-[1.25rem] overflow-hidden">
                        <button type="button" onClick={() => { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-4 hover:bg-[#F9FAFB] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#111111] transition-colors">
                          <div className="text-[#111111]"><Image size={18} /></div> Attach Medical Image
                        </button>
                        <button type="button" onClick={() => { fileInputRef.current.accept = ".pdf,.doc,.docx"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-4 hover:bg-[#F9FAFB] rounded-xl text-[10px] font-bold uppercase tracking-widest text-[#111111] transition-colors">
                          <div className="text-[#111111]"><FileText size={18} /></div> Attach Diagnostic File
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <textarea className="flex-1 max-h-[200px] min-h-[56px] py-4 bg-transparent outline-none resize-none text-sm text-[#111111] font-medium placeholder:text-[#E5E7EB] placeholder:uppercase placeholder:text-[10px] placeholder:tracking-[0.2em]" placeholder="INITIALIZE PROMPT..." rows={1} value={input} onChange={(e) => { setInput(e.target.value); e.target.style.height = 'inherit'; e.target.style.height = `${e.target.scrollHeight}px`; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} />
              <div className="flex items-center gap-2 pr-2">
                {isTyping ? (
                  <button type="button" onClick={handleStop} className="p-4 text-red-500 border-l border-[#E5E7EB]"><Square size={18} fill="currentColor" /></button>
                ) : (
                  <button type="submit" disabled={!input.trim() && !selectedFile} className={`p-4 transition-all ${input.trim() || selectedFile ? 'text-[#111111]' : 'text-[#E5E7EB]'}`}><Send size={22} /></button>
                )}
              </div>
            </form>
            <div className="flex items-center justify-center gap-6 mt-4 opacity-30">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">Verified Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity size={12} />
                <span className="text-[8px] font-bold uppercase tracking-[0.2em]">AI Sync Active</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIHealthAssistant;
