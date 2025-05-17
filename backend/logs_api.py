from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from .logline_db import append_log, read_logs, CANON_FIELDS

app = FastAPI(title="FlipApp Logs API")

class LogLine(BaseModel):
    who: str
    did: str
    this: str
    when: str
    confirmed_by: Optional[str] = None
    if_ok: Optional[str] = None
    if_doubt: Optional[str] = None
    if_not: Optional[str] = None
    status: Optional[str] = None
    valid: bool = False
    ghost: bool = False
    missing: List[str] = []

@app.get("/logs")
async def get_logs(tenant_id: str):
    """Return all log lines for tenant."""
    return read_logs(tenant_id)

class PatchRequest(BaseModel):
    updates: dict

@app.patch("/logs/{log_id}")
async def patch_log(log_id: str, req: PatchRequest, tenant_id: str):
    """Complete a ghost log by adding missing fields.
    Adds new log line version with valid=true."""
    logs = read_logs(tenant_id)
    original = None
    for l in logs:
        if l.get("id") == log_id:
            original = l
            break
    if original is None:
        raise HTTPException(404, "Log not found")
    # merge
    updated = {**original, **req.updates}
    # recompute missing
    updated["missing"] = [f for f in CANON_FIELDS if updated.get(f) in (None, "", []) and f not in ("ghost", "valid", "missing")]
    updated["valid"] = True
    updated["ghost"] = False
    updated["when"] = datetime.utcnow().isoformat()
    append_log(tenant_id, updated, ghost=False)
    return {"status": "ok", "log": updated}
