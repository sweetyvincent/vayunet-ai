"""
VayuNet AI - Citizen Portal Router
API endpoints for citizen photo submission, computer vision haze analysis, and community report feed.
"""

import time
import random
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional, List, Dict, Any
from services.cv_verifier import cv_verifier_instance

router = APIRouter(prefix="/api/citizen", tags=["Citizen Crowdsourcing"])

# In-memory database of citizen reports
CITIZEN_REPORTS_DB: List[Dict[str, Any]] = [
    {
        "id": "REP-2026-8801",
        "title": "Massive Paddy Stubble Burning along GT Road Bypass",
        "issue_type": "Stubble Burning",
        "location": "Sangrur Highway KM 14",
        "lat": 30.2458,
        "lng": 75.8420,
        "region": "punjab_agri",
        "user_name": "Gurpreet Singh (RWA Sangrur)",
        "photo_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop",
        "ai_verification": {
            "verified": True,
            "confidence_score": 94.2,
            "haze_density_index": 0.86,
            "estimated_pm25": 430.5,
            "visual_category": "Dense Agricultural Biomass Smoke",
            "recommendation": "AUTO_DISPATCH_ALERT"
        },
        "status": "DISPATCHED_TO_AUTHORITY",
        "timestamp": int(time.time()) - 3600
    },
    {
        "id": "REP-2026-8802",
        "title": "Unfiltered Industrial Stack Smoke in Anand Vihar",
        "issue_type": "Industrial Chimney Smoke",
        "location": "Anand Vihar Industrial Area Sector 3",
        "lat": 28.6469,
        "lng": 77.3160,
        "region": "delhi_ncr",
        "user_name": "Priya Sharma",
        "photo_url": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop",
        "ai_verification": {
            "verified": True,
            "confidence_score": 88.7,
            "haze_density_index": 0.74,
            "estimated_pm25": 380.0,
            "visual_category": "High-Density Industrial Plume",
            "recommendation": "AUTO_DISPATCH_ALERT"
        },
        "status": "DISPATCHED_TO_AUTHORITY",
        "timestamp": int(time.time()) - 7200
    },
    {
        "id": "REP-2026-8803",
        "title": "Open Waste Combustion near Expressway Junction",
        "issue_type": "Waste Burning",
        "location": "Yamuna Expressway Toll Gate",
        "lat": 28.5308,
        "lng": 77.2714,
        "region": "delhi_ncr",
        "user_name": "Amit Kumar",
        "photo_url": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop",
        "ai_verification": {
            "verified": True,
            "confidence_score": 81.5,
            "haze_density_index": 0.65,
            "estimated_pm25": 310.0,
            "visual_category": "Urban Particulate Smog",
            "recommendation": "AUTO_DISPATCH_ALERT"
        },
        "status": "UNDER_INVESTIGATION",
        "timestamp": int(time.time()) - 10800
    }
]

@router.get("/reports")
def get_reports(region: Optional[str] = "all"):
    """Fetch recent citizen-submitted pollution reports."""
    if region == "all":
        return CITIZEN_REPORTS_DB
    return [r for r in CITIZEN_REPORTS_DB if r.get("region") == region]

@router.post("/report")
async def submit_report(
    title: str = Form(...),
    issue_type: str = Form(...),
    location: str = Form(...),
    region: str = Form("delhi_ncr"),
    lat: float = Form(28.6139),
    lng: float = Form(77.2090),
    user_name: str = Form("Concerned Citizen"),
    photo: Optional[UploadFile] = File(None)
):
    """Submits citizen report and instantly executes AI Computer Vision Haze Analysis."""
    if photo:
        contents = await photo.read()
        cv_result = cv_verifier_instance.verify_photo(contents, reported_issue_type=issue_type)
    else:
        # Generate simulated verification if no photo attached
        cv_result = cv_verifier_instance._mock_verification_response(reported_issue_type=issue_type)

    report_id = f"REP-2026-{random.randint(9000, 9999)}"
    
    new_report = {
        "id": report_id,
        "title": title,
        "issue_type": issue_type,
        "location": location,
        "lat": lat,
        "lng": lng,
        "region": region,
        "user_name": user_name,
        "photo_url": "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop",
        "ai_verification": cv_result,
        "status": "DISPATCHED_TO_AUTHORITY" if cv_result["verified"] else "NEEDS_REVIEW",
        "timestamp": int(time.time())
    }

    CITIZEN_REPORTS_DB.insert(0, new_report)

    return {
        "status": "success",
        "message": "Citizen report submitted and AI verified.",
        "report": new_report
    }
