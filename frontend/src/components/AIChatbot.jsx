import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, X, MessageSquare, Shield, Cpu, Activity } from 'lucide-react';

const OS_KNOWLEDGE_BASE = [
  {
    keywords: ['hello', 'hi', 'who are you', 'help'],
    response: "Hello! I am your OS Intelligence Assistant. I can help you understand how Operating Systems work, explain system processes, or guide you through security vulnerabilities. How can I assist you today?"
  },
  {
    keywords: ['process', 'task', 'running'],
    response: "A process is an instance of a computer program that is being executed. It contains the program code and its current activity. In this dashboard, the Task Manager tab shows real-time processes running on your host system, including their PID and memory usage."
  },
  {
    keywords: ['deadlock'],
    response: "A deadlock is a situation where two or more processes are unable to proceed because each is waiting for the other to release a resource. To prevent deadlocks, OS designers use techniques like resource ordering, deadlock detection, and the Banker's algorithm."
  },
  {
    keywords: ['memory', 'ram', 'virtual memory'],
    response: "Memory management is a core OS function. Virtual memory allows a computer to compensate for physical memory shortages by temporarily transferring data from RAM to disk storage. It uses paging or segmentation to manage addresses."
  },
  {
    keywords: ['vulnerability', 'exploit', 'security'],
    response: "Security vulnerabilities are weaknesses that can be exploited by attackers. Common examples include Buffer Overflows, where data exceeds memory boundaries, and Privilege Escalation, where a user gains unauthorized high-level access. Check the 'Vuln Scanner' or 'Vuln Demos' tabs to see these in action."
  },
  {
    keywords: ['buffer overflow'],
    response: "A buffer overflow occurs when a program writes more data to a block of memory (buffer) than it can hold. This can overwrite adjacent memory, potentially allowing an attacker to execute malicious code by hijacking the program's control flow."
  },
  {
    keywords: ['scheduling', 'cpu'],
    response: "CPU scheduling determines which process in the ready queue is allocated the CPU. Common algorithms include First-Come-First-Served (FCFS), Round Robin (RR), and Priority Scheduling. Efficient scheduling is crucial for system performance."
  },
  {
    keywords: ['kernel'],
    response: "The kernel is the core of the OS. It manages system resources and communication between hardware and software. It handles memory, process management, and device drivers."
  }
];

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome, System Administrator. I am your OS Intelligence Assistant. How can I help you explore the system today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let response = "I'm specialized in Operating Systems and Security. I couldn't find a specific answer for that, but I can tell you about Processes, Memory, CPU Scheduling, or Security Vulnerabilities. Try asking about one of those!";

      for (const item of OS_KNOWLEDGE_BASE) {
        if (item.keywords.some(keyword => lowerInput.includes(keyword))) {
          response = item.response;
          break;
        }
      }

      setMessages(prev => [...prev, { role: 'bot', content: response }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 z-50 animate-bounce hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-h-[500px] h-[500px] flex flex-col glass-card rounded-2xl z-50 animate-fade-in-up overflow-hidden border border-blue-500/30">
          {/* Header */}
          <div className="p-4 bg-blue-600/20 border-b border-blue-500/30 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-blue-100 text-sm">OS Intel Assistant</h3>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-blue-400/80 font-mono">SYSTEM_ONLINE</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[80%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-blue-700/50' : 'bg-slate-800 border border-blue-500/20'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-blue-200" /> : <Shield className="w-4 h-4 text-blue-400" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg' 
                      : 'bg-slate-800/80 text-blue-100 border border-blue-500/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/80 border border-blue-500/10 p-3 rounded-2xl rounded-tl-none flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-blue-500/20 bg-slate-900/50">
            <div className="flex items-center space-x-2 bg-slate-800 border border-blue-500/30 rounded-xl px-3 py-1 focus-within:border-blue-400 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about processes, security..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-blue-100 placeholder-blue-400/50 py-2"
              />
              <button
                onClick={handleSend}
                className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[9px] text-center mt-2 text-blue-400/40 uppercase tracking-widest font-mono">
              Intelligence Node Delta-9
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
