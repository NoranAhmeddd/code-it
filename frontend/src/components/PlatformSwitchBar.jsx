import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, GraduationCap, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PlatformSwitchBar() {
  const { platformMode, setPlatformMode, userRole, setRole, currentUser } = useApp();
  const navigate = useNavigate();

  const handleModeSwitch = (mode) => {
    setPlatformMode(mode);
    if (mode === 'competitive') {
      navigate('/dashboard');
    } else {
      navigate('/courses');
    }
  };

  const isCP = platformMode === 'competitive';

  return (
    <div className={`w-full text-xs select-none transition-colors duration-200 border-b ${
      isCP
        ? 'bg-[#0f172a] text-slate-200 border-slate-800'
        : 'bg-[#1e1b4b] text-indigo-100 border-[#312e81]'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] opacity-75 uppercase tracking-wider">
            <span>Environment:</span>
          </div>
          <span className="font-bold flex items-center gap-1.5 text-xs">
            {isCP ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse mr-1.5"></span>
                Competitive Judge Arena
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                Academic Learning LMS
              </span>
            )}
          </span>
        </div>

        {/* Center: The Sleek Toggle Pills */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-700/60 shadow-inner">
          <button
            onClick={() => handleModeSwitch('competitive')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-semibold text-xs transition-all ${
              isCP
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Trophy size={14} />
            <span>Competitive Arena</span>
          </button>

          <button
            onClick={() => handleModeSwitch('education')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md font-semibold text-xs transition-all ${
              !isCP
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <GraduationCap size={15} />
            <span>Education LMS</span>
          </button>
        </div>

        {/* Right: Quick Role Selector */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-400">Role:</span>
          {(['student', 'teacher', 'admin']).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-2.5 py-0.5 rounded-md capitalize font-medium transition ${
                userRole === r
                  ? 'bg-slate-700 text-white font-bold ring-1 ring-slate-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {r}
            </button>
          ))}
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-mono">@{currentUser?.username}</span>
        </div>
      </div>
    </div>
  );
}
