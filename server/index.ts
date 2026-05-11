import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createChatRouter } from "./modules/chat/chat.routes.js";
import { N8nAgentClient } from "./modules/chat/n8n-agent.client.js";
import { TelegramHttpClient } from "./modules/telegram/telegram.client.js";
import { readTelegramBotConfig } from "./modules/telegram/telegram.config.js";
import { acquireTelegramBotLock } from "./modules/telegram/telegram.lock.js";
import { TelegramBotPoller } from "./modules/telegram/telegram.poller.js";
import { TelegramAgentService } from "./modules/telegram/telegram.service.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 3001);
const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
const agentClient = new N8nAgentClient(n8nWebhookUrl);
const telegramBotConfig = readTelegramBotConfig(process.env);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use(
  "/api/chat",
  createChatRouter({
    agentClient
  })
);

app.use(
  (
    error: unknown,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction
  ) => {
    const message =
      error instanceof Error ? error.message : "Error inesperado del servidor";

    response.status(500).json({ error: message });
  }
);

app.listen(port, () => {
  console.log(`CRM Tasaciones API escuchando en http://localhost:${port}`);
});

void startTelegramBot();

async function startTelegramBot(): Promise<void> {
  if (!telegramBotConfig.enabled || !telegramBotConfig.token) {
    console.log("Bot de Telegram desactivado: falta TELEGRAM_BOT_TOKEN.");
    return;
  }

  const botLock = await acquireTelegramBotLock();

  if (!botLock) {
    console.log(
      "Bot de Telegram no iniciado: ya hay otra instancia local usando el lock."
    );
    return;
  }

  const telegramClient = new TelegramHttpClient(telegramBotConfig.token);
  const telegramAgentService = new TelegramAgentService({
    agentClient,
    telegramClient
  });
  const telegramBotPoller = new TelegramBotPoller({
    telegramClient,
    telegramAgentService
  });

  telegramBotPoller.start();
  console.log("Bot de Telegram conectado por long polling.");

  let isTelegramBotStopped = false;
  const stopTelegramBot = () => {
    if (isTelegramBotStopped) {
      return;
    }

    isTelegramBotStopped = true;
    telegramBotPoller.stop();
    botLock.release();
  };

  process.once("SIGINT", () => {
    stopTelegramBot();
    process.exit(0);
  });
  process.once("SIGTERM", () => {
    stopTelegramBot();
    process.exit(0);
  });
  process.once("exit", stopTelegramBot);
}
