"""
VayuNet AI - Federated Learning Network Router
API endpoints for FL node inspection, model weight synchronization, and training rounds.
"""

from fastapi import APIRouter
from services.federated_engine import federated_engine_instance

router = APIRouter(prefix="/api/federated", tags=["Federated Climate Intelligence Network"])

@router.get("/state")
def get_federated_state():
    """Fetch live multi-node federated learning network status, loss curves, and client node weights."""
    return federated_engine_instance.get_federated_state()

@router.post("/trigger-round")
def trigger_training_round():
    """Executes a new Federated Averaging (FedAvg) training round across all regional nodes."""
    return federated_engine_instance.trigger_training_round()
