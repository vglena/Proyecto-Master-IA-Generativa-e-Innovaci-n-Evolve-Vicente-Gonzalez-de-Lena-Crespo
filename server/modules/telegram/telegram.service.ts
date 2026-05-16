import type { AgentClient } from "../chat/chat.types.js";
import type {
  TelegramClient,
  TelegramMessage,
  TelegramUpdate
} from "./telegram.types.js";

interface TelegramAgentServiceDependencies {
  agentClient: AgentClient;
  telegramClient: TelegramClient;
}

export class TelegramAgentService {
  private readonly selectedExpedienteClaveByChatId = new Map<number, string>();

  constructor(private readonly dependencies: TelegramAgentServiceDependencies) {}

  async handleUpdates(updates: TelegramUpdate[]): Promise<void> {
    for (const update of updates) {
      await this.handleUpdate(update);
    }
  }

  private async handleUpdate(update: TelegramUpdate): Promise<void> {
    const message = update.message;

    if (!message) {
      return;
    }

    const userMessage = parseTelegramMessage(message);

    if (!userMessage) {
      await this.dependencies.telegramClient.sendMessage(
        message.chat.id,
        "Enviame una consulta de texto para preguntarle al agente."
      );
      return;
    }

    if (isHelpCommand(userMessage)) {
      await this.dependencies.telegramClient.sendMessage(
        message.chat.id,
        createWelcomeMessage()
      );
      return;
    }

    try {
      const explicitExpedienteClave = findExpedienteClave(userMessage);
      const selectedExpedienteClave =
        explicitExpedienteClave ??
        this.selectedExpedienteClaveByChatId.get(message.chat.id);
      const stopTyping = this.startTypingIndicator(message.chat.id);
      try {
        const agentResponse = await this.dependencies.agentClient.sendMessage({
          chatInput: userMessage,
          sessionId: createTelegramSessionId(message.chat.id),
          ...(selectedExpedienteClave ? { selectedExpedienteClave } : {})
        });

        const responseExpedienteClave = findExpedienteClave(agentResponse.text);
        const nextExpedienteClave =
          responseExpedienteClave ?? explicitExpedienteClave;
        const replyText =
          isExpedienteUpdateResponse(agentResponse.text) && nextExpedienteClave
            ? await this.createVerifiedUpdateReply({
                chatId: message.chat.id,
                updateResponseText: agentResponse.text,
                expedienteClave: nextExpedienteClave
              })
            : isExpedienteCreationResponse(agentResponse.text) && nextExpedienteClave
            ? await this.createVerifiedCreationReply({
                chatId: message.chat.id,
                creationResponseText: agentResponse.text,
                expedienteClave: nextExpedienteClave
              })
            : agentResponse.text;

        if (nextExpedienteClave) {
          this.selectedExpedienteClaveByChatId.set(
            message.chat.id,
            nextExpedienteClave
          );
        }

        await this.dependencies.telegramClient.sendMessage(
          message.chat.id,
          replyText
        );
      } finally {
        stopTyping();
      }
    } catch (error) {
      await this.dependencies.telegramClient.sendMessage(
        message.chat.id,
        createAgentErrorMessage(error)
      );
    }
  }

  private startTypingIndicator(chatId: number): () => void {
    void this.dependencies.telegramClient.sendChatAction(chatId, "typing");

    const typingInterval = setInterval(() => {
      void this.dependencies.telegramClient.sendChatAction(chatId, "typing");
    }, 4000);

    return () => {
      clearInterval(typingInterval);
    };
  }

  private async createVerifiedCreationReply({
    chatId,
    creationResponseText,
    expedienteClave
  }: {
    chatId: number;
    creationResponseText: string;
    expedienteClave: string;
  }): Promise<string> {
    try {
      const verificationResponse = await this.dependencies.agentClient.sendMessage({
        chatInput: `Dame los datos del ${expedienteClave}`,
        sessionId: createTelegramSessionId(chatId),
        selectedExpedienteClave: expedienteClave
      });

      return [
        creationResponseText,
        "",
        "Verificacion despues de crear:",
        verificationResponse.text
      ].join("\n");
    } catch (error) {
      return [
        creationResponseText,
        "",
        createVerificationErrorMessage(error)
      ].join("\n");
    }
  }

  private async createVerifiedUpdateReply({
    chatId,
    updateResponseText,
    expedienteClave
  }: {
    chatId: number;
    updateResponseText: string;
    expedienteClave: string;
  }): Promise<string> {
    try {
      const verificationResponse = await this.dependencies.agentClient.sendMessage({
        chatInput: `Dame los datos actualizados del ${expedienteClave}`,
        sessionId: createTelegramSessionId(chatId),
        selectedExpedienteClave: expedienteClave
      });

      return [
        updateResponseText,
        "",
        "Verificacion despues de actualizar:",
        verificationResponse.text
      ].join("\n");
    } catch (error) {
      return [
        updateResponseText,
        "",
        createVerificationErrorMessage(error)
      ].join("\n");
    }
  }
}

function parseTelegramMessage(message: TelegramMessage): string {
  return typeof message.text === "string" ? message.text.trim() : "";
}

function isHelpCommand(message: string): boolean {
  return message === "/start" || message === "/help";
}

function createWelcomeMessage(): string {
  return [
    "Hola, soy DB Consult Bot.",
    "",
    "Puedo buscar, crear y actualizar expedientes en la base de datos.",
    "Si acabas de consultar un expediente, recordare esa clave en este chat para que puedas decir cosas como:",
    "",
    "\"cambia el estado a facturado\""
  ].join("\n");
}

function isExpedienteUpdateResponse(text: string): boolean {
  return normalizeText(text).includes("expediente actualizado");
}

function isExpedienteCreationResponse(text: string): boolean {
  return normalizeText(text).includes("expediente creado");
}

function findExpedienteClave(text: string): string | undefined {
  return text.match(/\bEXP-\d{4,}\b/i)?.[0].toUpperCase();
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function createTelegramSessionId(chatId: number): string {
  return `telegram:${chatId}`;
}

function createAgentErrorMessage(error: unknown): string {
  const detail = error instanceof Error ? error.message : "error desconocido";

  return `No pude consultar el agente ahora mismo: ${detail}`;
}

function createVerificationErrorMessage(error: unknown): string {
  const detail = error instanceof Error ? error.message : "error desconocido";

  return `No pude verificar la lectura posterior: ${detail}`;
}
