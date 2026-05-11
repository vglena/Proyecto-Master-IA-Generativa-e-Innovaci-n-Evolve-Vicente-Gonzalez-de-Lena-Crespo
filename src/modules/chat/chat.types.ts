import type { ExpedientePatch } from "../expedientes/expediente.types";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
}

export interface ChatAgentResult {
  text: string;
  expediente?: ExpedientePatch;
  action: "created" | "updated" | "found" | "none";
}
