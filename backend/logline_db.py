import json
import os
from pathlib import Path
from datetime import datetime
from typing import List, Dict

LOG_DIR = Path(__file__).resolve().parent / "logs"
LOG_DIR.mkdir(exist_ok=True)

CANON_FIELDS = [
    "who", "did", "this", "when",
    "confirmed_by", "if_ok", "if_doubt", "if_not",
    "status", "valid", "ghost", "missing"
]

def _logfile(tenant_id: str) -> Path:
    return LOG_DIR / f"logline.{tenant_id}.jsonl"

def append_log(tenant_id: str, log: Dict, ghost: bool = False) -> None:
    """Append a log dict into the tenant's jsonl file, enforcing canonical fields."""
    path = _logfile(tenant_id)
    # Fill missing canonical fields with None/False/[]
    enriched = {k: log.get(k) for k in CANON_FIELDS}
    enriched.update(log)  # allow extra keys, but canonical take precedence
    # defaults
    enriched.setdefault("when", datetime.utcnow().isoformat())
    enriched.setdefault("valid", not ghost)
    enriched.setdefault("ghost", ghost)
    enriched.setdefault("missing", [])
    with path.open("a", encoding="utf-8") as fp:
        fp.write(json.dumps(enriched, ensure_ascii=False) + "\n")

def read_logs(tenant_id: str) -> List[Dict]:
    path = _logfile(tenant_id)
    if not path.exists():
        return []
    logs: List[Dict] = []
    with path.open("r", encoding="utf-8") as fp:
        for line in fp:
            if line.strip():
                try:
                    logs.append(json.loads(line))
                except json.JSONDecodeError:
                    # skip corrupted
                    continue
    return logs
