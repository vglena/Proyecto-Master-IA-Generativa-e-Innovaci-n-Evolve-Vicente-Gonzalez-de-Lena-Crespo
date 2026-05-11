export interface Expediente {
  clave: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  municipio?: string;
  codigoPostal?: string;
  inmueble?: string;
  superficie?: number;
  habitaciones?: number;
  finalidad?: string;
  estado?: string;
  fechaEntrada?: string;
}

export type ExpedientePatch = Partial<Omit<Expediente, "clave">> & {
  clave: string;
};
