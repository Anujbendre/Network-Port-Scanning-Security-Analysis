from pydantic import BaseModel
from typing import Optional


class PortResult(BaseModel):
    port: int
    protocol: str
    state: str
    service: str
    version: Optional[str] = None
    risk: str


class Finding(BaseModel):
    id: int
    severity: str
    title: str
    port: int
    protocol: str
    service: str
    description: str
    impact: str
    recommendation: str


class Recommendation(BaseModel):
    id: int
    priority: str
    title: str
    port: int
    service: str
    category: str
    status: str
    action: str
    reason: str