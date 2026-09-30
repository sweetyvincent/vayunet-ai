import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle2, Clock, Truck, Factory, Bell, Radio } from 'lucide-react';

export default function ActionDispatchDesk({ dispatches = [], onTriggerDispatch }) {
  const [targetLocation, setTargetLocation] = useState('Anand Vihar Highway Corridor');
  const [region, setRegion] = useState('delhi_ncr');
  const [actionType, setActionType] = useState('Anti-Smog Gun & Water Mist Canon Deployment');
  const [urgency, setUrgency] = useState('CRITICAL');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onTriggerDispatch({ location: targetLocation, region, action_type: actionType, urgency });
    setTargetLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Rapid Action Trigger Form */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Authority Rapid Intervention & SLA Action Desk</h3>
            <p className="text-xs text-slate-400">Dispatch anti-smog units, issue factory throttling orders, and track SLA response timers</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Target Location</label>
            <input
              type="text"
              value={targetLocation}
              onChange={(e) => setTargetLocation(e.target.value)}
              placeholder="e.g., Sangrur Sector 4 Stubble Field"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Action Intervention Type</label>
            <select
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="Anti-Smog Gun & Water Mist Canon Deployment">Deploy Mobile Anti-Smog Gun Unit</option>
              <option value="Automated Industrial Stack Throttling Order">Issue Industrial Boiler Throttling Order</option>
              <option value="Agricultural Stubble Suppression Taskforce">Dispatch Agricultural Fire Spray Taskforce</option>
              <option value="Mechanical Road Sweeping Alert">Order Heavy Mechanical Road Sweeping</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Urgency Level</label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="CRITICAL">CRITICAL (30-min SLA)</option>
              <option value="HIGH">HIGH (60-min SLA)</option>
              <option value="MEDIUM">MEDIUM (120-min SLA)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Dispatch Intervention Order
            </button>
          </div>
        </form>
      </div>

      {/* Active Dispatches Queue & SLA Tracker */}
      <div>
        <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-400" />
          Active Dispatch Queue & Field SLA Status ({dispatches.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dispatches.map((d) => (
            <div key={d.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-rose-400">{d.id}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  d.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'
                }`}>
                  {d.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-white mb-1">{d.action_type}</h4>
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" /> {d.target_location}
                </p>
              </div>

              <div className="space-y-1 text-xs border-t border-slate-800/80 pt-2 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Trigger Source:</span>
                  <span className="text-amber-300">{d.recommended_by}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target AQI Reduction:</span>
                  <span className="font-mono text-emerald-400 font-bold">-{d.expected_aqi_reduction_pct}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Timer:</span>
                  <span className="font-mono font-bold text-rose-400">{d.sla_remaining_mins} mins remaining</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
