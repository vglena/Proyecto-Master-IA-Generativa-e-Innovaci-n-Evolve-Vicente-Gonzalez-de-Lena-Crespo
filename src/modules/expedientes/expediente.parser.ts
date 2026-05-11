import type { ExpedientePatch } from "./expediente.types";

export type AgentExpedienteAction = "created" | "updated" | "found" | "none";

export interface ParsedAgentResponse {
  action: AgentExpedienteAction;
  expediente?: ExpedientePatch;
}

const fieldMap: Record<string, keyof ExpedientePatch> = {
  clave: "clave",
  nombre: "nombre",
  apellido: "apellido",
  telefono: "telefono",
  email: "email",
  direccion: "direccion",
  municipio: "municipio",
  codigo_postal: "codigoPostal",
  codigopostal: "codigoPostal",
  inmueble: "inmueble",
  superficie: "superficie",
  habitaciones: "habitaciones",
  finalidad: "finalidad",
  estado: "estado",
  fecha_entrada: "fechaEntrada",
  fechaentrada: "fechaEntrada"
};

const numericFields = new Set<keyof ExpedientePatch>(["superficie", "habitaciones"]);

export function parseAgentExpedienteResponse(text: string): ParsedAgentResponse {
  const action = getAgentAction(text);
  const expediente = parseExpedienteFields(text);

  if (action === "none" || !expediente?.clave) {
    return { action };
  }

  return { action, expediente };
}

function getAgentAction(text: string): AgentExpedienteAction {
  const normalizedText = normalizeText(text);

  if (normalizedText.includes("expediente creado")) {
    return "created";
  }

  if (normalizedText.includes("expediente actualizado")) {
    return "updated";
  }

  if (normalizedText.includes("expediente encontrado")) {
    return "found";
  }

  return "none";
}

function parseExpedienteFields(text: string): ExpedientePatch | undefined {
  const expediente: Partial<ExpedientePatch> = {};
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    const match = line.match(/^\s*[-*]?\s*([^:]+):\s*(.+?)\s*$/);

    if (!match) {
      continue;
    }

    const [, rawLabel, rawValue] = match;
    const mappedField = fieldMap[normalizeFieldLabel(rawLabel)];

    if (!mappedField) {
      continue;
    }

    expediente[mappedField] = parseFieldValue(mappedField, rawValue) as never;
  }

  return expediente.clave ? (expediente as ExpedientePatch) : undefined;
}

function parseFieldValue(field: keyof ExpedientePatch, rawValue: string): string | number {
  const value = rawValue.trim();

  if (!numericFields.has(field)) {
    return value;
  }

  const normalizedNumber = Number(value.replace(",", ".").replace(/[^\d.]/g, ""));

  return Number.isFinite(normalizedNumber) ? normalizedNumber : value;
}

function normalizeFieldLabel(label: string): string {
  return normalizeText(label).replace(/\s+/g, "_");
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}
