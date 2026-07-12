import type { FacturaConsumo, FactorEmision, TipoFactura } from "./db-types";

/**
 * Emission calculation — sellium-brief-desarrollo.md §3.4–3.5.
 *
 * Scope 1 = direct combustion (gas, fuel). Scope 2 = purchased electricity.
 * Scope 3 = simplified spend-based estimate (a single annual third-party spend
 * figure × an average sectoral factor). Scope 3 is explicitly an ESTIMATE and
 * the PDF must say so — never present it as a direct measurement.
 *
 * Pure functions here so the maths is testable without a DB or network.
 */

/** Maps a bill `tipo` to the emission-factor `tipo_fuente` bucket. */
export const FUENTE_POR_TIPO: Record<TipoFactura, string | null> = {
  electricidad: "electricidad_red",
  gas: "gas_natural",
  // Default bucket for a generic fuel bill = automotive diesel (B7), the most
  // common SME case. The extraction step should refine this to the specific
  // tipo_fuente present in factores_emision (gasoleo_c, gasolina, glp_auto…)
  // when the bill makes the fuel explicit.
  combustible: "gasoleo_a",
  otro: null,
};

/** Which GHG scope a bill contributes to. */
export function alcanceDeTipo(tipo: TipoFactura): 1 | 2 | null {
  if (tipo === "electricidad") return 2;
  if (tipo === "gas" || tipo === "combustible") return 1;
  return null;
}

function factorFor(
  factores: FactorEmision[],
  tipoFuente: string,
  ejercicio: number,
): FactorEmision | undefined {
  return factores.find(
    (f) => f.tipo_fuente === tipoFuente && f.ejercicio === ejercicio,
  );
}

/** One priced bill: the audit trail behind a scope subtotal. */
export interface LineaCalculo {
  facturaId: string;
  tipo: TipoFactura;
  alcance: 1 | 2;
  consumo: number;
  unidad: string;
  fuente: string;
  factorValor: number;
  factorUnidad: string;
  tco2e: number;
  periodoInicio: string | null;
  periodoFin: string | null;
}

export interface ResultadoCalculo {
  alcance1_tco2e: number;
  alcance2_tco2e: number;
  alcance3_estimado_tco2e: number | null;
  /** Per-bill breakdown for the report's audit table. */
  lineas: LineaCalculo[];
  /** Distinct emission factors actually applied. */
  factoresUsados: FactorEmision[];
  /** Bills that could not be priced (missing factor or unextracted consumo). */
  sinFactor: string[];
}

const KG_POR_TONELADA = 1000;

/**
 * Generic spend-based factor for the OPTIONAL Scope 3 estimate (kgCO2e per €).
 *
 * NOT a MITECO factor — MITECO only publishes Scope 1 & 2. This is a single
 * average drawn from environmentally-extended input-output data, applied only
 * when the user opts in by declaring an annual third-party spend. The report
 * labels the resulting figure as an approximation, never a measurement.
 */
export const FACTOR_ALCANCE3_DEFAULT = 0.3;

/**
 * Aggregates consumption × factor into Scope 1/2 tonnes CO2e.
 *
 * @param facturas       bills with `consumo_extraido` already validated
 * @param factores       emission factors for the relevant `ejercicio`
 * @param ejercicio      reporting year (selects the factor vintage)
 * @param gastoAlcance3  optional annual third-party spend for the Scope 3 estimate
 * @param factorAlcance3 average sectoral factor (kgCO2e per currency unit)
 */
export function calcularInforme(
  facturas: FacturaConsumo[],
  factores: FactorEmision[],
  ejercicio: number,
  gastoAlcance3?: number,
  factorAlcance3?: number,
): ResultadoCalculo {
  let kg1 = 0;
  let kg2 = 0;
  const sinFactor: string[] = [];
  const lineas: LineaCalculo[] = [];
  const factoresUsados = new Map<string, FactorEmision>();

  for (const factura of facturas) {
    const alcance = alcanceDeTipo(factura.tipo);
    const tipoFuente = FUENTE_POR_TIPO[factura.tipo];
    if (alcance === null || tipoFuente === null) continue;

    if (factura.consumo_extraido == null) {
      sinFactor.push(factura.id);
      continue;
    }
    const factor = factorFor(factores, tipoFuente, ejercicio);
    if (!factor) {
      sinFactor.push(factura.id);
      continue;
    }

    const kg = factura.consumo_extraido * factor.factor_kgco2e_por_unidad;
    if (alcance === 1) kg1 += kg;
    else kg2 += kg;

    factoresUsados.set(factor.id, factor);
    lineas.push({
      facturaId: factura.id,
      tipo: factura.tipo,
      alcance,
      consumo: factura.consumo_extraido,
      unidad: factura.unidad ?? factor.unidad,
      fuente: factor.tipo_fuente,
      factorValor: factor.factor_kgco2e_por_unidad,
      factorUnidad: factor.unidad,
      tco2e: round3(kg / KG_POR_TONELADA),
      periodoInicio: factura.periodo_inicio,
      periodoFin: factura.periodo_fin,
    });
  }

  const alcance3 =
    gastoAlcance3 != null && factorAlcance3 != null
      ? round3((gastoAlcance3 * factorAlcance3) / KG_POR_TONELADA)
      : null;

  return {
    alcance1_tco2e: round3(kg1 / KG_POR_TONELADA),
    alcance2_tco2e: round3(kg2 / KG_POR_TONELADA),
    alcance3_estimado_tco2e: alcance3,
    lineas,
    factoresUsados: [...factoresUsados.values()],
    sinFactor,
  };
}

function round3(n: number): number {
  return Math.round(n * 1000) / 1000;
}
