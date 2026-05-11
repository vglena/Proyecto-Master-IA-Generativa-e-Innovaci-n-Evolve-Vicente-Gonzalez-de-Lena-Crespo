import type { TelegramClient } from "./telegram.types.js";
import { TelegramAgentService } from "./telegram.service.js";

interface TelegramBotPollerDependencies {
  telegramClient: TelegramClient;
  telegramAgentService: TelegramAgentService;
  retryDelayMs?: number;
}

export class TelegramBotPoller {
  private nextOffset: number | undefined;
  private running = false;
  private retryTimeout: NodeJS.Timeout | undefined;
  private readonly retryDelayMs: number;

  constructor(private readonly dependencies: TelegramBotPollerDependencies) {
    this.retryDelayMs = dependencies.retryDelayMs ?? 3000;
  }

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    void this.poll();
  }

  stop(): void {
    this.running = false;

    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
    }
  }

  private async poll(): Promise<void> {
    while (this.running) {
      try {
        const updates = await this.dependencies.telegramClient.getUpdates(
          this.nextOffset
        );

        this.updateOffset(updates);
        await this.dependencies.telegramAgentService.handleUpdates(updates);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "error desconocido";

        console.error(`Telegram bot: ${message}`);
        await this.waitBeforeRetry();
      }
    }
  }

  private updateOffset(updates: { update_id: number }[]): void {
    const lastUpdate = updates.at(-1);

    if (lastUpdate) {
      this.nextOffset = lastUpdate.update_id + 1;
    }
  }

  private waitBeforeRetry(): Promise<void> {
    return new Promise((resolve) => {
      this.retryTimeout = setTimeout(resolve, this.retryDelayMs);
    });
  }
}
