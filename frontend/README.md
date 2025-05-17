# Flip App

Monorepo Next.js + TypeScript que reúne Chat, Mensagens estilo WhatsApp e Timeline estilo Apple Wallet.

## Scripts

```bash
npm install
npm run dev
```

## Estrutura

- **/apps** – micro‑frontends (`/chat`, `/messages`, `/timeline`)
- **/components** – compartilhados
- **/lib** – chamadas de API
- **/state** – store global com Zustand
- **/styles** – CSS/Tailwind globais

## Variáveis de ambiente

Padrão em `.env.local`:

```text
NEXT_PUBLIC_TENANT_ID=voulezvous
NEXT_PUBLIC_USER_ID=danvoulez
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

## Endpoints do backend

- `POST /process_request` → `{ id, valid, ghost, missing }`

## Critérios de aceitação

1. Rota `/chat` renderiza Chat UI.
2. Rota `/messages` renderiza WhatsApp‑like.
3. Rota `/timeline` renderiza cartões Flip.
4. Sem dependências de Firebase, Supabase, Expo ou OpenAI.
5. Estado global unificado via Zustand.

---
_Gerado automaticamente – revise TODOs indicados no código antes de produzir build._


## Testes

- **Unitários (Jest)**  
  ```bash
  npm test
  ```
- **E2E (Playwright)**  
  ```bash
  npm run test:e2e
  ```

> O primeiro `npm run test:e2e` executará `npx playwright install` se os browsers ainda não estiverem instalados.

## CI

O workflow GitHub Actions em `.github/workflows/ci.yml` executa:
1. Lint  
2. Unit tests  
3. E2E tests (Playwright)  
4. Build Next.js

## Auditoria de Acessibilidade

- **jest-axe** incluído; exemplo em `__tests__/a11y.test.tsx`.  
- É possível integrar `axe-core` também nos testes Playwright futuramente.
