import { describe, expect, it } from "vitest";
import { parseAgentExpedienteResponse } from "./expediente.parser";

describe("parseAgentExpedienteResponse", () => {
  it("detecta expediente creado y extrae campos principales", () => {
    const result = parseAgentExpedienteResponse(`
      Expediente creado:
      Clave: EXP-0101
      Nombre: Laura
      Apellido: Perez
      Codigo_postal: 28013
      Superficie: 92
      Habitaciones: 3
      Estado: En curso
    `);

    expect(result).toEqual({
      action: "created",
      expediente: {
        clave: "EXP-0101",
        nombre: "Laura",
        apellido: "Perez",
        codigoPostal: "28013",
        superficie: 92,
        habitaciones: 3,
        estado: "En curso"
      }
    });
  });

  it("detecta expediente actualizado con etiquetas con acentos", () => {
    const result = parseAgentExpedienteResponse(`
      Expediente actualizado:
      Clave: EXP-0101
      Teléfono: 600111222
      Fecha entrada: 2026-04-24
    `);

    expect(result.action).toBe("updated");
    expect(result.expediente).toMatchObject({
      clave: "EXP-0101",
      telefono: "600111222",
      fechaEntrada: "2026-04-24"
    });
  });

  it("no devuelve expediente si el texto no contiene clave", () => {
    const result = parseAgentExpedienteResponse("Expediente encontrado: sin datos");

    expect(result).toEqual({ action: "found" });
  });
});
