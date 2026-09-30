import React, { useState, useEffect } from 'react';
import { TrendingUp, Wind, Flame, Truck, AlertTriangle, Play } from 'lucide-react';

export default function CorridorPredictor({ activeRegion }) {
  const [corridorId, setCorridorId] = useState('gt_road_agri');
  const [windSpeed, setWindSpeed] = useState(14.0);
  const [windDir, setWindDir] = useState('NW');
  const [stubbleMult, setStubbleMult] = useState(1.5);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/sensors/forecast?corridor_id=${corridorId}&wind_speed=${windSpeed}&wind_dir=${windDir}&stubble_multiplier=${stubbleMult}`
      );
      const data = await res.json();
      setForecastData(data);
    } catch (e) {
      console.error("Forecast fetch error", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchForecast();
  }, [corridorId, windSpeed, windDir, stubbleMult]);

  return (
    <div className="space-y-6">
      {/* Interactive Scenario Controls */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">48-Hour AQI Corridor Spike Forecaster</h3>
            <p className="text-xs text-slate-400">Wind advection physics simulation & stubble fire trajectory predictor</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Economic Corridor</label>
            <select
              value={corridorId}
              onChange={(e) => setCorridorId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="gt_road_agri">GT Road Stubble Corridor (Punjab-Haryana)</option>
              <option value="delhi_agra">Delhi - Agra Yamuna Expressway</option>
              <option value="thane_belapur">Thane - Belapur Industrial Belt</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Wind Direction Vector</label>
            <select
              value={windDir}
              onChange={(e) => setWindDir(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="NW">North-Westerly (Downwind to NCR)</option>
              <option value="SE">South-Easterly (Dispersing Coastal)</option>
              <option value="SW">South-Westerly</option>
              <option value="NE">North-Easterly</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1.5 text-slate-300">
              <span>Wind Speed</span>
              <span className="text-cyan-400 font-mono font-bold">{windSpeed} km/h</span>
            </div>
            <input
              type="range"
              min="4.0"
              max="28.0"
              step="1.0"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-medium mb-1.5 text-slate-300">
              <span>Biomass Stubble Scale</span>
              <span className="text-rose-400 font-mono font-bold">{stubbleMult}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.25"
              value={stubbleMult}
              onChange={(e) => setStubbleMult(parseFloat(e.target.value))}
              className="w-full accent-rose-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Peak Spike Early Warning Banner */}
      {forecastData?.peak_spike && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/80 via-rose-900/40 to-slate-900 border border-rose-500/40 flex items-center gap-4 shadow-xl">
          <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-rose-300 tracking-wider">AI Early Warning Alert</span>
            <h4 className="text-sm font-extrabold text-white">{forecastData.peak_spike.alert}</h4>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Predicted Peak PM2.5 of {forecastData.peak_spike.peak_pm25} µg/m³. Authorities advised to trigger anti-smog units in advance.
            </p>
          </div>
        </div>
      )}

      {/* 48-Hour Forecast Timeline Grid */}
      {forecastData?.timeline && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h4 className="font-bold text-sm text-white">48-Hour Hourly Predicted Trajectory</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {forecastData.timeline.map((item) => {
              let color = 'border-emerald-500/40 text-emerald-400';
              if (item.aqi > 350) color = 'border-rose-500/60 text-rose-400 bg-rose-500/10';
              else if (item.aqi > 250) color = 'border-amber-500/60 text-amber-400 bg-amber-500/10';

              return (
                <div key={item.hour_offset} className={`p-3 rounded-xl border ${color} glass-panel text-center flex flex-col justify-between h-28`}>
                  <span className="text-[10px] font-mono text-slate-400">{item.label}</span>
                  <div>
                    <span className="text-xl font-extrabold font-mono block">{item.aqi}</span>
                    <span className="text-[10px] text-slate-400">AQI</span>
                  </div>
                  <span className="text-[9px] font-bold uppercase">{item.risk_level}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
