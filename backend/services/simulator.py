"""
VayuNet AI - Telemetry & Environmental Simulator
Generates realistic hyper-local sensor grid telemetry, CPCB macro station feeds,
Sentinel-5P satellite grid layers, and 3D wind/particulate vector fields.
"""

import math
import random
import time
from typing import List, Dict, Any

class EnvironmentalSimulator:
    def __init__(self):
        self.start_time = time.time()
        # Define 15 key monitoring clusters across Indian regions
        self.sensors = [
            # Delhi-NCR Cluster
            {"id": "SENS-DEL-01", "name": "Anand Vihar Micro Grid", "lat": 28.6469, "lng": 77.3160, "region": "delhi_ncr", "type": "micro", "base_pm25": 320, "bias": 45},
            {"id": "SENS-DEL-02", "name": "RK Puram RWA Node", "lat": 28.5653, "lng": 77.1747, "region": "delhi_ncr", "type": "micro", "base_pm25": 240, "bias": 10},
            {"id": "SENS-DEL-03", "name": "CPCB ITO Station (Macro)", "lat": 28.6286, "lng": 77.2410, "region": "delhi_ncr", "type": "macro", "base_pm25": 210, "bias": -30},
            {"id": "SENS-DEL-04", "name": "Okhla Industrial Phase 3", "lat": 28.5308, "lng": 77.2714, "region": "delhi_ncr", "type": "micro", "base_pm25": 380, "bias": 70},
            {"id": "SENS-DEL-05", "name": "Bawana Industrial Cluster", "lat": 28.7951, "lng": 77.0427, "region": "delhi_ncr", "type": "micro", "base_pm25": 410, "bias": 95},
            
            # Punjab Agriculture Stubble Belt
            {"id": "SENS-PUN-01", "name": "Sangrur Paddy Field Node A", "lat": 30.2458, "lng": 75.8420, "region": "punjab_agri", "type": "micro", "base_pm25": 430, "bias": 110},
            {"id": "SENS-PUN-02", "name": "Ludhiana GT Road Bypass", "lat": 30.9010, "lng": 75.8573, "region": "punjab_agri", "type": "micro", "base_pm25": 290, "bias": 30},
            {"id": "SENS-PUN-03", "name": "Patiala Rural Observatory", "lat": 30.3398, "lng": 76.3869, "region": "punjab_agri", "type": "micro", "base_pm25": 360, "bias": 65},
            {"id": "SENS-PUN-04", "name": "PPCB Sangrur City (Macro)", "lat": 30.2512, "lng": 75.8480, "region": "punjab_agri", "type": "macro", "base_pm25": 230, "bias": -60},
            
            # Haryana Industrial Corridor
            {"id": "SENS-HAR-01", "name": "Panipat Dyeing Cluster", "lat": 29.3909, "lng": 76.9635, "region": "haryana_ind", "type": "micro", "base_pm25": 350, "bias": 60},
            {"id": "SENS-HAR-02", "name": "Faridabad Sector 25 Heavy Ind", "lat": 28.3685, "lng": 77.3178, "region": "haryana_ind", "type": "micro", "base_pm25": 390, "bias": 85},
            {"id": "SENS-HAR-03", "name": "Karnal Agri-Highway Grid", "lat": 29.6857, "lng": 76.9905, "region": "haryana_ind", "type": "micro", "base_pm25": 270, "bias": 20},
            
            # Mumbai Metropolitan Region
            {"id": "SENS-MUM-01", "name": "Taloja Chemical Industrial", "lat": 19.0664, "lng": 73.1090, "region": "mumbai_coastal", "type": "micro", "base_pm25": 280, "bias": 55},
            {"id": "SENS-MUM-02", "name": "Deonar Landfill Vicinity", "lat": 19.0558, "lng": 72.9192, "region": "mumbai_coastal", "type": "micro", "base_pm25": 310, "bias": 75},
            {"id": "SENS-MUM-03", "name": "MPCB BKC Station (Macro)", "lat": 19.0668, "lng": 72.8687, "region": "mumbai_coastal", "type": "macro", "base_pm25": 140, "bias": -40},
        ]

    def get_live_sensors(self, region_filter: str = "all") -> List[Dict[str, Any]]:
        elapsed = time.time() - self.start_time
        # Diurnal fluctuation simulation (higher at night/early morning)
        diurnal = 30 * math.sin(elapsed / 20.0)
        
        results = []
        for s in self.sensors:
            if region_filter != "all" and s["region"] != region_filter:
                continue
            
            # Add stochastic micro-spikes for hyper-local sensors
            noise = random.uniform(-12, 12)
            if s["type"] == "micro":
                spike = 40 * math.sin(elapsed / 7.0 + hash(s["id"]) % 10)
            else:
                spike = 10 * math.sin(elapsed / 15.0)

            pm25 = max(15.0, round(s["base_pm25"] + s["bias"] + diurnal + spike + noise, 1))
            pm10 = round(pm25 * random.uniform(1.4, 1.8), 1)
            no2 = round(random.uniform(25.0, 110.0), 1)
            co = round(random.uniform(0.8, 4.5), 2)
            temp = round(24.0 + 4 * math.cos(elapsed / 30.0), 1)
            humidity = round(65.0 + 10 * math.sin(elapsed / 25.0), 1)
            wind_speed = round(4.5 + random.uniform(-1.0, 2.0), 1)
            wind_deg = (315 + int(elapsed * 2) % 360) % 360 # Default North-Westerly

            aqi = self._calculate_aqi(pm25)

            results.append({
                **s,
                "pm25": pm25,
                "pm10": pm10,
                "no2": no2,
                "co": co,
                "temperature": temp,
                "humidity": humidity,
                "wind_speed": wind_speed,
                "wind_direction": wind_deg,
                "aqi": aqi,
                "status": "ALERT" if aqi > 300 else ("WARNING" if aqi > 200 else "NORMAL"),
                "timestamp": int(time.time())
            })

        return results

    def get_satellite_grid(self, region: str = "delhi_ncr") -> Dict[str, Any]:
        """Simulates Sentinel-5P Satellite Aerosol Optical Depth (AOD) & NO2 grid layer."""
        center_lat = 28.6139 if region == "delhi_ncr" else (30.9010 if region == "punjab_agri" else 19.0760)
        center_lng = 77.2090 if region == "delhi_ncr" else (75.8573 if region == "punjab_agri" else 72.8777)
        
        grid_points = []
        for i in range(-5, 6):
            for j in range(-5, 6):
                lat = center_lat + i * 0.05
                lng = center_lng + j * 0.05
                dist = math.sqrt(i**2 + j**2)
                # Simulated satellite AOD value (0.1 to 1.8)
                aod = max(0.12, round(1.4 / (1 + dist * 0.3) + random.uniform(-0.08, 0.08), 2))
                no2_mol = round(aod * 3.8 + random.uniform(0.1, 0.5), 2)
                grid_points.append({
                    "lat": round(lat, 4),
                    "lng": round(lng, 4),
                    "aod": aod,
                    "no2_column": no2_mol,
                    "intensity": min(1.0, aod / 1.5)
                })

        return {
            "region": region,
            "satellite": "Sentinel-5P TROPOMI",
            "overpass_time": "2026-09-30 13:30 IST",
            "resolution": "3.5km x 5.5km",
            "grid_count": len(grid_points),
            "points": grid_points
        }

    def get_3d_particle_vectors(self) -> Dict[str, Any]:
        """Generates 3D vector fields for Three.js particle plume animation."""
        elapsed = time.time() - self.start_time
        wind_angle_rad = math.radians(315) # North-Westerly wind
        wind_speed = 6.8 + math.sin(elapsed / 10.0) * 2.0

        # Generate 12 major 3D emission emitters (sources)
        emitters = [
            {"id": "E1", "name": "Bawana Industrial Stacks", "x": -15, "y": 0, "z": -10, "rate": 85, "color": "#EF4444"},
            {"id": "E2", "name": "Sangrur Crop Stubble Fires", "x": -35, "y": 0, "z": -40, "rate": 140, "color": "#881337"},
            {"id": "E3", "name": "Anand Vihar Transit Hub", "x": 10, "y": 0, "z": 5, "rate": 65, "color": "#F97316"},
            {"id": "E4", "name": "Panipat Dyeing Boiler", "x": -25, "y": 0, "z": -25, "rate": 90, "color": "#DC2626"},
            {"id": "E5", "name": "Taloja Chemical Flare", "x": 40, "y": 0, "z": 45, "rate": 75, "color": "#F59E0B"},
        ]

        return {
            "timestamp": int(time.time()),
            "wind": {
                "vector": [round(math.cos(wind_angle_rad) * wind_speed, 2), 0.8, round(math.sin(wind_angle_rad) * wind_speed, 2)],
                "speed_m_s": round(wind_speed, 1),
                "inversion_layer_m": round(280 + math.sin(elapsed / 15.0) * 60, 0),
                "turbulence_factor": 0.42
            },
            "emitters": emitters
        }

    def _calculate_aqi(self, pm25: float) -> int:
        if pm25 <= 30:
            return int(pm25 * 50 / 30)
        elif pm25 <= 60:
            return int(50 + (pm25 - 30) * 50 / 30)
        elif pm25 <= 90:
            return int(100 + (pm25 - 60) * 100 / 30)
        elif pm25 <= 120:
            return int(200 + (pm25 - 90) * 100 / 30)
        elif pm25 <= 250:
            return int(300 + (pm25 - 120) * 100 / 130)
        else:
            return min(500, int(400 + (pm25 - 250) * 100 / 150))

simulator_instance = EnvironmentalSimulator()
