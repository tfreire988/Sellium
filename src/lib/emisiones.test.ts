import { describe, it, expect } from "vitest";
import {
  calcularInforme,
  alcanceDeTipo,
  FUENTE_POR_TIPO,
} from "./emisiones";
import type { FacturaConsumo, FactorEmision, TipoFactura } from "./db-types";

// Real MITECO factors (Edición 2026 / año 2025) — same values as the seed.
const FACTORES_2025: FactorEmision[] = [
  factor("electricidad_red", 0.258, "kWh"),
  factor("gas_natural", 0.182, "kWh"),
  factor("gasoleo_a", 2.516, "litros"),
];

function factor(tipo_fuente: string, f: number, unidad: string): FactorEmision {
  return {
    id: `f-${tipo_fuente}`,
    ejercicio: 2025,
    tipo_fuente,
    factor_kgco2e_por_unidad: f,
    unidad,
    fuente: "MITECO test",
    created_at: "2026-01-01T00:00:00Z",
  };
}

function bill(
  id: string,
  tipo: TipoFactura,
  consumo: number | null,
): FacturaConsumo {
  return {
    id,
    profile_id: "p1",
    cliente_gestionado_id: null,
    tipo,
    archivo_url: "x",
    periodo_inicio: null,
    periodo_fin: null,
    consumo_extraido: consumo,
    unidad: null,
    estado_extraccion: "ok",
    created_at: "2026-01-01T00:00:00Z",
  };
}

describe("alcanceDeTipo", () => {
  it("electricity is Scope 2", () => expect(alcanceDeTipo("electricidad")).toBe(2));
  it("gas and fuel are Scope 1", () => {
    expect(alcanceDeTipo("gas")).toBe(1);
    expect(alcanceDeTipo("combustible")).toBe(1);
  });
  it("'otro' maps to no scope", () => expect(alcanceDeTipo("otro")).toBeNull());
});

describe("FUENTE_POR_TIPO", () => {
  it("maps the generic 'combustible' bucket to automotive diesel", () => {
    expect(FUENTE_POR_TIPO.combustible).toBe("gasoleo_a");
    expect(FUENTE_POR_TIPO.electricidad).toBe("electricidad_red");
    expect(FUENTE_POR_TIPO.gas).toBe("gas_natural");
    expect(FUENTE_POR_TIPO.otro).toBeNull();
  });
});

describe("calcularInforme — Scope 1 & 2 with real MITECO factors", () => {
  it("electricity: 10 000 kWh × 0.258 = 2.58 tCO2e (Scope 2)", () => {
    const r = calcularInforme([bill("e", "electricidad", 10_000)], FACTORES_2025, 2025);
    expect(r.alcance2_tco2e).toBe(2.58);
    expect(r.alcance1_tco2e).toBe(0);
    expect(r.sinFactor).toEqual([]);
  });

  it("natural gas: 5 000 kWh × 0.182 = 0.91 tCO2e (Scope 1)", () => {
    const r = calcularInforme([bill("g", "gas", 5_000)], FACTORES_2025, 2025);
    expect(r.alcance1_tco2e).toBe(0.91);
    expect(r.alcance2_tco2e).toBe(0);
  });

  it("diesel: 1 000 l × 2.516 = 2.516 tCO2e (Scope 1)", () => {
    const r = calcularInforme([bill("d", "combustible", 1_000)], FACTORES_2025, 2025);
    expect(r.alcance1_tco2e).toBe(2.516);
  });

  it("aggregates several bills into the right scopes", () => {
    const r = calcularInforme(
      [
        bill("e", "electricidad", 10_000), // 2.58 → S2
        bill("g", "gas", 5_000), //            0.91 → S1
        bill("d", "combustible", 1_000), //    2.516 → S1
      ],
      FACTORES_2025,
      2025,
    );
    expect(r.alcance2_tco2e).toBe(2.58);
    expect(r.alcance1_tco2e).toBe(3.426); // 0.91 + 2.516
    expect(r.sinFactor).toEqual([]);
  });
});

describe("calcularInforme — Scope 3 spend-based estimate", () => {
  it("computes (spend × factor) / 1000 when both are provided", () => {
    const r = calcularInforme([], FACTORES_2025, 2025, 50_000, 0.5);
    expect(r.alcance3_estimado_tco2e).toBe(25); // 50 000 × 0.5 / 1000
  });

  it("is null when spend or factor is missing", () => {
    expect(calcularInforme([], FACTORES_2025, 2025).alcance3_estimado_tco2e).toBeNull();
    expect(
      calcularInforme([], FACTORES_2025, 2025, 50_000).alcance3_estimado_tco2e,
    ).toBeNull();
  });
});

describe("calcularInforme — edge cases", () => {
  it("flags a bill whose consumo was not extracted", () => {
    const r = calcularInforme([bill("g", "gas", null)], FACTORES_2025, 2025);
    expect(r.sinFactor).toEqual(["g"]);
    expect(r.alcance1_tco2e).toBe(0);
  });

  it("flags a bill with no matching factor for the year", () => {
    const r = calcularInforme([bill("g", "gas", 100)], FACTORES_2025, 2024);
    expect(r.sinFactor).toEqual(["g"]);
  });

  it("silently skips 'otro' bills (no scope, not flagged)", () => {
    const r = calcularInforme([bill("o", "otro", 999)], FACTORES_2025, 2025);
    expect(r.alcance1_tco2e).toBe(0);
    expect(r.alcance2_tco2e).toBe(0);
    expect(r.sinFactor).toEqual([]);
  });

  it("rounds to 3 decimals", () => {
    // 1234 kWh × 0.182 = 224.588 kg = 0.224588 t → 0.225
    const r = calcularInforme([bill("g", "gas", 1234)], FACTORES_2025, 2025);
    expect(r.alcance1_tco2e).toBe(0.225);
  });
});
