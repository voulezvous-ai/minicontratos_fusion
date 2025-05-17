import os, time, redis, datetime, uuid
from backend.logline_db import append_log

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
TTL_SEC = int(os.getenv("LINK_TTL_SEC", "7200"))
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def now(): return datetime.datetime.utcnow().isoformat()

while True:
    for key in r.scan_iter("courier_link:*"):
        info = r.hgetall(key)
        created = float(info.get("created_at", "0"))
        if time.time() - created > TTL_SEC:
            tenant = info.get("tenant", "unknown")
            link_id = key.split(":")[1]
            append_log(tenant, {
                "who": "system",
                "did": "expire_link",
                "this": link_id,
                "when": now(),
                "status": "expired",
                "type": "courier_link_event"
            })
            r.delete(key)
    time.sleep(60)
