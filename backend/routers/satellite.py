"""
VayuNet AI - Satellite Imagery & Grid Router
API endpoints for Sentinel-5P satellite TROPOMI NO2 and Aerosol Optical Depth (AOD) grid feeds.
"""

from fastapi import APIRouter
from services.simulator import simulator_instance

router = APIRouter(prefix="/api/satellite", tags=["Satellite Imagery & Grid"])

@router.get("/layer")
def get_satellite_layer(region: str = "delhi_ncr"):
    """Fetch Sentinel-5P Aerosol Optical Depth (AOD) and NO2 grid layers for map overlays."""
    return simulator_instance.get_satellite_grid(region=region)
