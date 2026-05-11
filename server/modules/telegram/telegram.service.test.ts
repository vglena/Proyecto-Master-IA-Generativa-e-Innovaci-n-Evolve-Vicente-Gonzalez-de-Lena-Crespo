import { describe, expect, it, vi } from "vitest";
import type { AgentClient, AgentResponse } from "../chat/chat.types";
import { TelegramAgentService } from "./telegram.service";
import type { TelegramClient, TelegramUpdate } from "./telegram.types";

function createTelegramService({
  agentResponse,
  agentResponses,
  agentError
}: {
  agentResponse?: AgentResponse;
  agentResponses?: AgentResponse[];
  agentError?: Error;
} = {}) {
  const pendingAgentResponses = [...(agentResponses ?? [])];
  const telegramClient: TelegramClient = {
    getUpdates: vi.fn(),
    sendChatAction: vi.fn(),
    sendMessage: vi.fn()
  };
  const agentClient: AgentClient = {
    sendMessage: vi.fn(async () => {
      if (agentError) {
        throw agentError;
      }

      const nextResponse = pendingAgentResponses.shift();

      if (nextResponse) {
        return nextResponse;
      }

      return agentResponse ?? { text: "Respuesta del agente", raw: {} };
    })
  };

  return {
    agentClient,
    telegramClient,
    service: new TelegramAgentService({ agentClient, telegramClient })
  };
}

function createTextUpdate(text: string): TelegramUpdate {
  return {
    update_id: 10,
    message: {
      message_id: 20,
      chat: {
        id: 123,
        type: "private"
      },
      text
    }
  };
}

describe("TelegramAgentService", () => {
  it("envia consultas de texto al agente usando una sesion por chat", async () => {
    const { agentClient, telegramClient, service } = createTelegramService();

    await service.handleUpdates([createTextUpdate("  Busca expedientes abiertos  ")]);

    expect(agentClient.sendMessage).toHaveBeenCalledWith({
      chatInput: "Busca expedientes abiertos",
      sessionId: "telegram:123"
    });
    expect(telegramClient.sendMessage).toHaveBeenCalledWith(
      123,
      "Respuesta del agente"
    );
  });

  it("recuerda el ultimo expediente mencionado en el mismo chat", async () => {
    const { agentClient, service } = createTelegramService({
      agentResponse: {
        text: "Expediente encontrado:\nClave: EXP-0090",
        raw: {}
      }
    });

    await service.handleUpdates([createTextUpdate("Dame los datos del EXP-0090")]);
    await service.handleUpdates([createTextUpdate("Cambia el estado a facturado")]);

    expect(agentClient.sendMessage).toHaveBeenLastCalledWith({
      chatInput: "Cambia el estado a facturado",
      sessionId: "telegram:123",
      selectedExpedienteClave: "EXP-0090"
    });
  });

  it("verifica con una lectura posterior cuando actualiza un expediente", async () => {
    const { agentClient, telegramClient, service } = createTelegramService({
      agentResponses: [
        {
          text: "Expediente actualizado:\n\nClave: EXP-0090\nEstado: Facturado",
          raw: {}
        },
        {
          text: "Expediente encontrado:\n\nClave: EXP-0090\nEstado: Facturado",
          raw: {}
        }
      ]
    });

    await service.handleUpdates([createTextUpdate("Cambia el estado a facturado")]);

    expect(agentClient.sendMessage).toHaveBeenNthCalledWith(2, {
      chatInput: "Dame los datos actualizados del EXP-0090",
      sessionId: "telegram:123",
      selectedExpedienteClave: "EXP-0090"
    });
    expect(telegramClient.sendMessage).toHaveBeenCalledWith(
      123,
      [
        "Expediente actualizado:\n\nClave: EXP-0090\nEstado: Facturado",
        "",
        "Verificacion despues de actualizar:",
        "Expediente encontrado:\n\nClave: EXP-0090\nEstado: Facturado"
      ].join("\n")
    );
  });

  it("responde ayuda sin llamar al agente", async () => {
    const { agentClient, telegramClient, service } = createTelegramService();

    await service.handleUpdates([createTextUpdate("/start")]);

    expect(agentClient.sendMessage).not.toHaveBeenCalled();
    expect(telegramClient.sendMessage).toHaveBeenCalledWith(
      123,
      [
        "Hola, soy DB Consult Bot.",
        "",
        "Puedo buscar expedientes y ayudarte a actualizar datos en la base.",
        "Si acabas de consultar un expediente, recordare esa clave en este chat para que puedas decir cosas como:",
        "",
        "\"cambia el estado a facturado\""
      ].join("\n")
    );
  });

  it("muestra que esta escribiendo mientras consulta al agente", async () => {
    const { telegramClient, service } = createTelegramService();

    await service.handleUpdates([createTextUpdate("Busca EXP-0090")]);

    expect(telegramClient.sendChatAction).toHaveBeenCalledWith(123, "typing");
  });

  it("notifica errores esperables del agente", async () => {
    const { telegramClient, service } = createTelegramService({
      agentError: new Error("n8n no disponible")
    });

    await service.handleUpdates([createTextUpdate("Consulta clientes")]);

    expect(telegramClient.sendMessage).toHaveBeenCalledWith(
      123,
      "No pude consultar el agente ahora mismo: n8n no disponible"
    );
  });
});
