import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, AlertTriangle, Activity, Database, Search } from 'lucide-react';

const TaskManager = ({ isDemo }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const MOCK_DATA = {
    cpu_usage: 24.5,
    memory_usage: 45.2,
    used_memory: 8589934592,
    total_memory: 17179869184,
    processes: [
      { name: 'system_explorer.exe', pid: 1420, cpu_percent: 1.2, memory_percent: 0.5 },
      { name: 'security_watchdog.bin', pid: 2844, cpu_percent: 0.8, memory_percent: 0.2 },
      { name: 'kernel_scheduler', pid: 4, cpu_percent: 4.5, memory_percent: 1.1 },
      { name: 'browser_engine', pid: 8832, cpu_percent: 12.4, memory_percent: 3.4 },
      { name: 'mal_payload_x64.msi', pid: 9912, cpu_percent: 25.2, memory_percent: 8.9 }
    ]
  };

  const fetchMetrics = async () => {
    if (isDemo) {
      setData(MOCK_DATA);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/taskmgr');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Backend failed to execute command');
      }
      setData(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const filteredProcesses = data?.processes.filter(proc => 
    proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proc.pid.toString().includes(searchTerm)
  ) || [];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500/20 rounded-full"></div>
          <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        </div>
        <div className="text-center">
          <p className="text-blue-400 text-xl font-black tracking-tighter animate-pulse">SYNCHRONIZING KERNEL METRICS</p>
          <p className="text-blue-500/50 text-xs font-mono mt-2">Connecting to SecurityServer node...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card border-red-500/30 bg-red-950/20 p-8 rounded-2xl flex flex-col items-center text-center shadow-2xl">
        <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-red-200 mb-2">Interface Connection Error</h3>
        <p className="text-red-400/80 text-sm max-w-md">
          {error}. Please ensure the Java SecurityServer is active on port 8080 and Python dependencies are installed.
        </p>
        <button 
          onClick={fetchMetrics}
          className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors font-bold text-sm"
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CPU Usage Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-10 -mt-10 group-hover:bg-blue-600/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Processor Load</p>
              <h3 className="text-2xl font-black text-slate-100 flex items-center">
                <Cpu className="w-6 h-6 mr-3 text-blue-500" /> CPU Utility
              </h3>
            </div>
            <span className="text-4xl font-black text-blue-400 text-glow-blue">{data.cpu_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              style={{ width: `${data.cpu_usage}%` }}
            ></div>
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-mono text-blue-400/50">
            <span>CORE_ID_0: { (data.cpu_usage * 0.8).toFixed(1)}%</span>
            <span>CORE_ID_1: { (data.cpu_usage * 1.2).toFixed(1)}%</span>
          </div>
        </div>

        {/* Memory Usage Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 blur-3xl -mr-10 -mt-10 group-hover:bg-blue-400/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Memory Matrix</p>
              <h3 className="text-2xl font-black text-slate-100 flex items-center">
                <Database className="w-6 h-6 mr-3 text-blue-400" /> RAM Access
              </h3>
            </div>
            <span className="text-4xl font-black text-blue-300 text-glow-blue">{data.memory_usage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(56,189,248,0.4)]"
              style={{ width: `${data.memory_usage}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-mono text-blue-400/50 uppercase tracking-widest">
              {(data.used_memory / (1024 ** 3)).toFixed(2)} GB OF {(data.total_memory / (1024 ** 3)).toFixed(2)} GB
            </p>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-1 h-3 rounded-full ${i <= (data.memory_usage / 20) ? 'bg-blue-400' : 'bg-slate-800'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Processes Table */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl border border-blue-500/10">
        <div className="px-10 py-8 border-b border-blue-500/10 bg-slate-900/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-black text-slate-100 flex items-center tracking-tight">
              <Activity className="w-6 h-6 mr-3 text-blue-500" /> ACTIVE_PROCESS_THREADING
            </h2>
            <p className="text-xs text-blue-400/60 font-mono mt-1 uppercase">Filtering top process execution threads</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50" />
            <input 
              type="text" 
              placeholder="Filter processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-blue-500/20 rounded-xl pl-11 pr-6 py-2.5 text-sm text-blue-100 placeholder-blue-500/30 focus:border-blue-500/50 outline-none transition-all w-full md:w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 text-[10px] text-blue-500/70 uppercase tracking-[0.2em] font-black">
                <th className="px-10 py-6">THREAD_ID</th>
                <th className="px-10 py-6">RESOURCE_NAME</th>
                <th className="px-10 py-6 text-right">CPU_LOAD</th>
                <th className="px-10 py-6 text-right">MEM_SHARE</th>
                <th className="px-10 py-6 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-500/5">
              {filteredProcesses.map((proc, idx) => (
                <tr key={idx} className="hover:bg-blue-600/5 transition-colors group">
                  <td className="px-10 py-5 text-blue-400/80 font-mono text-xs">{proc.pid}</td>
                  <td className="px-10 py-5">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                      <span className="text-slate-100 font-bold tracking-tight">{proc.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-5 text-blue-400 text-right font-mono font-bold">{proc.cpu_percent.toFixed(1)}%</td>
                  <td className="px-10 py-5 text-blue-300 text-right font-mono font-bold">{proc.memory_percent.toFixed(1)}%</td>
                  <td className="px-10 py-5 text-center">
                    <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-tighter border border-blue-500/20 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      RUNNING
                    </span>
                  </td>
                </tr>
              ))}
              {filteredProcesses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-10 py-20 text-center text-blue-500/40 font-mono uppercase text-sm">
                    No matching processes found in the kernel thread pool
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-10 py-4 bg-slate-950/50 border-t border-blue-500/10 flex justify-between items-center">
          <p className="text-[9px] text-blue-500/40 font-mono uppercase">Kernel Version: 5.15.0-generic</p>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[9px] text-blue-500/60 font-mono">NODE_STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;

