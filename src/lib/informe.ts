import type { ResultadoCalculo } from "./emisiones";
import type { InformeData } from "./pdf/InformeDocument";
import { medidasReduccion } from "./reduccion";

/**
 * Pure helpers to shape an InformeData for the PDF from the calculation result
 * plus the parties' details. Kept free of I/O so they are unit-testable.
 */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "12 de julio de 2026" from a Date (defaults to now). */
export function fechaLarga(d: Date = new Date()): string {
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Zero-padded report reference, e.g. "SL-2026-0007". */
export function refInforme(anio: number, seq: number): string {
  return `SL-${anio}-${String(seq).padStart(4, "0")}`;
}

export interface BuildInformeArgs {
  emisor: { nombre: string; nif?: string | null };
  destinatario: string;
  ejercicio: number;
  calculo: ResultadoCalculo;
  factorAnio: number;
  fuenteFactores: string;
  numero?: string;
  fecha?: Date;
}

export function buildInformeData(args: BuildInformeArgs): InformeData {
  return {
    numero: args.numero,
    ejercicio: args.ejercicio,
    emisor: args.emisor,
    destinatario: args.destinatario,
    alcance1_tco2e: args.calculo.alcance1_tco2e,
    alcance2_tco2e: args.calculo.alcance2_tco2e,
    alcance3_estimado_tco2e: args.calculo.alcance3_estimado_tco2e,
    metodologia: "GHG Protocol + factores MITECO",
    factorAnio: args.factorAnio,
    fuenteFactores: args.fuenteFactores,
    fechaGeneracion: fechaLarga(args.fecha),
    medidas: medidasReduccion(args.calculo),
  };
}
