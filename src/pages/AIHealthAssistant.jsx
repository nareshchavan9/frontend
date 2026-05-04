import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ArrowLeft, HeartPulse, Paperclip, X, FileText, Loader2, Plus, MessageSquare, Trash2, Layout, Share2, MoreHorizontal, Activity, Maximize2, Minimize2, Settings, Square, Minus, Mic, Image, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    { title: "Analyze ECG", desc: "What does my latest ECG report indicate?", icon: <Activity className="text-rose-500" /> },
    { title: "Heart Diet", desc: "Suggest a heart-healthy meal plan for this week.", icon: <HeartPulse className="text-emerald-500" /> },
    { title: "Risk Factors", desc: "What are the early signs of arrhythmia?", icon: <Bot className="text-blue-500" /> },
    { title: "Medication Info", desc: "Tell me about common blood pressure medications.", icon: <FileText className="text-amber-500" /> },
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
    <div className="flex h-screen bg-white overflow-hidden text-slate-800">
      <AnimatePresence mode="wait">
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-[#111827] text-white flex flex-col shrink-0 h-full relative z-50 shadow-2xl"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 font-bold text-blue-500">
                  <HeartPulse size={24} />
                  <span>Health AI Assistant</span>
                </div>
              </div>

              <button 
                onClick={handleNewChat}
                className="flex items-center gap-3 w-full p-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl transition-all shadow-lg active:scale-95 text-sm font-bold mb-6"
              >
                <Plus size={18} /> New Chat
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2 mt-4">Recent Chats</div>
                {conversations.length === 0 ? (
                  <div className="px-3 py-4 text-xs text-slate-500 italic">No recent chats</div>
                ) : (
                  conversations.map((conv) => (
                    <button 
                      key={conv._id}
                      onClick={() => loadConversation(conv._id)}
                      className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-colors text-left group relative ${currentConversationId === conv._id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                    >
                      <MessageSquare size={14} className={currentConversationId === conv._id ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'} />
                      <span className="truncate flex-1 text-sm">{conv.title}</span>
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

              <div className="mt-auto border-t border-white/10 pt-4">
                <div className="p-3 bg-white/5 rounded-2xl flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{user?.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{user?.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col h-full relative bg-white">
        <header className="h-16 flex items-center justify-between px-6 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 ml-10 lg:ml-0">
              <span className="font-bold text-slate-900 truncate max-w-[200px]">
                Health AI Assistant
              </span>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-[10px] font-bold text-green-600 border border-green-100">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleNewChat}
              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors lg:hidden"
              title="New Chat"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="p-2 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white flex flex-col">
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
            {messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pb-40">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                  <HeartPulse className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h1 className="text-4xl font-bold text-slate-800 mb-4">How can I help you today?</h1>
                <p className="text-slate-500 text-lg max-w-lg mb-12">Ask me anything about your heart health, ECG reports, or daily wellness.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl px-4">
                  {suggestions.map((s, i) => (
                    <button key={i} onClick={() => handleSend(null, s.desc)} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all text-left flex gap-4 items-start group">
                      <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors shrink-0">{s.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 mb-0.5">{s.title}</div>
                        <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-6 pb-40">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-4 max-w-[90%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-[#111827] text-white' : 'bg-blue-600 text-white'}`}>
                        {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className={`text-[15px] leading-snug group relative ${msg.sender === 'user' ? 'bg-slate-100 px-4 py-2.5 rounded-2xl text-slate-700' : 'text-slate-800'}`}>
                          {editingId === msg.id ? (
                            <div className="flex flex-col gap-2 min-w-[200px]">
                              <textarea className="w-full bg-white border border-blue-200 rounded-xl p-2 outline-none" value={editInput} onChange={(e) => setEditInput(e.target.value)} autoFocus rows={2} />
                              <div className="flex justify-end gap-2">
                                <button onClick={handleEditCancel} className="text-xs font-bold text-slate-400">Cancel</button>
                                <button onClick={() => handleEditSubmit(msg.id)} className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-lg">Resend</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.sender === 'bot' ? (
                                <div className="prose prose-slate prose-p:my-0 prose-headings:my-2 max-w-none">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                </div>
                              ) : (
                                <>
                                  {msg.text}
                                  <button onClick={() => handleEditStart(msg)} className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-blue-500 transition-all"><Edit2 size={14} /></button>
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
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm"><Bot size={16} /></div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl"><Loader2 size={16} className="animate-spin text-blue-600" /><span className="text-xs font-medium text-slate-500">Thinking...</span></div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white">
          <div className="max-w-4xl mx-auto relative">
            {selectedFile && (
              <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 w-fit pr-10 relative">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm"><Image size={20} className="text-blue-600" /></div>
                <div className="text-xs">
                  <div className="font-bold text-slate-700 truncate max-w-[150px]">{selectedFile.name}</div>
                  <div className="text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button onClick={removeFile} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full text-slate-400"><X size={14} /></button>
              </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center gap-3 bg-[#f0f4f9] rounded-[32px] p-2 pl-4 shadow-sm focus-within:bg-white focus-within:border-blue-100 focus-within:shadow-lg border border-transparent transition-all">
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf" />
              
              <div className="relative">
                <button type="button" onClick={() => setShowAddMenu(!showAddMenu)} className="p-2.5 rounded-full text-slate-600 hover:bg-white transition-all"><Plus size={22} className={showAddMenu ? 'rotate-45' : ''} /></button>
                <AnimatePresence>
                  {showAddMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                      <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: -10, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 min-w-[160px] z-50 overflow-hidden">
                        <button type="button" onClick={() => { fileInputRef.current.accept = "image/*"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-3 hover:bg-blue-50 rounded-xl text-sm text-slate-700 transition-colors">
                          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Image size={16} /></div> Upload Image
                        </button>
                        <button type="button" onClick={() => { fileInputRef.current.accept = ".pdf,.doc,.docx"; fileInputRef.current.click(); setShowAddMenu(false); }} className="flex items-center gap-3 w-full p-3 hover:bg-purple-50 rounded-xl text-sm text-slate-700 transition-colors">
                          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><FileText size={16} /></div> Document
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <textarea className="flex-1 max-h-[200px] min-h-[48px] py-4 bg-transparent outline-none resize-none text-[16px] text-slate-800" placeholder="Enter a prompt here..." rows={1} value={input} onChange={(e) => { setInput(e.target.value); e.target.style.height = 'inherit'; e.target.style.height = `${e.target.scrollHeight}px`; }} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }} />
              <div className="flex items-center gap-1 pr-2">
                {isTyping ? (
                  <button type="button" onClick={handleStop} className="p-2.5 rounded-full text-rose-500 hover:bg-rose-50 transition-all border border-rose-100"><Square size={18} fill="currentColor" /></button>
                ) : (
                  <button type="submit" disabled={!input.trim() && !selectedFile} className={`p-2.5 rounded-full transition-all ${input.trim() || selectedFile ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-300 cursor-not-allowed'}`}><Send size={22} /></button>
                )}
              </div>
            </form>
            <p className="text-[11px] text-center text-slate-500 mt-4 font-medium">Heart AI may display inaccurate info, so double-check its responses.</p>
          </div>
        </div>
      </main>

      {/* Centered Edge Toggle Button */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className={`fixed top-1/2 -translate-y-1/2 z-[60] p-1 bg-white border border-slate-200 rounded-full shadow-lg hover:bg-blue-50 hover:border-blue-200 transition-all group ${showSidebar ? 'left-[268px]' : 'left-2'}`}
        title={showSidebar ? "Hide Chat History" : "Show Chat History"}
      >
        <div className="flex items-center justify-center w-5 h-8">
          {showSidebar ? (
            <ChevronLeft size={16} className="text-slate-400 group-hover:text-blue-600" />
          ) : (
            <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
          )}
        </div>
      </button>
    </div>
  );
};

export default AIHealthAssistant;
