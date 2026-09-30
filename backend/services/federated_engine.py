"""
VayuNet AI - Privacy-Preserving Federated Learning Engine
Orchestrates multi-region model training (FedAvg) across regional nodes (Delhi, Punjab,
Haryana, Mumbai) without centralizing sensitive raw citizen or micro-sensor data.
"""

import time
import math
import random
from typing import Dict, List, Any
from config import REGIONAL_NODES

class FederatedLearningEngine:
    def __init__(self):
        self.current_round = 12
        self.total_rounds_target = 50
        self.global_loss = 0.042
        self.global_mae_aqi = 8.4
        self.rounds_history = []
        self._init_mock_history()

    def _init_mock_history(self):
        """Pre-populates round history for rounds 1 to 12 for dashboard initialization."""
        base_loss = 0.285
        base_mae = 34.2
        for r in range(1, 13):
            decay = math.exp(-0.18 * r)
            loss = round(base_loss * decay + random.uniform(0.002, 0.008), 4)
            mae = round(base_mae * decay + random.uniform(0.5, 1.5), 2)
            self.rounds_history.append({
                "round": r,
                "global_loss": loss,
                "global_mae": mae,
                "active_clients": 4,
                "timestamp": int(time.time()) - (13 - r) * 300
            })
        self.global_loss = self.rounds_history[-1]["global_loss"]
        self.global_mae_aqi = self.rounds_history[-1]["global_mae"]

    def get_federated_state(self) -> Dict[str, Any]:
        """Returns the current state of all client nodes and global model parameters."""
        nodes = []
        for key, node_cfg in REGIONAL_NODES.items():
            # Local client metrics
            local_loss = round(self.global_loss * (1.0 + random.uniform(-0.15, 0.20)), 4)
            data_points = node_cfg["sensor_count"] * 1440 # Simulated daily sensor readings
            
            nodes.append({
                "node_id": node_cfg["id"],
                "node_name": node_cfg["name"],
                "region": node_cfg["region"],
                "primary_sources": node_cfg["primary_sources"],
                "sensor_count": node_cfg["sensor_count"],
                "client_weight": node_cfg["client_weight"],
                "local_sample_count": data_points,
                "local_loss": local_loss,
                "model_version": f"v2.4-R{self.current_round}",
                "privacy_guarantee": "Differential Privacy (ε=1.2, δ=1e-5)",
                "status": node_cfg["status"],
                "last_gradient_sync": "12 seconds ago"
            })

        return {
            "current_round": self.current_round,
            "target_rounds": self.total_rounds_target,
            "global_loss": self.global_loss,
            "global_mae_aqi": self.global_mae_aqi,
            "aggregation_algorithm": "FedAvg + Differential Privacy Noise",
            "active_nodes_count": len(nodes),
            "nodes": nodes,
            "round_history": self.rounds_history
        }

    def trigger_training_round(self) -> Dict[str, Any]:
        """Simulates executing a new Federated Learning round across all 4 regional nodes."""
        self.current_round += 1
        
        # Calculate new decayed loss & MAE
        decay = math.exp(-0.16 * self.current_round)
        new_loss = round(max(0.015, 0.285 * decay + random.uniform(0.001, 0.005)), 4)
        new_mae = round(max(3.1, 34.2 * decay + random.uniform(0.3, 0.9)), 2)

        self.global_loss = new_loss
        self.global_mae_aqi = new_mae

        round_entry = {
            "round": self.current_round,
            "global_loss": new_loss,
            "global_mae": new_mae,
            "active_clients": 4,
            "timestamp": int(time.time())
        }
        self.rounds_history.append(round_entry)

        # Generate simulated gradient update payloads
        client_updates = []
        for key, n in REGIONAL_NODES.items():
            grad_norm = round(random.uniform(0.041, 0.098), 4)
            client_updates.append({
                "node_id": n["id"],
                "node_name": n["name"],
                "gradient_norm": grad_norm,
                "weight_delta_summary": f"Δw_norm={grad_norm}",
                "privacy_budget_used": "ε += 0.05"
            })

        return {
            "success": True,
            "message": f"Federated Round #{self.current_round} Aggregation Completed Successfully.",
            "new_round": self.current_round,
            "updated_global_loss": new_loss,
            "updated_global_mae": new_mae,
            "client_gradient_updates": client_updates,
            "federated_state": self.get_federated_state()
        }

federated_engine_instance = FederatedLearningEngine()
