import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Lock, Bug, User, Key, Play, RotateCcw, AlertTriangle, Activity, Zap, Terminal } from 'lucide-react';

const BufferOverflowDemo = () => {
  const [state, setState] = useState('idle'); // idle, normal, overflow, mitigated
  const [depEnabled, setDepEnabled] = useState(false);

  const runNormal = () => setState('normal');
  const runOverflow = () => {
    if (depEnabled) {
      setState('mitigated');
    } else {
      setState('overflow');
    }
  };
  const reset = () => setState('idle');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Terminal className="w-4 h-4 text-blue-500" />
            <h3 className="text-xl font-black text-slate-100 tracking-tight">Buffer Overflow Synthesis</h3>
          </div>
          <p className="text-blue-400/60 text-xs font-medium uppercase tracking-tight">Memory boundary violation analysis and return address manipulation.</p>
        </div>
        <div className="flex items-center space-x-3 bg-slate-900/50 p-3 rounded-2xl border border-blue-500/10">
          <span className="text-[10px] text-blue-500 font-black uppercase tracking-widest">Stack Protection (DEP)</span>
          <button
            onClick={() => { setDepEnabled(!depEnabled); reset(); }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-500 ${depEnabled ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${depEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button onClick={runNormal} className="px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 rounded-xl text-blue-400 font-black text-[10px] uppercase tracking-widest transition-all">
          <Play className="w-4 h-4 mr-2" /> Dispatch Safe Data
        </button>
        <button onClick={runOverflow} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] group">
          <Bug className="w-4 h-4 mr-2 group-hover:animate-bounce" /> Inject Overflow Payload
        </button>
        <button onClick={reset} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
          <RotateCcw className="w-4 h-4 mr-2" /> Reset Kernel
        </button>
      </div>

      <div className="glass-card rounded-3xl p-10 flex flex-col items-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex flex-col space-y-4 w-full max-w-lg relative z-10">
          <div className="text-center text-[10px] text-blue-500/50 mb-2 uppercase tracking-[0.4em] font-black">Memory_Segment::Stack_Frame</div>

          <div className="flex border border-blue-500/10 rounded-2xl overflow-hidden bg-slate-950/50 backdrop-blur-sm">
            <div className="w-1/3 bg-blue-600/5 p-4 text-center border-r border-blue-500/10 font-mono text-[10px] text-blue-500/40">0x00FF_HIGH</div>
            <div className="w-2/3 p-4 flex items-center justify-center font-mono text-xs">
              <span className="text-blue-500/20 italic tracking-widest">_RESERVED_SYSTEM_SPACE_</span>
            </div>
          </div>

          {/* Return Address */}
          <div className={`flex border transition-all duration-700 rounded-2xl overflow-hidden ${state === 'overflow' ? 'border-blue-400 bg-blue-600/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' : 'border-blue-500/10 bg-slate-950/50'}`}>
            <div className="w-1/3 bg-blue-600/5 p-4 text-center border-r border-blue-500/10 font-mono text-[10px] text-blue-500/40">0x0014_RET</div>
            <div className="w-2/3 p-4 flex items-center justify-center font-mono relative overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className={`w-full h-full transition-all duration-1000 ease-in-out ${state === 'overflow' ? 'bg-blue-600/80 translate-x-0' : 'bg-blue-600/80 -translate-x-full'}`}></div>
              </div>
              <span className={`relative z-10 font-black tracking-tighter text-sm transition-colors duration-500 ${state === 'overflow' ? 'text-white' : 'text-blue-400'}`}>
                {state === 'overflow' ? '0x42424242 [VECTOR_HIJACK]' : '0x080483E4 [STABLE]'}
              </span>
            </div>
          </div>

          {/* Buffer */}
          <div className="flex border border-blue-500/10 rounded-2xl overflow-hidden bg-slate-950/50">
            <div className="w-1/3 bg-blue-600/5 p-4 text-center border-r border-blue-500/10 font-mono text-[10px] text-blue-500/40">0x0010_BUF</div>
            <div className="w-2/3 p-4 flex items-center font-mono relative overflow-hidden h-16">
              <div className="absolute inset-0 flex items-center px-4">
                {state === 'idle' && <span className="text-blue-500/20 text-xs italic uppercase tracking-widest">[Null_Allocation]</span>}
                {state === 'normal' && <span className="text-blue-400 font-bold tracking-widest">VALID_INPUT\0</span>}
                {(state === 'overflow' || state === 'mitigated') && (
                  <span className="text-blue-100 font-black tracking-[0.3em] whitespace-nowrap animate-pulse">
                    XXXXXXXXXXXXXXXXXXXXXXX
                  </span>
                )}
              </div>
              {state === 'overflow' && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400 animate-ping"></div>
              )}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className="mt-10 h-20 flex items-center justify-center text-center px-6">
          {state === 'normal' && <div className="animate-fade-in-up text-blue-400 font-bold uppercase tracking-widest text-xs flex items-center"><ShieldCheck className="w-5 h-5 mr-3" /> Integrity Check Passed :: No Violation</div>}
          {state === 'overflow' && <div className="animate-fade-in-up flex flex-col items-center">
            <p className="text-blue-400 font-black text-sm uppercase tracking-[0.2em] mb-2 flex items-center"><AlertTriangle className="w-5 h-5 mr-3 animate-pulse" /> KERNEL_PANIC: RETURN_ADDRESS_OVERWRITTEN</p>
            <p className="text-[10px] text-blue-500/60 font-mono max-w-sm">Attacker has synchronized with execution flow. Memory boundaries compromised.</p>
          </div>}
          {state === 'mitigated' && <div className="animate-fade-in-up flex flex-col items-center">
            <p className="text-blue-100 font-black text-sm uppercase tracking-[0.2em] mb-2 flex items-center"><Shield className="w-5 h-5 mr-3 text-blue-400" /> DEP_PROTECTION_TRIGGERED</p>
            <p className="text-[10px] text-blue-500/60 font-mono max-w-sm">Illegal memory write detected. Process terminated by stack canary watchdog.</p>
          </div>}
        </div>
      </div>
    </div>
  );
};

