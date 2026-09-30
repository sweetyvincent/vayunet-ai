import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import { ShieldAlert, Radio, Satellite, Camera, MapPin, Eye } from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs
const createCustomIcon = (color, label, isMacro = false) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
      <circle cx="12" cy="12" r="${isMacro ? 10 : 8}" fill="${color}" fill-opacity="0.8" stroke="#ffffff" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="#ffffff"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="display:flex; flex-direction:column; align-items:center;">
      ${svg}
      <span style="background:#0F172A; color:#FFF; font-size:10px; font-weight:700; padding:1px 5px; border-radius:4px; border:1px solid #334155; white-space:nowrap; margin-top:-4px;">${label}</span>
    </div>`,
    iconSize: [32, 42],
    iconAnchor: [16, 21]
  });
};

export default function VayuMap({ sensors = [], hotspots = [], reports = [], satGrid = null }) {
  const [showSatLayer, setShowSatLayer] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);

  // Default Center: New Delhi (28.6139, 77.2090)
  const defaultCenter = [28.6139, 77.2090];

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-[#1E2D4A] shadow-2xl">
      {/* Layer Control Floating Toggle Bar */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-700/80 shadow-lg text-xs">
        <button
          onClick={() => setShowSatLayer(!showSatLayer)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            showSatLayer ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Satellite className="w-3.5 h-3.5" /> Satellite Sentinel-5P
        </button>

        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
            showHotspots ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Anomaly Hotspots
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* Dark Mode Basemap Tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* 1. Micro-Sensor & Macro-Station Markers */}
        {sensors.map((s) => {
          let color = '#10B981';
          if (s.aqi > 300) color = '#EF4444';
          else if (s.aqi > 200) color = '#F97316';
          else if (s.aqi > 100) color = '#F59E0B';

          const icon = createCustomIcon(color, `AQI ${Math.round(s.aqi)}`, s.type === 'macro');

          return (
            <Marker key={s.id} position={[s.lat, s.lng]} icon={icon}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2 mb-2">
                    <span className="font-bold text-sm text-white">{s.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.type === 'macro' ? 'bg-blue-500/20 text-blue-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      {s.type === 'macro' ? 'CPCB Macro' : 'Micro Grid'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>PM2.5:</span>
                      <span className="font-mono font-bold text-white">{s.pm25} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PM10:</span>
                      <span className="font-mono">{s.pm10} µg/m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NO2:</span>
                      <span className="font-mono">{s.no2} ppb</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-700/60 pt-1 mt-1">
                      <span className="font-semibold text-slate-400">Calculated AQI:</span>
                      <span className="font-mono font-extrabold text-sm" style={{ color }}>{s.aqi}</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 2. Sentinel-5P Satellite AOD Layer Heatmap Circles */}
        {showSatLayer && satGrid && satGrid.points.map((pt, idx) => (
          <Circle
            key={`sat-${idx}`}
            center={[pt.lat, pt.lng]}
            radius={3500}
            pathOptions={{
              color: pt.aod > 0.8 ? '#EF4444' : '#F59E0B',
              fillColor: pt.aod > 0.8 ? '#EF4444' : '#F59E0B',
              fillOpacity: pt.intensity * 0.35,
              weight: 0
            }}
          />
        ))}

        {/* 3. Hotspot Anomaly Warning Rings */}
        {showHotspots && hotspots.map((h) => (
          <Circle
            key={h.id}
            center={[h.lat, h.lng]}
            radius={8000}
            pathOptions={{
              color: '#EF4444',
              fillColor: '#EF4444',
              fillOpacity: 0.25,
              weight: 2,
              dashArray: '4, 8'
            }}
          >
            <Popup>
              <div className="p-1 min-w-[220px]">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs border-b border-slate-700 pb-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Hidden Pollution Hotspot</span>
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <p><strong className="text-white">Location:</strong> {h.location_name}</p>
                  <p><strong className="text-white">Inferred Cause:</strong> {h.inferred_source}</p>
                  <p><strong className="text-white">CPCB Miss Delta:</strong> <span className="text-rose-400 font-mono font-bold">+{h.spike_percentage}% higher</span></p>
                  <p className="text-[11px] text-amber-300 bg-amber-500/10 p-1.5 rounded border border-amber-500/20 mt-1">
                    Missed by distant macro station baseline. Rapid action dispatched.
                  </p>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}
