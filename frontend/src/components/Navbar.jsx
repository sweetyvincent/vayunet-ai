import React from 'react';
import { Wind, Network, Camera, TrendingUp, ShieldAlert, Sparkles, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, activeRegion, setActiveRegion, isLive, alertCount = 3 }) {
  const tabs = [
    { id: 'command', label: 'Command Center & 3D Plume', icon: Wind },
    { id: 'federated', label: 'Federated Intelligence Network', icon: Network },
    { id: 'citizen', label: 'Citizen Vision Portal', icon: Camera },
    { id: 'predictor', label: '48h Corridor Predictor', icon: TrendingUp },
    { id: 'authority', label: 'Authority Dispatch Desk', icon: ShieldAlert },
  ];

  const regions = [
    { id: 'all', label: 'All India Corridors' },
    { id: 'delhi_ncr', label: 'Delhi-NCR' },
    { id: 'punjab_agri', label: 'Punjab Stubble Belt' },
    { id: 'haryana_ind', label: 'Haryana Industrial' },
    { id: 'mumbai_coastal', label: 'Mumbai Region' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-xl border-b border-[#1E2D4A] px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Brand Logo & Live Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
              <Wind className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0B0F17]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-lg text-white tracking-tight">VayuNet <span className="text-cyan-400">AI</span></h1>
                <span className="text-[10px] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 font-mono px-2 py-0.5 rounded-full border border-cyan-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Federated v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Hyper-Local Climate Intelligence & 3D Air Quality Engine</p>
            </div>
          </div>

          {/* Region Selector Mobile/Desktop */}
          <div className="flex items-center gap-2">
            <select
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-cyan-500"
            >
              {regions.map(r => (
                <option key={r.id} value={r.id}>{r.label}</option>
              ))}
            </select>

            {/* Live Indicator */}
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs px-2.5 py-1.5 rounded-xl font-mono">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>LIVE</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 border border-cyan-400/40'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'authority' && alertCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-bold rounded-full animate-bounce">
                    {alertCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
