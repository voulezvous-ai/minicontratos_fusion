import datetime, uuid, os
import redis
from fastapi import APIRouter, Body, HTTPException
from .logline_db import append_log

router = APIRouter(prefix="/delivery", tags=["delivery"])

REDIS = redis.Redis.from_url(os.getenv("REDIS_URL", "redis://localhost:6379/0"), decode_responses=True)

def now():
    return datetime.datetime.utcnow().isoformat()

@router.post("/create_link")
def create_link(payload: dict = Body(...)):
    order_id  = payload["order_id"]
    tenant_id = payload["tenant_id"]
    user_id   = payload["user_id"]

    link_id = uuid.uuid4().hex[:12]
    REDIS.hset(f"courier_link:{link_id}", mapping={
        "order": order_id,
        "tenant": tenant_id,
        "courier": user_id,
        "status": "pending",
        "created_at": datetime.datetime.utcnow().timestamp()
    })

    append_log(tenant_id, {
        "who": user_id,
        "did": "create_link",
        "this": link_id,
        "when": now(),
        "status": "pending",
        "type": "courier_link_event"
    })

    return {"url": f"https://voulezvous.app/link/{link_id}", "link_id": link_id}

@router.post("/status")
def update_status(payload: dict = Body(...)):
    link_id   = payload["link_id"]
    tenant    = payload["tenant_id"]
    status    = payload["status"]           # collected|delivered
    actor     = payload["actor"]            # courier|system

    key = f"courier_link:{link_id}"
    if not REDIS.exists(key):
        raise HTTPException(404, "link not found")
    REDIS.hset(key, "status", status)

    append_log(tenant, {
        "who": actor,
        "did": "collect_package" if status == "collected" else "deliver_package",
        "this": link_id,
        "when": now(),
        "status": status,
        "type": "courier_link_event"
    })
    return {"ok": True}
