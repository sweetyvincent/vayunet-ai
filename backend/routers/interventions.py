"""
VayuNet AI - Authority Rapid Intervention Desk Router
API endpoints for dispatching anti-smog guns, factory boiler throttling, and SLA monitoring.
"""

import time
import random
from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/api/interventions", tags=["Authority Rapid Action Desk"])

# In-memory action dispatches database
DISPATCHES_DB: List[Dict[str, Any]] = [
    {
        "id": "DISP-2026-101",
        "target_location": "Anand Vihar Transport Corridor",
        "region": "delhi_ncr",
        "action_type": "Anti-Smog Gun & Water Mist Canon Unit #4",
        "recommended_by": "VayuNet Hotspot Anomaly AI",
        "urgency": "CRITICAL",
        "status": "DEPLOYED_IN_FIELD",
        "sla_remaining_mins": 18,
        "expected_aqi_reduction_pct": 22.5,
        "dispatched_at": int(time.time()) - 1800
    },
    {
        "id": "DISP-2026-102",
        "target_location": "Sangrur Paddy Field Stubble Cluster B",
        "region": "punjab_agri",
        "action_type": "Mobile Agricultural Fire Spray Team",
        "recommended_by": "VayuNet Citizen Visual AI",
        "urgency": "CRITICAL",
        "status": "EN_ROUTE",
        "sla_remaining_mins": 35,
        "expected_aqi_reduction_pct": 38.0,
        "dispatched_at": int(time.time()) - 900
    },
    {
        "id": "DISP-2026-103",
        "target_location": "Panipat Industrial Sector 2 Boiler Line",
        "region": "haryana_ind",
        "action_type": "Automated Industrial Stack Throttling Order",
        "recommended_by": "VayuNet FedEngine Anomaly",
        "urgency": "HIGH",
        "status": "COMPLETED",
        "sla_remaining_mins": 0,
        "expected_aqi_reduction_pct": 18.0,
        "dispatched_at": int(time.time()) - 7200
    }
]

@router.get("")
def get_interventions():
    """Fetch active authority action dispatches and SLA timers."""
    return DISPATCHES_DB

@router.post("/dispatch")
def trigger_dispatch(
    location: str,
    region: str,
    action_type: str,
    urgency: str = "HIGH"
):
    """Triggers an official authority intervention dispatch ticket."""
    dispatch_id = f"DISP-2026-{random.randint(200, 999)}"
    new_dispatch = {
        "id": dispatch_id,
        "target_location": location,
        "region": region,
        "action_type": action_type,
        "recommended_by": "VayuNet Authority Command Desk",
        "urgency": urgency,
        "status": "DEPLOYED_IN_FIELD",
        "sla_remaining_mins": 45,
        "expected_aqi_reduction_pct": round(random.uniform(15.0, 35.0), 1),
        "dispatched_at": int(time.time())
    }
    DISPATCHES_DB.insert(0, new_dispatch)
    return {
        "status": "success",
        "message": f"Authority dispatch {dispatch_id} triggered successfully.",
        "dispatch": new_dispatch
    }
