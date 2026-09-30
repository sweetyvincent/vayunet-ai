"""
VayuNet AI - Main FastAPI Application Server
Federated Climate Action Platform Backend API & WebSocket Server
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import time

from config import REGIONAL_NODES, ECONOMIC_CORRIDORS
from routers import sensors, citizen, federated, interventions, satellite
from services.simulator import simulator_instance

app = FastAPI(
    title="VayuNet AI - Federated Climate Action Platform API",
    description="Hyper-Local AI Air Quality Intelligence, Satellite Fusion & Federated Learning Engine for Indian Corridors.",
    version="2.0.0"
)

# Configure CORS for Vite frontend (http://localhost:5173 or http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(sensors.router)
app.include_router(citizen.router)
app.include_router(federated.router)
app.include_router(interventions.router)
app.include_router(satellite.router)

@app.get("/")
def read_root():
    return {
        "platform": "VayuNet AI",
        "tagline": "AI-Powered Federated Hyper-Local Climate Action Platform for Indian Cities",
        "version": "2.0.0",
        "status": "ONLINE",
        "regional_nodes": len(REGIONAL_NODES),
        "economic_corridors": len(ECONOMIC_CORRIDORS),
        "timestamp": int(time.time())
    }

@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    """WebSocket broadcasting real-time sensor updates every 3 seconds."""
    await websocket.accept()
    try:
        while True:
            live_sensors = simulator_instance.get_live_sensors()
            vectors_3d = simulator_instance.get_3d_particle_vectors()
            payload = {
                "type": "TELEMETRY_UPDATE",
                "timestamp": int(time.time()),
                "sensor_count": len(live_sensors),
                "sensors": live_sensors,
                "wind_3d": vectors_3d["wind"]
            }
            await websocket.send_text(json.dumps(payload))
            await asyncio.sleep(3.0)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"WebSocket closed: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
