import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldAlert, BookOpen, Terminal, Activity, Cpu, Shield, AlertTriangle } from 'lucide-react';

import TaskManager from './components/TaskManager';
import SecurityDemos from './components/SecurityDemos';
import Scanner from './components/Scanner';
import AIChatbot from './components/AIChatbot';

function App() {
  const [activeTab, setActiveTab] = useState('taskmgr');
  const [demoMode, setDemoMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState('checking'); // checking, online, offline

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/taskmgr');
        if (res.ok) {
          setBackendStatus('online');
          setDemoMode(false);
        } else {
          setBackendStatus('offline');
        }
      } catch (err) {
        setBackendStatus('offline');
      }
    };
    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

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
      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 p-10">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-slate-900/40 p-8 rounded-[32px] border border-blue-500/10 backdrop-blur-2xl relative overflow-hidden group gap-6">
          <div className="absolute top-0 right-0 w-96 h-full bg-blue-600/5 -skew-x-12 translate-x-48 group-hover:translate-x-32 transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Node_Alpha_Terminal</span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase flex items-center text-white">
              {activeTab === 'taskmgr' ? 'Kernel Processes' : activeTab === 'scanner' ? 'Security Audit' : 'Security Sandbox'}
              {demoMode && <span className="ml-4 px-3 py-1 bg-blue-600/20 text-blue-400 text-[9px] border border-blue-500/30 rounded-full animate-pulse font-black tracking-widest">SIM_ACTIVE</span>}
            </h1>
            <div className="flex items-center mt-2 space-x-4">
              <p className="text-blue-500/40 text-[9px] font-mono uppercase tracking-[0.2em]">S_ID: {Math.random().toString(36).substring(7).toUpperCase()}</p>
              <div className="h-1 w-1 bg-blue-900 rounded-full"></div>
              <p className="text-blue-500/40 text-[9px] font-mono uppercase tracking-[0.2em]">Lat: 14ms</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 relative z-10 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none grid grid-cols-2 md:flex md:space-x-4 gap-3">
              <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-blue-500/10 flex items-center group/item hover:border-blue-500/40 transition-all">
                <Cpu className="w-4 h-4 text-blue-500 mr-3 animate-pulse" />
                <div>
                  <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest">Load</p>
                  <span className="text-[11px] font-black uppercase text-blue-50">{(Math.random() * 15 + 5).toFixed(1)}%</span>
                </div>
              </div>
              <div className="bg-slate-950/80 px-5 py-3 rounded-2xl border border-blue-500/10 flex items-center group/item hover:border-blue-500/40 transition-all">
                <Shield className="w-4 h-4 text-blue-500 mr-3" />
                <div>
                  <p className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest">Threat</p>
                  <span className="text-[11px] font-black uppercase text-green-500">LOW</span>
                </div>
              </div>
            </div>
            <div className={`w-4 h-12 rounded-xl flex items-center justify-center ${backendStatus === 'online' ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-slate-800 animate-pulse'}`}>
              <Activity className="w-4 h-4 text-white" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {!demoMode && backendStatus === 'offline' ? (
            <div className="h-full flex flex-col items-center justify-center p-12 glass-card rounded-[40px] border-blue-500/20">
              <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.15)]">
                <AlertTriangle className="w-12 h-12 text-blue-500 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-slate-100 tracking-tighter uppercase mb-4 text-center">Interface Connection Error</h2>
              <p className="text-blue-400/60 text-sm font-medium max-w-md text-center mb-10 leading-relaxed uppercase">
                The local Security Engine is not reachable. Ensure the <code className="text-blue-300 font-bold px-2 py-0.5 bg-blue-900/30 rounded">java SecurityServer</code> agent is active on port 8080 to fetch live system telemetry.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black tracking-tighter uppercase transition-all shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
                >
                  Retry Connection
                </button>
                <button 
                  onClick={() => setDemoMode(true)}
                  className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-black tracking-tighter uppercase transition-all border border-blue-500/10 active:scale-95"
                >
                  Enter Simulation Mode
                </button>
                <a 
                  href="https://github.com/R-arjun9/SYSTEM-VULRENABILITIES-/tree/main/agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 rounded-2xl font-black tracking-tighter uppercase transition-all border border-blue-500/20 active:scale-95 flex items-center justify-center"
                >
                  Download Agent
                </a>
              </div>
              <div className="mt-12 p-6 bg-slate-950/80 rounded-2xl border border-blue-500/5 max-w-lg w-full">
                <p className="text-[10px] text-blue-500 font-black uppercase mb-3 tracking-widest">How to fix this:</p>
                <div className="font-mono text-[11px] text-blue-300/70 space-y-1">
                  <p>1. Click <span className="text-blue-400">Download Agent</span> and unzip the files.</p>
                  <p>2. Right-click <span className="text-blue-400">run.bat</span> and select "Run as Administrator".</p>
                  <p>3. This UI will automatically sync with your laptop.</p>
                  <p className="pt-4 text-red-400 font-black tracking-widest uppercase">⚠️ Browser Security Alert:</p>
                  <p>If using the Live Link, Chrome may block "Insecure Content" (Localhost).</p>
                  <p>Go to <span className="text-blue-400">Site Settings</span> and set <span className="text-blue-400">Insecure Content</span> to <span className="text-blue-400">Allow</span>.</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'taskmgr' && <TaskManager isDemo={demoMode} />}
              {activeTab === 'scanner' && <Scanner isDemo={demoMode} />}
              {activeTab === 'demos' && <SecurityDemos isDemo={demoMode} />}
            </>
          )}
        </main>
      </main>

      <AIChatbot />
    </div>
  );
}

export default App;

