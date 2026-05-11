# CRM Tasaciones AI

A web application that combines real estate appraisal case management (expedientes) with an AI-powered chat assistant connected to an n8n workflow agent.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js (Node.js) + TypeScript
- **AI integration:** n8n webhook agent
- **Messaging integration:** Telegram Bot API via long polling
- **State management:** Zustand

## Features

- AI chat panel powered by an n8n agent
- Telegram bot bridge for asking the same n8n agent from Telegram
- Expediente (case file) sidebar and detail view
- Resizable split-panel layout (desktop and mobile)
- Session-based conversation tracking

## Project structure

```
src/
  modules/
    app/          # Root layout and panel orchestration
    chat/         # Chat UI, store, API client, session logic
    expedientes/  # Case file list, detail view and parser
server/
  modules/
    chat/         # Express routes, controller, n8n client, validation
    telegram/     # Telegram API client, bot poller and agent orchestration
```

## Getting started

### Prerequisites

- Node.js 20+
- An n8n instance with a webhook-based agent workflow

### Environment variables

Create a `.env` file in the project root:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
PORT=3001
TELEGRAM_BOT_TOKEN=replace-with-a-new-token-from-botfather
TELEGRAM_BOT_ENABLED=true
```

`TELEGRAM_BOT_TOKEN` is optional. If it is missing, the web app and Express API
still start normally and the Telegram bot stays disabled. Set
`TELEGRAM_BOT_ENABLED=false` to keep the token configured but avoid starting the
bot locally.

### Install dependencies

```bash
npm install
```

### Run in development

Starts both the Vite dev server (port 5173) and the Express API server (port 3001) concurrently:

```bash
npm run dev
```

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
```

Transpiles the server with `tsc` and bundles the client with Vite. Output goes to `dist/` (client) and `dist-server/` (server).

### Start production server

```bash
npm start
```

## Architecture notes

The project follows MVC separation:

- **View layer** — React components in `src/modules/`
- **Store / controller layer** — Zustand store (`chat.store.ts`) and Express controllers
- **Service / DAO layer** — `n8n-agent.client.ts` isolates all external agent communication; `telegram.service.ts` orchestrates Telegram messages without knowing HTTP details; `chat.validation.ts` handles input validation at the API boundary

Server Actions are not used here because the backend is a standalone Express server decoupled from the Next.js paradigm, making Route Handler–style endpoints the appropriate choice for the AI proxy endpoint.
