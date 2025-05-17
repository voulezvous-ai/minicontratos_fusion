# backend/app.py

# ⚠️ PATCH DO EVENTLET DEVE VIR ANTES DE TUDO
import eventlet
eventlet.monkey_patch()

import os
from pathlib import Path
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from prometheus_flask_exporter import PrometheusMetrics
import redis
import uuid
import datetime
import json

# Inicializa Flask
app = Flask(__name__)
CORS(app)

# Prometheus depois da app estar pronta
metrics = PrometheusMetrics(app)

# WebSocket
socketio = SocketIO(app, cors_allowed_origins="*")

# Diretório de logs
LOG_DIR = Path("./logs")
LOG_DIR.mkdir(exist_ok=True)

# Redis opcional
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = redis.Redis.from_url(REDIS_URL)

# Helper: valida e salva log
def append_log(tenant_id, log: dict, ghost: bool = False):
    file_path = LOG_DIR / f"logline.{tenant_id}.jsonl"
    log['id'] = str(uuid.uuid4())
    log['when'] = datetime.datetime.utcnow().isoformat()
    log['ghost'] = ghost
    log['valid'] = not ghost
    required = ["who", "did", "this", "when", "confirmed_by", "if_ok", "if_doubt", "if_not", "status"]
    log['missing'] = [k for k in required if k not in log or not log[k]]
    with open(file_path, "a", encoding="utf-8") as f:
        f.write(json.dumps(log, ensure_ascii=False) + "\n")
    return log

# Helper: leitura
def read_logs(tenant_id):
    file_path = LOG_DIR / f"logline.{tenant_id}.jsonl"
    if not file_path.exists():
        return []
    with open(file_path, encoding="utf-8") as f:
        return [json.loads(line) for line in f]

# POST /process_request → registra uma LogLine com campos mínimos
@app.route("/process_request", methods=["POST"])
def process_request():
    data = request.json
    tenant = data.get("tenant_id", "default")
    user = data.get("user_id", "unknown")
    text = data.get("text", "")
    log = {
        "who": user,
        "did": "send_message",
        "this": text,
        "confirmed_by": "system",
        "if_ok": "responder",
        "if_doubt": "aguardar humano",
        "if_not": "descartar",
        "status": "pending"
    }
    ghost = len(text.strip()) < 3
    saved = append_log(tenant, log, ghost=ghost)
    return jsonify(saved)

# GET /logs?tenant_id=abc
@app.route("/logs", methods=["GET"])
def get_logs():
    tenant = request.args.get("tenant_id", "default")
    return jsonify(read_logs(tenant))

# PATCH /logs/<log_id> → atualiza log incompleto
@app.route("/logs/<log_id>", methods=["PATCH"])
def patch_log(log_id):
    tenant = request.args.get("tenant_id", "default")
    logs = read_logs(tenant)
    match = next((l for l in logs if l.get("id") == log_id), None)
    if not match:
        return abort(404, "Log not found")
    updates = request.json or {}
    for k, v in updates.items():
        if k in match:
            match[k] = v
    match["valid"] = True
    match["when"] = datetime.datetime.utcnow().isoformat()
    append_log(tenant, match, ghost=False)
    return jsonify(match)

# Healthcheck
@app.route("/", methods=["GET"])
def health():
    return "FlipApp backend OK"

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
