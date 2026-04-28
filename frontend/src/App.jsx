import React, { useState } from 'react';
import { LayoutDashboard, ShieldAlert, BookOpen, Terminal, Activity, Cpu, ShieldCheck } from 'lucide-react';

import TaskManager from './components/TaskManager';
import SecurityDemos from './components/SecurityDemos';
import Scanner from './components/Scanner';
import AIChatbot from './components/AIChatbot';

function App() {
  const [activeTab, setActiveTab] = useState('taskmgr');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-900/50 backdrop-blur-xl border-r border-blue-500/10 shadow-2xl flex-shrink-0 z-20 flex flex-col">
        <div className="p-8 flex items-center space-x-4 border-b border-blue-500/10">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-blue-50">
              CORE<span className="text-blue-500">OS</span>
            </h1>
            <p className="text-[10px] text-blue-400/60 font-mono uppercase tracking-widest">Security Hub v4.0</p>
          </div>
        </div>

        <nav className="p-6 flex-1 space-y-3">
          <div className="text-[10px] text-blue-500/50 font-bold uppercase tracking-[0.2em] mb-4 px-4">Management</div>
          <button
            onClick={() => setActiveTab('taskmgr')}
            className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'taskmgr'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'
              }`}
          >
            <LayoutDashboard className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${activeTab === 'taskmgr' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span className="font-semibold tracking-tight">Process Manager</span>
          </button>

          <div className="text-[10px] text-blue-500/50 font-bold uppercase tracking-[0.2em] mt-8 mb-4 px-4">Security</div>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'scanner'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'
              }`}
          >
            <ShieldAlert className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${activeTab === 'scanner' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span className="font-semibold tracking-tight">Vulnerability Audit</span>
          </button>
          
          <button
            onClick={() => setActiveTab('demos')}
            className={`w-full flex items-center px-5 py-4 rounded-2xl transition-all duration-300 group ${activeTab === 'demos'
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300 border border-transparent'
              }`}
          >
            <BookOpen className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${activeTab === 'demos' ? 'text-blue-400' : 'text-slate-500'}`} />
            <span className="font-semibold tracking-tight">Security Sandbox</span>
          </button>
        </nav>

        <div className="p-6 border-t border-blue-500/10">
          <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/10">
            <div className="flex items-center space-x-3 mb-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-blue-200">System Status</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-blue-400/60 font-mono">
              <span>UPTIME: 14D 2H</span>
              <span className="text-green-500">OPERATIONAL</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
        <header className="bg-slate-950/50 backdrop-blur-xl border-b border-blue-500/10 sticky top-0 z-10 px-10 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight capitalize">
              {activeTab === 'taskmgr' ? 'Kernel Processes' : activeTab === 'scanner' ? 'Security Intelligence' : 'Vulnerability Simulation'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">Real-time system monitoring and defensive analysis</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden lg:flex items-center space-x-4 px-4 py-2 rounded-xl bg-slate-900/50 border border-blue-500/10">
              <div className="flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-mono text-blue-200">CPU: 12.4%</span>
              </div>
              <div className="w-[1px] h-4 bg-blue-500/20"></div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                <span className="text-xs font-mono text-blue-200">FIREWALL: ON</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto min-h-[calc(100vh-88px)]">
          <div className="animate-fade-in-up">
            {activeTab === 'taskmgr' && <TaskManager />}
            {activeTab === 'scanner' && <Scanner />}
            {activeTab === 'demos' && <SecurityDemos />}
          </div>
        </div>
      </main>

      <AIChatbot />
    </div>
  );
}

export default App;