const PrivilegeEscalationDemo = () => {
  const [step, setStep] = useState(0);

  const steps = [
    "USER_INIT: standard_node identified.",
    "ACTION: mal_installer.msi execution request.",
    "SCAN: registry_lookup (AlwaysInstallElevated).",
    "BYPASS: elevation_policy detected. inheriting system_ctx.",
    "STATUS: privilege_escalation_complete. NT_AUTHORITY_SYNCED."
  ];

  useEffect(() => {
    let timer;
    if (step > 0 && step < 4) {
      timer = setTimeout(() => setStep(step + 1), 1500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Activity className="w-4 h-4 text-blue-500" />
            <h3 className="text-xl font-black text-slate-100 tracking-tight">Privilege Escalation Vector</h3>
          </div>
          <p className="text-blue-400/60 text-xs font-medium uppercase tracking-tight">Analysis of AlwaysInstallElevated policy exploits in Windows-based environments.</p>
        </div>
        <button onClick={() => setStep(step === 0 ? 1 : 0)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          {step === 0 ? <Play className="w-4 h-4 mr-2" /> : <RotateCcw className="w-4 h-4 mr-2" />}
          {step === 0 ? 'Initialize Exploit' : 'Reset Context'}
        </button>
      </div>

      <div className="glass-card rounded-3xl p-10 flex justify-center items-center h-[400px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        
        {/* User Node */}
        <div className={`absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000 z-10 ${step >= 4 ? 'text-blue-400 scale-125 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]' : 'text-slate-500'}`}>
          <div className={`p-6 rounded-3xl border-2 transition-all duration-500 ${step >= 4 ? 'bg-blue-600/10 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-slate-900 border-slate-800'}`}>
            <User className="w-12 h-12" />
          </div>
          <span className="mt-4 font-black text-[10px] uppercase tracking-[0.2em]">{step >= 4 ? 'SYSTEM_ROOT' : 'USER_LEVEL'}</span>
        </div>

        {/* Registry Node */}
        <div className={`absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ${step >= 2 ? 'text-blue-400 opacity-100' : 'opacity-20 text-slate-500'}`}>
          <div className="bg-slate-900 p-3 rounded-2xl border border-blue-500/20 mb-3">
            <Key className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-mono font-black bg-slate-950 px-3 py-1 rounded-full border border-blue-500/10">POLICY::AlwaysInstallElevated = 1</span>
        </div>

        {/* MSI Node */}
        <div className={`absolute top-1/2 right-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-700 ${step >= 1 ? 'opacity-100' : 'opacity-10'}`}>
          <div className={`p-6 rounded-3xl border-2 transition-all duration-500 ${step >= 3 ? 'border-blue-400 bg-blue-600/10 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
            <ShieldAlert className="w-12 h-12" />
          </div>
          <span className="mt-4 font-mono font-bold text-[9px] uppercase tracking-widest text-blue-500/60">exploit_v4.msi</span>
        </div>

        {/* Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          {step >= 1 && <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="10,5" className="animate-[pulse_2s_infinite]" />}
          {step >= 2 && <line x1="75%" y1="50%" x2="50%" y2="25%" stroke="#3b82f6" strokeWidth="1" className="animate-pulse" />}
          {step >= 4 && <line x1="75%" y1="50%" x2="25%" y2="50%" stroke="#3b82f6" strokeWidth="3" className="animate-pulse" />}
        </svg>

        {/* Step Text */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-slate-950/80 backdrop-blur-md px-10 py-4 rounded-2xl border border-blue-500/20 text-blue-100 font-bold text-[10px] uppercase tracking-[0.3em] min-w-[400px] text-center shadow-2xl">
          <span className="text-blue-500/50 mr-3 font-mono">STEP_0{step + 1}::</span> {steps[step]}
        </div>
      </div>
    </div>
  );
};

const MalwareActivityDemo = () => {
  const [injected, setInjected] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Zap className="w-4 h-4 text-blue-500" />
            <h3 className="text-xl font-black text-slate-100 tracking-tight">Process Injection Analysis</h3>
          </div>
          <p className="text-blue-400/60 text-xs font-medium uppercase tracking-tight">Visualization of cross-process code injection and persistent payload residency.</p>
        </div>
        <button onClick={() => setInjected(!injected)} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          {injected ? <RotateCcw className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {injected ? 'Sanitize System' : 'Launch Simulation'}
        </button>
      </div>

      <div className="glass-card rounded-3xl p-10 flex justify-center items-center min-h-[350px] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(59,130,246,0.03)_50%,transparent_75%)] bg-[length:250px_250px] animate-[pulse_4s_infinite]"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 relative z-10">

          {/* Temp Folder */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] text-blue-500/40 uppercase font-black mb-4 tracking-widest">DIR::AppData\Temp</div>
            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 ${injected ? 'bg-blue-600/5 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]' : 'bg-slate-900 border-slate-800'}`}>
              <Bug className={`w-12 h-12 transition-all duration-500 ${injected ? 'text-blue-400 animate-pulse scale-110' : 'text-slate-800'}`} />
            </div>
            <span className={`mt-4 font-mono text-[10px] font-bold tracking-tighter ${injected ? 'text-blue-400' : 'text-slate-600'}`}>
              {injected ? 'payload_x64.bin' : '(empty_node)'}
            </span>
          </div>

          {/* Injection Component */}
          <div className="w-24 md:w-48 h-[2px] bg-slate-800 rounded-full relative overflow-hidden">
            {injected && (
              <div className="absolute top-0 left-0 h-full bg-blue-500 w-full animate-[slide_1.5s_ease-in-out_infinite]"></div>
            )}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-500/30 uppercase tracking-[0.3em]">
              Cross_Process_Link
            </div>
          </div>

          {/* Explorer Process */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] text-blue-500/40 uppercase font-black mb-4 tracking-widest">Memory::Process_Heap</div>
            <div className={`p-8 rounded-3xl border-2 transition-all duration-700 ${injected ? 'bg-blue-600/10 border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'bg-blue-900/5 border-blue-500/10'}`}>
              <Cpu className={`w-12 h-12 transition-all duration-500 ${injected ? 'text-blue-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'text-blue-900/40'}`} />
            </div>
            <span className="mt-4 font-mono text-[10px] font-bold text-blue-500/60 tracking-widest uppercase">system_explorer.exe</span>
            {injected && (
              <div className="mt-3 flex items-center space-x-2 bg-blue-600/20 px-4 py-1.5 rounded-full border border-blue-500/30 animate-bounce">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></div>
                <span className="text-[8px] text-blue-100 font-black uppercase tracking-tighter">Payload_Active</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

// Main Demos Component Container
const SecurityDemos = () => {
  const [activeDemo, setActiveDemo] = useState('buffer');

  return (
    <div className="space-y-10 animate-fade-in-up">
      {/* Demo Selector */}
      <div className="flex flex-wrap gap-3 bg-slate-900/50 backdrop-blur-xl p-3 rounded-2xl border border-blue-500/10 w-fit">
        <button
          onClick={() => setActiveDemo('buffer')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDemo === 'buffer' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          Memory Boundary
        </button>
        <button
          onClick={() => setActiveDemo('privesc')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDemo === 'privesc' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          Privilege Elevation
        </button>
        <button
          onClick={() => setActiveDemo('malware')}
          className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDemo === 'malware' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}
        >
          Malware Residency
        </button>
      </div>

      {/* Active Demo Render */}
      <div className="animate-fade-in-up">
        {activeDemo === 'buffer' && <BufferOverflowDemo />}
        {activeDemo === 'privesc' && <PrivilegeEscalationDemo />}
        {activeDemo === 'malware' && <MalwareActivityDemo />}
      </div>
      
      {/* Footer Info */}
      <div className="glass-card rounded-2xl p-6 bg-blue-600/5 border border-blue-500/10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="text-xs font-black text-blue-100 uppercase tracking-widest">Sandboxed Educational Node</h4>
            <p className="text-[10px] text-blue-500/60 mt-1 font-medium">All simulations are executed in a controlled, virtualized environment for security analysis purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDemos;

