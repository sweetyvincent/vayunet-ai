# VayuNet AI — Federated Climate Action Platform

> **AI-Powered Federated Air Quality Intelligence & 3D Atmospheric Visualization Engine for Indian Cities and Corridors**

---

## 📌 Problem & Vision

Major Indian cities monitor macro-level air quality through static stations (CPCB) but consistently miss **hyper-local pollution events** — agricultural stubble burning clusters, industrial boiler stack emissions, heavy freight corridor traffic haze, and municipal waste combustion. 

**VayuNet AI** solves this by unifying:
1. **Citizen Crowdsourcing**: Mobile & web photo uploads evaluated by instant Computer Vision (haze opacity, spectral signature, dark channel prior).
2. **Hyper-Local Micro-Sensors**: Micro-sensor grids deployed across RWAs, industrial sectors, and highways.
3. **Satellite Imagery**: Sentinel-5P TROPOMI Aerosol Optical Depth (AOD) and NO2 column grids.
4. **Privacy-Preserving Federated Learning**: Multi-state model collaboration (Delhi-NCR, Punjab, Haryana, Mumbai) with zero raw data centralization.
5. **Interactive 3D WebGL Visualization**: Three.js atmospheric particle plume dispersion with wind advection physics and 3D terrain AQI height bar extrusions.

---

## 🌟 Key Features

- **3D Atmospheric Plume Simulator (Three.js)**: 4,500+ dynamic 3D particles showing PM2.5 / PM10 dispersion with controls for wind speed, vector angle, temperature inversion cap height, and biomass emission multipliers.
- **Privacy-Preserving Federated Neural Mesh**: Multi-node FedAvg orchestration with glowing 3D weight packet streams and differential privacy guarantees (`ε=1.2`).
- **AI Computer Vision Haze Scanner**: Automatically verifies citizen photo evidence, yields confidence scores (0-100%), and routes verified claims to authority action queues.
- **48-Hour AQI Corridor Forecaster**: Predicts particulate trajectory spikes across economic corridors (GT Road, Yamuna Expressway, Thane-Belapur Industrial Belt).
- **Rapid Authority Action & SLA Desk**: Automated dispatch for anti-smog gun units, industrial throttling orders, and 30-min / 60-min SLA tracking.

---

## 🛠️ Architecture

```
vayunet-ai/
├── backend/
│   ├── main.py                  # FastAPI Server & WebSockets
│   ├── config.py                # Regional nodes & corridor metadata
│   ├── services/
│   │   ├── simulator.py         # Telemetry & 3D vector generator
│   │   ├── hotspot_engine.py    # Spatial anomaly detection
│   │   ├── cv_verifier.py       # Computer Vision haze classifier
│   │   ├── forecaster.py        # 48h wind advection forecaster
│   │   └── federated_engine.py  # FedAvg multi-node FL engine
│   └── routers/                 # Sensors, Citizen, Federated, Interventions, Satellite
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx              # Unified React Dashboard
│   │   ├── components/3D/       # Three.js 3D WebGL components
│   │   ├── components/Map/      # Leaflet map with satellite overlays
│   │   ├── components/Federated/# FL network control view
│   │   ├── components/Citizen/  # Citizen photo upload & AI vision modal
│   │   ├── components/Predictor/# 48h Corridor Predictor
│   │   └── components/Authority/# Authority SLA Action Desk
```

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)

### 1. Run Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```
API Documentation will be available at `http://localhost:8000/docs`.

### 2. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📄 License
MIT License
