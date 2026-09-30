import React, { useState } from 'react';
import { Camera, Upload, CheckCircle2, ShieldAlert, Sparkles, MapPin, User, FileText, Activity } from 'lucide-react';

export default function CitizenReportModal({ reports = [], onSubmitReport }) {
  const [title, setTitle] = useState('');
  const [issueType, setIssueType] = useState('Stubble Burning');
  const [location, setLocation] = useState('Sangrur Highway KM 18');
  const [region, setRegion] = useState('punjab_agri');
  const [userName, setUserName] = useState('Anand Verma (Local RWA)');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [latestResult, setLatestResult] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsScanning(true);
    setLatestResult(null);

    // Simulate AI Vision Scan Delay for UX polish
    setTimeout(async () => {
      const formData = new FormData();
      formData.append('title', title || `Unreported ${issueType} Incident`);
      formData.append('issue_type', issueType);
      formData.append('location', location);
      formData.append('region', region);
      formData.append('user_name', userName);
      if (photoFile) formData.append('photo', photoFile);

      const res = await onSubmitReport(formData);
      setIsScanning(false);
      if (res && res.report) {
        setLatestResult(res.report.ai_verification);
      }
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Submit Form & AI Scanner Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Form */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Citizen Report & AI Vision Scan</h3>
              <p className="text-xs text-slate-400">Upload photo evidence for instant computer vision haze verification</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Heavy Stubble Smoke plume near GT Road"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Pollution Issue Type</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Stubble Burning">Crop Paddy Stubble Burning</option>
                  <option value="Industrial Chimney Smoke">Industrial Stack Smoke</option>
                  <option value="Construction Dust">Construction Fugitive Dust</option>
                  <option value="Waste Burning">Open Municipal Waste Fire</option>
                  <option value="Vehicle Fleet Haze">Diesel Vehicle Exhaust Haze</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Target Corridor Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="punjab_agri">Punjab Stubble Belt</option>
                  <option value="delhi_ncr">Delhi-NCR Region</option>
                  <option value="haryana_ind">Haryana Industrial Zone</option>
                  <option value="mumbai_coastal">Mumbai Metropolitan</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Specific Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street / Highway Landmark"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Reporter Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Photo Upload Dropzone */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Upload Photo Evidence</label>
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-2xl p-4 text-center cursor-pointer transition-all bg-slate-900/50">
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" id="photo-upload" />
                <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="w-6 h-6 text-cyan-400" />
                  <span className="text-slate-300 font-medium">{photoFile ? photoFile.name : 'Click to select photo or drag here'}</span>
                  <span className="text-[10px] text-slate-500">Supports JPG, PNG, WEBP. AI evaluates haze opacity automatically.</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isScanning}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Analyzing Haze & Spectral Signatures...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Report & Run AI Haze Scan
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Scanner Result Live Preview */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Real-Time Vision AI Verification Output
            </h4>

            {photoPreview ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                {isScanning && (
                  <div className="absolute inset-0 bg-cyan-500/20 backdrop-blur-xs flex items-center justify-center">
                    <div className="w-full h-1 bg-cyan-400 animate-pulse shadow-lg shadow-cyan-400" />
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-56 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col items-center justify-center gap-2 text-slate-500">
                <Camera className="w-8 h-8 text-slate-600" />
                <span className="text-xs">No photo selected. Standard sample photo will be analyzed.</span>
              </div>
            )}

            {latestResult && (
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">AI Confidence Score:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">{latestResult.confidence_score}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Haze Density Index:</span>
                  <span className="font-mono text-cyan-400 font-bold">{latestResult.haze_density_index}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Vision Estimated PM2.5:</span>
                  <span className="font-mono text-rose-400 font-bold">{latestResult.estimated_pm25} µg/m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Visual Category:</span>
                  <span className="text-amber-300 font-semibold">{latestResult.visual_category}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Community Reports Feed */}
      <div>
        <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Live Community Pollution Report Stream ({reports.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reports.map((r) => (
            <div key={r.id} className="glass-panel p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3">
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-950">
                <img src={r.photo_url} alt={r.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                  AI Verified ({r.ai_verification?.confidence_score}%)
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-cyan-400">{r.id}</span>
                <h4 className="font-bold text-xs text-white line-clamp-1">{r.title}</h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-rose-400" /> {r.location}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2 text-[10px] text-slate-400">
                <span>By: {r.user_name}</span>
                <span className="text-emerald-400 font-semibold">{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
