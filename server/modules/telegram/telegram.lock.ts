import { createServer, type Server } from "node:net";

export interface TelegramBotLock {
  release: () => void;
}

export async function acquireTelegramBotLock(
  port = Number(process.env.TELEGRAM_BOT_LOCK_PORT ?? 39201)
): Promise<TelegramBotLock | undefined> {
  const server = createServer();

  return new Promise((resolve, reject) => {
    server.once("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        resolve(undefined);
        return;
      }

      reject(error);
    });

    server.once("listening", () => {
      resolve({
        release: () => releaseServer(server)
      });
    });

    server.listen(port, "127.0.0.1");
  });
}

function releaseServer(server: Server): void {
  if (server.listening) {
    server.close();
  }
}
