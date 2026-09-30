"""
VayuNet AI - Sensors Router
API endpoints for micro-sensor telemetry, CPCB macro station feeds, and hotspot detection.
"""

from fastapi import APIRouter, Query
from typing import Optional
from services.simulator import simulator_instance
from services.hotspot_engine import hotspot_engine_instance
from services.forecaster import forecaster_instance

router = APIRouter(prefix="/api/sensors", tags=["Sensors & Telemetry"])

@router.get("")
def get_sensors(region: Optional[str] = "all"):
    """Fetch live micro-sensor and macro-station telemetry."""
    sensors = simulator_instance.get_live_sensors(region_filter=region)
    return {
        "status": "success",
        "count": len(sensors),
        "region_filter": region,
        "sensors": sensors
    }

@router.get("/hotspots")
def get_hotspots(region: Optional[str] = "all"):
    """Fetch detected micro-pollution hotspots missed by standard macro CPCB monitors."""
    sensors = simulator_instance.get_live_sensors(region_filter=region)
    hotspots = hotspot_engine_instance.detect_hotspots(sensors)
    return {
        "status": "success",
        "hotspot_count": len(hotspots),
        "hotspots": hotspots
    }

@router.get("/3d-vectors")
def get_3d_vectors():
    """Fetch 3D wind advection & particle velocity field for WebGL/Three.js renderers."""
    return simulator_instance.get_3d_particle_vectors()

@router.get("/forecast")
def get_corridor_forecast(
    corridor_id: str = "gt_road_agri",
    wind_speed: float = 12.0,
    wind_dir: str = "NW",
    stubble_multiplier: float = 1.0,
    traffic_scale: float = 1.0
):
    """Fetch 48-hour spatio-temporal AQI corridor predictions under custom scenario physics."""
    return forecaster_instance.forecast_corridor(
        corridor_id=corridor_id,
        wind_speed_kmh=wind_speed,
        wind_direction=wind_dir,
        stubble_fire_intensity=stubble_multiplier,
        traffic_volume_scale=traffic_scale
    )
