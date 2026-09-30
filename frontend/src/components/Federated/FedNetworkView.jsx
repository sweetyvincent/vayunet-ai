import React from 'react';
import Fed3DNetworkOrbiter from '../3D/Fed3DNetworkOrbiter';
import { Network, ShieldCheck, Cpu, RefreshCw, Activity, Layers, Lock } from 'lucide-react';

export default function FedNetworkView({ fedState, onTriggerRound, isTraining }) {
  if (!fedState) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Federated Round</span>
            <h4 className="text-2xl font-extrabold text-white font-mono">#{fedState.current_round} <span className="text-xs font-normal text-slate-400">/ {fedState.target_rounds}</span></h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Global Loss (FedAvg)</span>
            <h4 className="text-2xl font-extrabold text-emerald-400 font-mono">{fedState.global_loss}</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Global MAE AQI</span>
            <h4 className="text-2xl font-extrabold text-purple-300 font-mono">±{fedState.global_mae_aqi} AQI</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-semibold">Privacy Budget</span>
            <h4 className="text-sm font-bold text-amber-300">Differential Privacy ε=1.2</h4>
          </div>
        </div>
      </div>

      {/* 3D Interactive WebGL Orbiter Mesh */}
      <Fed3DNetworkOrbiter
        fedState={fedState}
        onTriggerRound={onTriggerRound}
        isTraining={isTraining}
      />

      {/* Participating Regional Client Nodes */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Participating Regional Federated Nodes ({fedState.nodes?.length || 0})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fedState.nodes?.map((node) => (
            <div key={node.node_id} className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{node.node_id}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    {node.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white mb-1">{node.node_name}</h4>
                <p className="text-xs text-slate-400 mb-3">{node.region}</p>

                <div className="space-y-1.5 text-xs border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sensors Ingested:</span>
                    <span className="font-mono text-slate-200">{node.sensor_count} micro-grids</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Local Loss:</span>
                    <span className="font-mono text-emerald-400 font-bold">{node.local_loss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Federated Weight:</span>
                    <span className="font-mono text-cyan-400 font-bold">{(node.client_weight * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Model: {node.model_version}</span>
                <span>{node.last_gradient_sync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
