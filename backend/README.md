# Flip Backend (Flask)

Mini‑servidor Flask que atende o Flip App.

## Rotas REST

| Verbo | Path | Descrição |
|-------|------|-----------|
| POST  | /process_request | Recebe texto e devolve `{id, valid, ghost, missing}` |
| GET   | /channels/<tenant_id> | Lista canais |
| GET   | /timeline/<tenant_id>/<user_id> | Lista itens de timeline |
| POST  | /llm/chat | Proxy ao modelo LLM OpenAI |

## WebSocket

`ws://localhost:8000/mcp?tenant=xxx&channel=yyy` (namespace `/mcp`)

Mensagem JSON (MCP):

```json
{
  "t": "message",
  "tenant": "voulezvous",
  "channel": "support",
  "user": "danvoulez",
  "payload": { "text": "Olá!" }
}
```

## Uso

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
export $(cat .env | xargs)   # ajuste API key
python app.py
```

Servidor sobe em `http://localhost:8000`.

## Produção

```bash
gunicorn -k eventlet -w 1 app:app --bind 0.0.0.0:8000
```


## LLM automático no canal Messages

- Quando uma mensagem chega com `channel="messages"` em `/process_request`,
  o servidor chama OpenAI para gerar uma resposta e:
    1. devolve `assistant_text` na resposta HTTP.
    2. publica a mesma resposta via WebSocket MCP para todos no canal.
- FRONT já deve adicionar a bolha ao receber `assistant_text` ou evento WS.
