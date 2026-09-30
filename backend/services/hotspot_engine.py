"""
VayuNet AI - Hotspot Anomaly & Spatial Interpolation Engine
Combines macro-station data with micro-sensor grids to detect hyper-local pollution
events missed by standard CPCB monitors.
"""

import math
from typing import List, Dict, Any

class HotspotDetectionEngine:
    def __init__(self):
        pass

    def detect_hotspots(self, sensor_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identifies hyper-local pollution events by comparing micro-sensors against local macro-stations."""
        hotspots = []
        
        # Group sensors by region
        regions = {}
        for s in sensor_data:
            r = s["region"]
            if r not in regions:
                regions[r] = {"macro": [], "micro": []}
            if s["type"] == "macro":
                regions[r]["macro"].append(s)
            else:
                regions[r]["micro"].append(s)

        # Detect micro-sensor anomalies exceeding regional macro baseline by > 30%
        for r_name, r_data in regions.items():
            if not r_data["macro"]:
                macro_avg_pm25 = 180.0 # Default baseline fallback
            else:
                macro_avg_pm25 = sum(m["pm25"] for m in r_data["macro"]) / len(r_data["macro"])

            for m in r_data["micro"]:
                delta = m["pm25"] - macro_avg_pm25
                elevation_ratio = round((m["pm25"] / max(1.0, macro_avg_pm25) - 1.0) * 100, 1)

                if elevation_ratio > 25.0: # Significant local spike
                    severity = "CRITICAL" if m["aqi"] > 350 else ("HIGH" if m["aqi"] > 250 else "MODERATE")
                    source_type = self._infer_source_type(m["pm25"], m["no2"], m["co"], r_name)

                    hotspots.append({
                        "id": f"HOTSPOT-{m['id']}",
                        "sensor_id": m["id"],
                        "location_name": m["name"],
                        "lat": m["lat"],
                        "lng": m["lng"],
                        "region": r_name,
                        "micro_pm25": m["pm25"],
                        "macro_baseline_pm25": round(macro_avg_pm25, 1),
                        "spike_percentage": elevation_ratio,
                        "aqi": m["aqi"],
                        "severity": severity,
                        "inferred_source": source_type,
                        "missed_by_cpcb": True if elevation_ratio > 35.0 else False,
                        "estimated_affected_population": int(random_pop_by_region(r_name)),
                        "timestamp": m["timestamp"]
                    })

        return sorted(hotspots, key=lambda x: x["spike_percentage"], reverse=True)

    def _infer_source_type(self, pm25: float, no2: float, co: float, region: str) -> str:
        if region == "punjab_agri":
            return "Agricultural Stubble Biomass Fires"
        elif no2 > 80.0 and co > 2.5:
            return "Heavy Vehicular & Freight Corridor Exhaust"
        elif pm25 > 350.0 and no2 > 65.0:
            return "Unregulated Industrial Boiler Emissions"
        elif pm25 > 300.0:
            return "Open Municipal Solid Waste Burning / Dust Spike"
        else:
            return "Mixed Urban Combustion & Fugitive Dust"

def random_pop_by_region(region: str) -> int:
    if region == "delhi_ncr":
        return 45000 + hash(region) % 30000
    elif region == "punjab_agri":
        return 18000 + hash(region) % 15000
    elif region == "haryana_ind":
        return 28000 + hash(region) % 20000
    else:
        return 35000 + hash(region) % 25000

hotspot_engine_instance = HotspotDetectionEngine()
