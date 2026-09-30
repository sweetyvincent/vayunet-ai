"""
VayuNet AI - System Configurations & Regional Datasets
Contains regional metadata for Indian corridors, federated node specifications,
micro-sensor grids, and environmental physics constants.
"""

REGIONAL_NODES = {
    "delhi_ncr": {
        "id": "node_delhi",
        "name": "Delhi-NCR Urban Transport Node",
        "region": "Delhi Metropolitan Region",
        "center_lat": 28.6139,
        "center_lng": 77.2090,
        "primary_sources": ["Vehicular Exhaust", "Construction Dust", "Waste Burning"],
        "sensor_count": 24,
        "client_weight": 0.35,
        "status": "ONLINE"
    },
    "punjab_agri": {
        "id": "node_punjab",
        "name": "Punjab Agricultural Biomass Node",
        "region": "Indo-Gangetic Plain (Sangrur-Ludhiana)",
        "center_lat": 30.9010,
        "center_lng": 75.8573,
        "primary_sources": ["Paddy Stubble Burning", "Biomass Smoke", "Soil Dust"],
        "sensor_count": 18,
        "client_weight": 0.25,
        "status": "ONLINE"
    },
    "haryana_ind": {
        "id": "node_haryana",
        "name": "Haryana Industrial Belt Node",
        "region": "Panipat-Faridabad Corridor",
        "center_lat": 29.3909,
        "center_lng": 76.9635,
        "primary_sources": ["Industrial Stack Emissions", "Coal Boilers", "Heavy Truck Transit"],
        "sensor_count": 16,
        "client_weight": 0.20,
        "status": "ONLINE"
    },
    "mumbai_coastal": {
        "id": "node_mumbai",
        "name": "Mumbai Coastal & Port Node",
        "region": "Mumbai Metropolitan Region",
        "center_lat": 19.0760,
        "center_lng": 72.8777,
        "primary_sources": ["Refinery Flares", "Port Marine Diesel", "Coastal Sea Salt Haze"],
        "sensor_count": 15,
        "client_weight": 0.20,
        "status": "ONLINE"
    }
}

ECONOMIC_CORRIDORS = [
    {
        "id": "delhi_agra",
        "name": "Delhi - Agra Yamuna Expressway Corridor",
        "states": ["Delhi", "Uttar Pradesh"],
        "length_km": 165,
        "key_hotspots": ["Noida Sector 62", "Greater Noida Industrial Zone", "Mathura Refinery Grid"],
        "macro_station_gap_percent": 68
    },
    {
        "id": "gt_road_agri",
        "name": "GT Road Agricultural Stubble Corridor",
        "states": ["Punjab", "Haryana"],
        "length_km": 240,
        "key_hotspots": ["Sangrur Paddy Belt", "Karnal Highway Bypass", "Panipat Industrial Cluster"],
        "macro_station_gap_percent": 82
    },
    {
        "id": "thane_belapur",
        "name": "Thane - Belapur Industrial Belt",
        "states": ["Maharashtra"],
        "length_km": 45,
        "key_hotspots": ["Taloja MIDC", "Rabale Chemical Corridor", "JNPT Shipping Hub"],
        "macro_station_gap_percent": 54
    }
]

AQI_CATEGORY_THRESHOLDS = [
    {"name": "Good", "min": 0, "max": 50, "color": "#10B981"},
    {"name": "Satisfactory", "min": 51, "max": 100, "color": "#84CC16"},
    {"name": "Moderate", "min": 101, "max": 200, "color": "#F59E0B"},
    {"name": "Poor", "min": 201, "max": 300, "color": "#F97316"},
    {"name": "Very Poor", "min": 301, "max": 400, "color": "#EF4444"},
    {"name": "Severe+", "min": 401, "max": 500, "color": "#881337"}
]
