import type {
  TelegramChatAction,
  TelegramClient,
  TelegramUpdate
} from "./telegram.types.js";

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

export class TelegramHttpClient implements TelegramClient {
  private readonly apiBaseUrl: string;

  constructor(
    token: string,
    private readonly longPollingTimeoutSeconds = 25
  ) {
    this.apiBaseUrl = `https://api.telegram.org/bot${token}`;
  }

  async getUpdates(offset?: number): Promise<TelegramUpdate[]> {
    const params = new URLSearchParams({
      timeout: String(this.longPollingTimeoutSeconds),
      allowed_updates: JSON.stringify(["message"])
    });

    if (offset !== undefined) {
      params.set("offset", String(offset));
    }

    const response = await this.callTelegram<TelegramUpdate[]>(
      `getUpdates?${params.toString()}`
    );

    return response;
  }

  async sendMessage(chatId: number, text: string): Promise<void> {
    await this.callTelegram("sendMessage", {
      chat_id: chatId,
      text: limitTelegramMessage(text)
    });
  }

  async sendChatAction(chatId: number, action: TelegramChatAction): Promise<void> {
    await this.callTelegram("sendChatAction", {
      chat_id: chatId,
      action
    });
  }

  private async callTelegram<T>(method: string, body?: object): Promise<T> {
    const response = await fetch(`${this.apiBaseUrl}/${method}`, {
      method: body ? "POST" : "GET",
      headers: body
        ? {
            "Content-Type": "application/json"
          }
        : undefined,
      body: body ? JSON.stringify(body) : undefined
    });

    const payload = (await response.json()) as TelegramApiResponse<T>;

    if (!response.ok || !payload.ok || payload.result === undefined) {
      throw new Error(
        payload.description ?? `Telegram respondio con estado ${response.status}.`
      );
    }

    return payload.result;
  }
}

function limitTelegramMessage(text: string): string {
  const trimmedText = text.trim();
  const fallbackText = trimmedText || "No tengo una respuesta para mostrar.";

  return fallbackText.length <= 4096
    ? fallbackText
    : `${fallbackText.slice(0, 4093)}...`;
}
