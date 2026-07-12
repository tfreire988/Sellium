import type { LineaCalculo, ResultadoCalculo } from "./emisiones";
import type { FactorEmision } from "./db-types";
import type {
  DesgloseLinea,
  FactorLinea,
  InformeData,
} from "./pdf/InformeDocument";
import { medidasReduccion } from "./reduccion";

/**
 * Pure helpers to shape an InformeData for the PDF from the calculation result
 * plus the parties' details. Kept free of I/O so they are unit-testable.
 */

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** Human labels for the emission-factor source buckets used in the seed. */
const FUENTE_LABEL: Record<string, string> = {
  electricidad_red: "Electricidad de red",
  gas_natural: "Gas natural",
  gasoleo_a: "Gasóleo A (automoción)",
  gasoleo_b: "Gasóleo B (agrícola)",
  gasoleo_c: "Gasóleo C (calefacción)",
  gasolina: "Gasolina",
  glp_auto: "GLP automoción",
  glp_generico: "GLP",
  fueloleo: "Fuelóleo",
};

function labelFuente(tipoFuente: string): string {
  return FUENTE_LABEL[tipoFuente] ?? tipoFuente.replace(/_/g, " ");
}

/** "12 de julio de 2026" from a Date (defaults to now). */
export function fechaLarga(d: Date = new Date()): string {
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

/** Zero-padded report reference, e.g. "SL-2026-0007". */
export function refInforme(anio: number, seq: number): string {
  return `SL-${anio}-${String(seq).padStart(4, "0")}`;
}

function num(n: number, maxFrac = 2): string {
  return n.toLocaleString("es-ES", { maximumFractionDigits: maxFrac });
}

function fmtTon(n: number): string {
  return `${n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} t CO2e`;
}

function fmtPeriodo(ini: string | null, fin: string | null): string {
  const mm = (iso: string) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };
  const a = ini ? mm(ini) : null;
  const b = fin ? mm(fin) : null;
  if (a && b) return a === b ? a : `${a} – ${b}`;
  return a ?? b ?? "—";
}

function toDesglose(l: LineaCalculo): DesgloseLinea {
  return {
    fuente: labelFuente(l.fuente),
    periodo: fmtPeriodo(l.periodoInicio, l.periodoFin),
    consumo: `${num(l.consumo)} ${l.unidad}`,
    factor: `${num(l.factorValor, 4)} kg/${l.factorUnidad}`,
    emisiones: fmtTon(l.tco2e),
    alcance: String(l.alcance),
  };
}

function toFactorLinea(f: FactorEmision): FactorLinea {
  return {
    fuente: labelFuente(f.tipo_fuente),
    factor: `${num(f.factor_kgco2e_por_unidad, 4)} kg CO2e/${f.unidad}`,
    origen: f.fuente,
  };
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
  const c = args.calculo;
  const total =
    c.alcance1_tco2e + c.alcance2_tco2e + (c.alcance3_estimado_tco2e ?? 0);

  return {
    numero: args.numero,
    ejercicio: args.ejercicio,
    anioBase: args.ejercicio,
    emisor: args.emisor,
    destinatario: args.destinatario,
    alcance1_tco2e: c.alcance1_tco2e,
    alcance2_tco2e: c.alcance2_tco2e,
    alcance3_estimado_tco2e: c.alcance3_estimado_tco2e,
    totalTco2e: Math.round(total * 1000) / 1000,
    metodologia: "GHG Protocol + factores MITECO",
    factorAnio: args.factorAnio,
    fuenteFactores: args.fuenteFactores,
    fechaGeneracion: fechaLarga(args.fecha),
    nFacturas: c.lineas.length,
    desglose: c.lineas.map(toDesglose),
    factores: c.factoresUsados.map(toFactorLinea),
    medidas: medidasReduccion(c),
  };
}
