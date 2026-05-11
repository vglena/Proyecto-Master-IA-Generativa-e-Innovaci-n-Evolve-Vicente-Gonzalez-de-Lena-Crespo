import { useCrmStore } from "../chat/chat.store";
import type { Expediente } from "./expediente.types";

export function ExpedienteSidebar() {
  const expedientes = useCrmStore((state) => state.expedientes);
  const selectedExpedienteClave = useCrmStore((state) => state.selectedExpedienteClave);
  const selectExpediente = useCrmStore((state) => state.selectExpediente);

  return (
    <aside className="flex h-72 flex-col border-b border-mutedLine bg-slate-50 lg:h-screen lg:w-80 lg:border-b-0 lg:border-r">
      <header className="border-b border-mutedLine px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          CRM
        </p>
        <div className="mt-1 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-950">Expedientes</h2>
          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-mutedLine">
            {expedientes.length}
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        {expedientes.length ? (
          <div className="flex flex-col gap-2">
            {expedientes.map((expediente) => (
              <ExpedienteListItem
                key={expediente.clave}
                expediente={expediente}
                isSelected={expediente.clave === selectedExpedienteClave}
                onSelect={() => selectExpediente(expediente.clave)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-sm leading-6 text-slate-500">
            Los expedientes apareceran aqui cuando el agente cree, encuentre o
            actualice registros.
          </div>
        )}
      </div>
    </aside>
  );
}

function ExpedienteListItem({
  expediente,
  isSelected,
  onSelect
}: {
  expediente: Expediente;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border px-3 py-3 text-left transition ${
        isSelected
          ? "border-slate-950 bg-white shadow-sm"
          : "border-transparent bg-transparent hover:border-mutedLine hover:bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">
            {getExpedienteTitle(expediente)}
          </p>
          <p className="mt-1 truncate text-xs text-slate-500">{expediente.clave}</p>
        </div>
        <StatusBadge estado={expediente.estado} />
      </div>
      <p className="mt-2 truncate text-xs text-slate-500">
        {expediente.municipio ?? expediente.direccion ?? "Sin ubicacion"}
      </p>
    </button>
  );
}

function getExpedienteTitle(expediente: Expediente): string {
  const fullName = [expediente.nombre, expediente.apellido].filter(Boolean).join(" ");

  return fullName || expediente.clave;
}

export function StatusBadge({ estado }: { estado?: string }) {
  const normalizedEstado = estado?.toLowerCase() ?? "";
  const colorClass = normalizedEstado.includes("cerr")
    ? "bg-slate-100 text-slate-700 ring-slate-200"
    : normalizedEstado.includes("pend")
      ? "bg-amber-50 text-amber-700 ring-amber-200"
      : normalizedEstado.includes("curso") || normalizedEstado.includes("proceso")
        ? "bg-blue-50 text-blue-700 ring-blue-200"
        : "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${colorClass}`}
    >
      {estado ?? "Nuevo"}
    </span>
  );
}
