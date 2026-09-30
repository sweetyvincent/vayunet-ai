import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Vayu3DParticleCanvas from './components/3D/Vayu3DParticleCanvas';
import AQI3DTerrainBars from './components/3D/AQI3DTerrainBars';
import VayuMap from './components/Map/VayuMap';
import FedNetworkView from './components/Federated/FedNetworkView';
import CitizenReportModal from './components/Citizen/CitizenReportModal';
import CorridorPredictor from './components/Predictor/CorridorPredictor';
import ActionDispatchDesk from './components/Authority/ActionDispatchDesk';

import { ShieldAlert, Radio, Activity, Sparkles, Layers, Cpu, Eye, BarChart3, Wind } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('command');
  const [activeRegion, setActiveRegion] = useState('all');
  const [view3DMode, setView3DMode] = useState('plume'); // 'plume' or 'terrain'

  // Data States
  const [sensors, setSensors] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [satGrid, setSatGrid] = useState(null);
  const [fedState, setFedState] = useState(null);
  const [citizenReports, setCitizenReports] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [isTraining, setIsTraining] = useState(false);

  // Fetch Telemetry & Initial Datasets
  const fetchAllData = async () => {
    try {
      // 1. Sensors Telemetry
      const sensRes = await fetch(`/api/sensors?region=${activeRegion}`);
      const sensData = await sensRes.json();
      if (sensData.sensors) setSensors(sensData.sensors);

      // 2. Hotspots Anomaly
      const hotRes = await fetch(`/api/sensors/hotspots?region=${activeRegion}`);
      const hotData = await hotRes.json();
      if (hotData.hotspots) setHotspots(hotData.hotspots);

      // 3. Satellite Grid
      const satRes = await fetch(`/api/satellite/layer?region=${activeRegion === 'all' ? 'delhi_ncr' : activeRegion}`);
      const satData = await satRes.json();
      setSatGrid(satData);

      // 4. Federated Network State
      const fedRes = await fetch('/api/federated/state');
      const fedData = await fedRes.json();
      setFedState(fedData);

      // 5. Citizen Reports
      const citRes = await fetch(`/api/citizen/reports?region=${activeRegion}`);
      const citData = await citRes.json();
      setCitizenReports(citData);

      // 6. Authority Dispatches
      const dispRes = await fetch('/api/interventions');
      const dispData = await dispRes.json();
      setDispatches(dispData);
    } catch (err) {
      console.error('API Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 5000);
    return () => clearInterval(interval);
  }, [activeRegion]);

  // Trigger FL Training Round Handler
  const handleTriggerRound = async () => {
    setIsTraining(true);
    try {
      const res = await fetch('/api/federated/trigger-round', { method: 'POST' });
      const data = await res.json();
      if (data.federated_state) {
        setFedState(data.federated_state);
      }
    } catch (e) {
      console.error('FL trigger round error:', e);
    }
    setTimeout(() => setIsTraining(false), 1500);
  };

  // Submit Citizen Report Handler
  const handleSubmitReport = async (formData) => {
    try {
      const res = await fetch('/api/citizen/report', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      fetchAllData();
      return data;
    } catch (e) {
      console.error('Report submission error:', e);
    }
  };

  // Trigger Authority Dispatch Handler
  const handleTriggerDispatch = async (dispatchPayload) => {
    try {
      const query = new URLSearchParams(dispatchPayload).toString();
      await fetch(`/api/interventions/dispatch?${query}`, { method: 'POST' });
      fetchAllData();
    } catch (e) {
      console.error('Dispatch error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col font-sans">
      {/* Top Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeRegion={activeRegion}
        setActiveRegion={setActiveRegion}
        isLive={true}
        alertCount={hotspots.length}
      />

      {/* Main Content Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Tab 1: Command Center & 3D Plume Visualizer */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            {/* Real-time Status KPI Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Active Sensor Grids</span>
                  <h4 className="text-2xl font-extrabold text-white font-mono mt-0.5">{sensors.length} Nodes</h4>
                  <span className="text-[10px] text-emerald-400 font-medium">Macro CPCB + Micro RWAs</span>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Hotspots Missed by CPCB</span>
                  <h4 className="text-2xl font-extrabold text-rose-400 font-mono mt-0.5">{hotspots.length} Detected</h4>
                  <span className="text-[10px] text-rose-300 font-medium">Hyper-local spikes &gt; 30% baseline</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <ShieldAlert className="w-5 h-5 animate-bounce" />
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Satellite Aerosol (AOD)</span>
                  <h4 className="text-2xl font-extrabold text-amber-300 font-mono mt-0.5">0.86 AOD</h4>
                  <span className="text-[10px] text-amber-400 font-medium">Sentinel-5P TROPOMI Grid</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Federated Privacy Score</span>
                  <h4 className="text-2xl font-extrabold text-purple-300 font-mono mt-0.5">ε = 1.2</h4>
                  <span className="text-[10px] text-purple-400 font-medium">4 State Nodes Syncing</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Cpu className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 3D Visualization Switcher Bar */}
            <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-300 px-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> 3D WebGL Visualization View:
                </span>
                <button
                  onClick={() => setView3DMode('plume')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    view3DMode === 'plume' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5" /> 3D Atmospheric Particle Plume
                </button>
                <button
                  onClick={() => setView3DMode('terrain')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    view3DMode === 'terrain' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" /> 3D City AQI Bar Extrusions
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-mono hidden md:block">
                Powered by Three.js WebGL Engine
              </span>
            </div>

            {/* 3D WebGL Canvas Render Component */}
            {view3DMode === 'plume' ? (
              <Vayu3DParticleCanvas sensorData={sensors} />
            ) : (
              <AQI3DTerrainBars sensors={sensors} />
            )}

            {/* Interactive Leaflet Map Component */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  Hyper-Local Map & Satellite Fusion Layer
                </h3>
                <span className="text-xs text-slate-400">Click any marker to inspect micro vs macro station readings</span>
              </div>
              <VayuMap
                sensors={sensors}
                hotspots={hotspots}
                reports={citizenReports}
                satGrid={satGrid}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Federated Intelligence Network */}
        {activeTab === 'federated' && (
          <FedNetworkView
            fedState={fedState}
            onTriggerRound={handleTriggerRound}
            isTraining={isTraining}
          />
        )}

        {/* Tab 3: Citizen Vision Portal */}
        {activeTab === 'citizen' && (
          <CitizenReportModal
            reports={citizenReports}
            onSubmitReport={handleSubmitReport}
          />
        )}

        {/* Tab 4: 48h Corridor Predictor */}
        {activeTab === 'predictor' && (
          <CorridorPredictor activeRegion={activeRegion} />
        )}

        {/* Tab 5: Authority Dispatch Desk */}
        {activeTab === 'authority' && (
          <ActionDispatchDesk
            dispatches={dispatches}
            onTriggerDispatch={handleTriggerDispatch}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1E2D4A] bg-[#0B0F17] py-6 px-4 text-center text-xs text-slate-500">
        <p>VayuNet AI — Federated Climate Action & Hyper-Local Pollution Intelligence Engine for Indian Cities</p>
        <p className="mt-1 text-[11px] text-slate-600">Interoperable multi-state architecture bridging CPCB stations, micro-sensors, Sentinel-5P satellite feeds & 3D physics</p>
      </footer>
    </div>
  );
}
