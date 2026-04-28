import React, { useState, useEffect, useRef } from 'react';
import { Activity, ShieldAlert, ShieldCheck, Cpu, Database, PlayCircle, Clock, History, Fingerprint, Search, Zap, Terminal, Shield, AlertTriangle } from 'lucide-react';

const SCAN_STEPS = [
  "INITIALIZING_CORE_SCAN_ENGINE",
  "MAPPING_SYSTEM_REGISTRY_HIVES",
  "ANALYZING_DEP_SUPPORT_POLICIES",
  "QUERYING_UAC_PROMPT_SECURITY",
  "VERIFYING_WINDOWS_DEFENDER_CORE",
  "SCANNING_TEMP_DIRECTORIES_FOR_PAYLOADS",
  "CHECKING_RDP_TERMINAL_CONFIG",
  "AUDITING_FIREWALL_PROFILES",
  "SYNCHRONIZING_THREAT_VECTORS",
  "CALCULATING_SYSTEM_HEALTH_INDEX"
];

const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [scanLogs, setScanLogs] = useState([]);
  const logEndRef = useRef(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('scanHistory') || '[]');
    setScanHistory(history);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scanLogs]);

  const saveToHistory = (result) => {
    setScanHistory(prevHistory => {
      const newEntry = {
        timestamp: new Date().toISOString(),
        score: result.health_score,
        vulnerabilities: result.vulnerabilities.length
      };
      const updatedHistory = [newEntry, ...prevHistory].slice(0, 5);
      localStorage.setItem('scanHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    });
  };

  const runScan = async () => {
    setLoading(true);
    setError(null);
    setScanResult(null);
    setScanLogs(["[SYSTEM] Initiating full heuristic scan..."]);
    setCurrentStep(0);

    // Progressive scan simulation for "Demonstrative" effect
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setCurrentStep(i);
      setScanLogs(prev => [...prev, `[AUDIT] ${SCAN_STEPS[i]}... DONE`]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    try {
      const response = await fetch('http://localhost:8080/api/scan');
      if (!response.ok) throw new Error('Failed to fetch scan results');
      const data = await response.json();
      
      setScanLogs(prev => [...prev, "[SUCCESS] Audit complete. Generating report..."]);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setScanResult(data);
      saveToHistory(data);
    } catch (err) {
      setError(err.message);
      setScanLogs(prev => [...prev, `[ERROR] Scan aborted: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runScan();
  }, []);

  const CircularProgress = ({ score }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    const colorClass = score > 80 ? 'text-blue-400' : score > 50 ? 'text-cyan-400' : 'text-blue-600';

    return (
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <circle className="text-slate-900" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" />
          <circle
            className={`${colorClass} transition-all duration-[2000ms] ease-out`}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="80"
            cy="80"
            style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-5xl font-black ${colorClass} tracking-tighter`}>{score}</span>
          <span className="text-[9px] text-blue-500/50 font-black uppercase tracking-[0.2em]">Health_Idx</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="glass-card rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-600/5 blur-3xl -ml-20 -mt-20 group-hover:bg-blue-600/10 transition-colors duration-1000"></div>
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-100 tracking-tighter uppercase">Vulnerability Matrix</h2>
              <p className="text-blue-400/60 text-xs font-mono font-bold tracking-widest uppercase mt-1">Version 4.2 // HEURISTIC_ENGINE_STABLE</p>
            </div>
          </div>
        </div>
        <button
          onClick={runScan}
          disabled={loading}
          className="relative z-10 flex items-center px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-300 disabled:opacity-50 font-black tracking-tighter text-sm uppercase group active:scale-95"
        >
          {loading ? (
            <Activity className="animate-spin w-6 h-6 mr-3" />
          ) : (
            <PlayCircle className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
          )}
          {loading ? 'AUDITING_SYSTEM...' : 'INITIALIZE_CORE_SCAN'}
        </button>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in-up">
          {/* Scan Matrix Visualization */}
          <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center space-y-10">
            <div className="grid grid-cols-5 gap-4">
              {SCAN_STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`w-12 h-12 rounded-xl border-2 transition-all duration-500 flex items-center justify-center
                    ${idx < currentStep ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 
                      idx === currentStep ? 'bg-blue-500/20 border-blue-500 animate-pulse' : 'bg-slate-900 border-slate-800'}`}
                >
                  <Cpu className={`w-5 h-5 ${idx <= currentStep ? 'text-white' : 'text-slate-800'}`} />
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="text-blue-400 text-2xl font-black tracking-tighter uppercase mb-2 animate-pulse">
                {SCAN_STEPS[currentStep]}
              </h3>
              <p className="text-blue-500/40 text-[10px] font-mono uppercase tracking-[0.4em]">Heuristic Scan In Progress</p>
            </div>
          </div>

          {/* Real-time Terminal Logs */}
          <div className="glass-card rounded-3xl bg-black/40 border-blue-500/20 p-8 font-mono text-[11px] h-[350px] flex flex-col overflow-hidden">
            <div className="flex items-center space-x-2 mb-6 border-b border-blue-500/10 pb-4">
              <Terminal className="w-4 h-4 text-blue-500" />
              <span className="text-blue-500/60 uppercase font-black tracking-widest">SYSTEM_SCAN_LOG_v4</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {scanLogs.map((log, i) => (
                <div key={i} className="flex space-x-3">
                  <span className="text-blue-900 font-bold">[{i.toString().padStart(2, '0')}]</span>
                  <span className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-green-400' : 'text-blue-400/80'}>
                    {log}
                  </span>
                </div>
              ))}
              {loading && <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block"></div>}
              <div ref={logEndRef} />
            </div>
          </div>
        </div>
      )}

      {scanResult && !loading && (
        <div className="space-y-10 animate-fade-in-up">
          {/* Results Summary Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center relative group">
              <div className="absolute top-4 left-6 text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono">System_Health</div>
              <CircularProgress score={scanResult.health_score} />
            </div>

            <div className="glass-card rounded-3xl p-8 flex flex-col justify-between group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -mr-16 -mt-16"></div>
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-4 font-mono">Risk_Profile</div>
              <div className="flex items-end justify-between relative z-10">
                <div>
                  <span className="text-7xl font-black text-blue-100 leading-none tracking-tighter">
                    {scanResult.vulnerabilities.length}
                  </span>
                  <p className="text-xs text-blue-400/60 font-black uppercase mt-3 tracking-wider">Identified Vectors</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20">
                  <ShieldAlert className="w-8 h-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 flex flex-col group">
              <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-6 font-mono">Kernel_Environment</div>
              <div className="space-y-4">
                <div className="flex items-center text-slate-100 bg-slate-950/50 p-4 rounded-2xl border border-blue-500/10 group-hover:border-blue-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mr-4 border border-blue-500/20">
                    <Fingerprint className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest">OS_RELEASE_ID</p>
                    <p className="text-xs font-mono font-bold truncate">{scanResult.system_info.os} {scanResult.system_info.release}</p>
                  </div>
                </div>
                <div className="flex items-center text-slate-100 bg-slate-950/50 p-4 rounded-2xl border border-blue-500/10 group-hover:border-blue-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center mr-4 border border-blue-500/20">
                    <Database className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest">ARCHITECTURE</p>
                    <p className="text-xs font-mono font-bold">{scanResult.system_info.architecture} HOST_CPU</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Detailed Findings List */}
            <div className="lg:col-span-2 glass-card rounded-3xl overflow-hidden border border-blue-500/10">
              <div className="px-10 py-8 border-b border-blue-500/10 bg-slate-900/30 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-100 tracking-tight uppercase">Audit Findings Repository</h2>
                  <p className="text-[10px] text-blue-500/60 font-mono mt-1 uppercase tracking-widest">Detailed breakdown of security breaches</p>
                </div>
              </div>

              <div className="divide-y divide-blue-500/5">
                {scanResult.vulnerabilities.length === 0 ? (
                  <div className="p-24 text-center">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(37,99,235,0.2)] border border-blue-500/20">
                      <ShieldCheck className="w-12 h-12 text-blue-500" />
                    </div>
                    <p className="text-3xl font-black text-blue-100 tracking-tighter uppercase mb-3">System Integrity Secured</p>
                    <p className="text-blue-400/60 text-sm font-medium max-w-sm mx-auto uppercase">Zero critical threats identified during last heuristic cycle.</p>
                  </div>
                ) : (
                  scanResult.vulnerabilities.map((vuln, index) => (
                    <div key={index} className="p-10 hover:bg-blue-600/5 transition-all duration-500 group/item">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center">
                          <div className={`w-2 h-12 rounded-full mr-6 shadow-[0_0_15px_rgba(59,130,246,0.4)]
                            ${vuln.severity === 'Critical' ? 'bg-blue-600' : vuln.severity === 'High' ? 'bg-blue-500' : 'bg-blue-800'}`}></div>
                          <div>
                            <h4 className="text-2xl font-black text-slate-100 tracking-tighter group-hover/item:text-blue-400 transition-colors">{vuln.type}</h4>
                            <p className="text-[9px] text-blue-500/60 font-mono font-black uppercase tracking-widest mt-1">VECTOR_MAP_0{index + 1} :: SEC_LVL_{vuln.severity.toUpperCase()}</p>
                          </div>
                        </div>
                        <span className={`px-5 py-2 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] border transition-all duration-300
                          ${vuln.severity === 'Critical' ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]' :
                            vuln.severity === 'High' ? 'bg-blue-800/40 text-blue-200 border-blue-500/30' :
                              'bg-slate-800 text-blue-500 border-blue-500/10'}`}>
                          {vuln.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium italic">"{vuln.details}"</p>
                      <div className="bg-slate-950/80 rounded-2xl p-6 border border-blue-500/10 border-l-4 border-l-blue-600 group-hover/item:border-blue-500/30 transition-all">
                        <h5 className="text-[11px] font-black tracking-[0.3em] text-blue-500 uppercase mb-3 flex items-center">
                          <Zap className="w-3 h-3 mr-2" /> Countermeasure_Protocol
                        </h5>
                        <p className="text-blue-100/90 text-sm font-bold leading-relaxed">{vuln.mitigation}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent History Sidebar */}
            <div className="glass-card rounded-3xl overflow-hidden shadow-2xl h-fit border border-blue-500/10">
              <div className="px-8 py-7 border-b border-blue-500/10 bg-slate-900/30 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <History className="text-blue-500 w-5 h-5" />
                  <h2 className="text-lg font-black text-slate-100 tracking-tighter uppercase">Audit_Archives</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {scanHistory.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-[10px] text-blue-500/30 font-mono uppercase tracking-[0.3em]">No historical data</p>
                  </div>
                ) : (
                  scanHistory.map((history, idx) => (
                    <div key={idx} className="bg-slate-950/50 border border-blue-500/10 rounded-2xl p-5 flex justify-between items-center hover:border-blue-500/30 transition-all group">
                      <div>
                        <div className="flex items-center text-blue-500/60 text-[9px] font-black mb-1 uppercase tracking-[0.2em]">
                          <Clock className="w-3 h-3 mr-2" />
                          {new Date(history.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs font-black text-slate-200 tracking-tighter">
                          {history.vulnerabilities} THREATS_SYNCED
                        </div>
                      </div>
                      <div className={`text-2xl font-black ${history.score > 80 ? 'text-blue-400' : history.score > 50 ? 'text-cyan-400' : 'text-blue-600'} text-glow-blue`}>
                        {history.score}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-6 bg-slate-900/20 text-center">
                <p className="text-[8px] text-blue-500/20 font-mono uppercase tracking-[0.4em]">End of encrypted stream</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
