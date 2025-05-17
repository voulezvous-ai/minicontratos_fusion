from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, emit
import uuid, os, openai, datetime

FRONT_ORIGIN = os.getenv("FRONT_ORIGIN", "http://localhost:3000")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialise Flask & SocketIO
app = Flask(__name__)
CORS(app, resources={r"*": {"origins": FRONT_ORIGIN}})
socketio = SocketIO(app, cors_allowed_origins=FRONT_ORIGIN)

# Helper to talk to OpenAI (if available)
def ask_llm(messages, model="gpt-4o-mini"):
    if not OPENAI_API_KEY:
        return "LLM indisponível."
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    resp = client.chat.completions.create(model=model, messages=messages)
    return resp.choices[0].message.content

# ─────────── REST endpoints ─────────── #

@app.post("/process_request")
def process_request():
    data = request.json or {}
    resp = {
        "id": str(uuid.uuid4())[:8],
        "valid": True,
        "ghost": False,
        "missing": []
    }

    # Quando a origem for o módulo 'messages', invoca o LLM central
    if data.get("channel") == "messages":
        llm_answer = ask_llm([
            { "role": "system", "content": "Você é um atendente virtual da VoulezVous." },
            { "role": "user",   "content": data.get("text", "") }
        ])
        resp["assistant_text"] = llm_answer

        # Opcional: envia a mensagem do assistente para todos no canal via WS
        socketio.emit(
            "message",
            {
                "t": "message",
                "tenant": data.get("tenant_id"),
                "channel": data.get("channel"),
                "user": "assistant",
                "payload": { "text": llm_answer, "ts": datetime.datetime.utcnow().isoformat() }
            },
            to=f"{data.get('tenant_id')}:{data.get('channel')}",
            namespace="/mcp"
        )

    return jsonify(resp)

@app.get("/channels/<tenant_id>")
def list_channels(tenant_id):
    return jsonify([
        {"id": "general",  "name": "Geral"},
        {"id": "support",  "name": "Suporte"},
        {"id": "marketing","name": "Marketing"}
    ])

@app.get("/timeline/<tenant_id>/<user_id>")
def timeline(tenant_id, user_id):
    return jsonify([
        {"id": "1", "title": "Assinatura Pro", "subtitle": "15 Mai 2025", "amount": "€19,90"},
        {"id": "2", "title": "Cashback",       "subtitle": "12 Mai 2025", "amount": "€-4,50"},
    ])

@app.post("/llm/chat")
def llm_chat():
    body = request.json or {}
    if not OPENAI_API_KEY:
        return jsonify({"error": "OPENAI_API_KEY not set"}), 500
    answer = ask_llm(body.get("messages", []), body.get("model", "gpt-4o-mini"))
    return jsonify({"role": "assistant", "content": answer})

# ───────── WebSocket MCP ───────── #
@socketio.on("connect", namespace="/mcp")
def mcp_connect():
    tenant = request.args.get("tenant")
    channel = request.args.get("channel")
    join_room(f"{tenant}:{channel}")

@socketio.on("message", namespace="/mcp")
def mcp_message(msg):
    room = f"{msg.get('tenant')}:{msg.get('channel')}"
    emit("message", msg, to=room)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=8000, debug=True)
