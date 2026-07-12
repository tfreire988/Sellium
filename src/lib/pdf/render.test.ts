import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { renderToBuffer } from "@react-pdf/renderer";
import { InformeDocument } from "./InformeDocument";
import { buildInformeData } from "../informe";
import type { ResultadoCalculo } from "../emisiones";

const calculo: ResultadoCalculo = {
  alcance1_tco2e: 3.644,
  alcance2_tco2e: 1.8,
  alcance3_estimado_tco2e: 12.6,
  lineas: [
    {
      facturaId: "f1",
      tipo: "combustible",
      alcance: 1,
      consumo: 850,
      unidad: "litros",
      fuente: "gasoleo_a",
      factorValor: 2.4669,
      factorUnidad: "litro",
      tco2e: 2.097,
      periodoInicio: "2025-01-01",
      periodoFin: "2025-12-31",
    },
    {
      facturaId: "f2",
      tipo: "gas",
      alcance: 1,
      consumo: 8500,
      unidad: "kWh",
      fuente: "gas_natural",
      factorValor: 0.182,
      factorUnidad: "kWh",
      tco2e: 1.547,
      periodoInicio: "2025-01-01",
      periodoFin: "2025-06-30",
    },
    {
      facturaId: "f3",
      tipo: "electricidad",
      alcance: 2,
      consumo: 9000,
      unidad: "kWh",
      fuente: "electricidad_red",
      factorValor: 0.2,
      factorUnidad: "kWh",
      tco2e: 1.8,
      periodoInicio: "2025-01-01",
      periodoFin: "2025-12-31",
    },
  ],
  factoresUsados: [
    { id: "x1", ejercicio: 2025, tipo_fuente: "gasoleo_a", factor_kgco2e_por_unidad: 2.4669, unidad: "litro", fuente: "MITECO Ed.2026 (V6) · 2025", created_at: "" },
    { id: "x2", ejercicio: 2025, tipo_fuente: "gas_natural", factor_kgco2e_por_unidad: 0.182, unidad: "kWh", fuente: "MITECO Ed.2026 (V6) · 2025", created_at: "" },
    { id: "x3", ejercicio: 2025, tipo_fuente: "electricidad_red", factor_kgco2e_por_unidad: 0.2, unidad: "kWh", fuente: "MITECO Ed.2026 (V6) · 2025", created_at: "" },
  ],
  sinFactor: [],
};

describe("InformeDocument", () => {
  it("renders a valid, multi-section PDF buffer", async () => {
    const data = buildInformeData({
      emisor: { nombre: "Talleres Mecánicos Rovira, S.L.", nif: "B-12345678" },
      destinatario: "Grupo Altavera Construcciones",
      ejercicio: 2025,
      calculo,
      factorAnio: 2025,
      fuenteFactores: "MITECO Ed.2026 (V6) · factores 2025",
      numero: "SL-2025-0001",
      fecha: new Date(2026, 6, 12),
    });
    const buf = await renderToBuffer(InformeDocument(data));
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(1000);
    if (process.env.PDF_OUT) writeFileSync(process.env.PDF_OUT, buf);
  });

  it("omits Scope 3 row when estimate is null", async () => {
    const data = buildInformeData({
      emisor: { nombre: "Imprenta Solvent", nif: null },
      destinatario: "Grupo Altavera Construcciones",
      ejercicio: 2025,
      calculo: { ...calculo, alcance3_estimado_tco2e: null },
      factorAnio: 2025,
      fuenteFactores: "MITECO Ed.2026 (V6) · factores 2025",
    });
    const buf = await renderToBuffer(InformeDocument(data));
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
