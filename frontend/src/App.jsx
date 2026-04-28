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
        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-slate-900/40 p-6 rounded-3xl border border-blue-500/10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-full bg-blue-600/5 -skew-x-12 translate-x-32 group-hover:translate-x-20 transition-transform duration-1000"></div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase flex items-center">
              {activeTab === 'taskmgr' ? 'Kernel Processes' : activeTab === 'scanner' ? 'Security Audit' : 'Security Sandbox'}
              {demoMode && <span className="ml-3 px-2 py-0.5 bg-blue-600/20 text-blue-400 text-[8px] border border-blue-500/30 rounded-full animate-pulse">SIMULATION_MODE</span>}
            </h1>
            <p className="text-blue-500/50 text-[10px] font-mono uppercase tracking-[0.3em] mt-1">Real-time system monitoring and defensive analysis</p>
          </div>
          <div className="flex items-center space-x-4 relative z-10">
            <div className="hidden md:flex space-x-3">
              <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-blue-500/10 flex items-center">
                <Cpu className="w-3.5 h-3.5 text-blue-500 mr-2" />
                <span className="text-[10px] font-black uppercase text-blue-100">CPU: {demoMode ? '12.4%' : 'LIVE'}</span>
              </div>
              <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-blue-500/10 flex items-center">
                <Shield className="w-3.5 h-3.5 text-blue-500 mr-2" />
                <span className="text-[10px] font-black uppercase text-blue-100">FIREWALL: ON</span>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${backendStatus === 'online' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-blue-900 animate-pulse'}`}></div>
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
                  <p>1. Open your terminal in the project root.</p>
                  <p>2. Run: <span className="text-blue-400">pip install psutil</span> (Required for Metrics)</p>
                  <p>3. Run: <span className="text-blue-400">javac SecurityServer.java; java SecurityServer</span></p>
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

