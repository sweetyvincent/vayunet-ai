"""
VayuNet AI - Spatio-Temporal Wind Advection & AQI Forecaster
Predicts hyper-local AQI corridor spikes for 6h, 12h, 24h, and 48h windows
with interactive scenario simulation sandbox.
"""

import math
import random
from typing import List, Dict, Any

class AQIForecaster:
    def __init__(self):
        pass

    def forecast_corridor(
        self,
        corridor_id: str,
        wind_speed_kmh: float = 12.0,
        wind_direction: str = "NW", # NW, SE, SW, NE
        stubble_fire_intensity: float = 1.0, # Multiplier 0.5x to 3.0x
        traffic_volume_scale: float = 1.0,
        inversion_layer_factor: float = 1.0 # High inversion = low dispersion
    ) -> Dict[str, Any]:
        """Generates 48-hour hourly AQI trajectory predictions under custom physics parameters."""
        
        # Base PM2.5 starting points based on corridor
        if corridor_id == "gt_road_agri":
            base_pm25 = 290.0
            corridor_name = "GT Road Agricultural Stubble Corridor"
        elif corridor_id == "delhi_agra":
            base_pm25 = 260.0
            corridor_name = "Delhi - Agra Yamuna Expressway Corridor"
        else:
            base_pm25 = 220.0
            corridor_name = "Thane - Belapur Industrial Corridor"

        # Wind direction physics modifier
        if wind_direction in ["NW", "N"]:
            wind_mod = 1.25 # Downwind transport from stubble belt to NCR
        elif wind_direction in ["SE", "S"]:
            wind_mod = 0.82 # Disperses inland pollution toward sea/plains
        else:
            wind_mod = 1.0

        # Wind speed dispersion (Higher speed = lower local concentration, higher transport speed)
        dispersion_rate = max(0.4, 15.0 / max(3.0, wind_speed_kmh))

        hourly_timeline = []
        for hour in range(0, 49, 3): # Every 3 hours for 48h
            # Diurnal temperature inversion effect (night hours 21:00 - 06:00 have low inversion layer)
            tod_factor = 1.35 if (hour % 24 >= 20 or hour % 24 <= 6) else 0.85

            # Combine physics drivers
            pm25_predicted = base_pm25 * (
                (stubble_fire_intensity * 0.4 + traffic_volume_scale * 0.3 + 0.3)
                * wind_mod
                * dispersion_rate
                * tod_factor
                * inversion_layer_factor
            ) + random.uniform(-8.0, 8.0)

            pm25_predicted = max(20.0, round(pm25_predicted, 1))
            aqi_predicted = self._pm25_to_aqi(pm25_predicted)

            hourly_timeline.append({
                "hour_offset": hour,
                "label": f"+{hour}h",
                "pm25": pm25_predicted,
                "aqi": aqi_predicted,
                "risk_level": "SEVERE" if aqi_predicted > 350 else ("HIGH" if aqi_predicted > 250 else "MODERATE"),
                "estimated_wind_speed": round(wind_speed_kmh + random.uniform(-1.5, 1.5), 1),
                "inversion_layer_height_m": round(320 * (1.0 / tod_factor), 0)
            })

        # Find peak spike timing
        peak_entry = max(hourly_timeline, key=lambda x: x["aqi"])

        return {
            "corridor_id": corridor_id,
            "corridor_name": corridor_name,
            "scenario_parameters": {
                "wind_speed_kmh": wind_speed_kmh,
                "wind_direction": wind_direction,
                "stubble_fire_multiplier": stubble_fire_intensity,
                "traffic_scale": traffic_volume_scale,
                "inversion_factor": inversion_layer_factor
            },
            "peak_spike": {
                "hour_offset": peak_entry["hour_offset"],
                "peak_aqi": peak_entry["aqi"],
                "peak_pm25": peak_entry["pm25"],
                "alert": f"Critical AQI Spike of {peak_entry['aqi']} predicted in +{peak_entry['hour_offset']} hours along {corridor_name}"
            },
            "timeline": hourly_timeline
        }

    def _pm25_to_aqi(self, pm25: float) -> int:
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

forecaster_instance = AQIForecaster()
