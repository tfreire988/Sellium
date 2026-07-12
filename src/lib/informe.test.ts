import { describe, it, expect } from "vitest";
import { buildInformeData, fechaLarga, refInforme } from "./informe";
import type { ResultadoCalculo } from "./emisiones";

const calculo: ResultadoCalculo = {
  alcance1_tco2e: 3.426,
  alcance2_tco2e: 2.58,
  alcance3_estimado_tco2e: 12.6,
  sinFactor: [],
};

describe("fechaLarga", () => {
  it("formats a date in long Spanish form", () => {
    expect(fechaLarga(new Date(2026, 6, 12))).toBe("12 de julio de 2026");
    expect(fechaLarga(new Date(2025, 0, 1))).toBe("1 de enero de 2025");
  });
});

describe("refInforme", () => {
  it("zero-pads the sequence", () => {
    expect(refInforme(2026, 7)).toBe("SL-2026-0007");
    expect(refInforme(2025, 1234)).toBe("SL-2025-1234");
  });
});

describe("buildInformeData", () => {
  it("maps calculation + parties into InformeData", () => {
    const data = buildInformeData({
      emisor: { nombre: "Talleres Rovira, S.L.", nif: "B-123" },
      destinatario: "Grupo Altavera",
      ejercicio: 2025,
      calculo,
      factorAnio: 2025,
      fuenteFactores: "MITECO Ed.2026 (V6) · 2025",
      numero: "SL-2025-0001",
      fecha: new Date(2026, 6, 12),
    });
    expect(data.alcance1_tco2e).toBe(3.426);
    expect(data.alcance2_tco2e).toBe(2.58);
    expect(data.alcance3_estimado_tco2e).toBe(12.6);
    expect(data.metodologia).toBe("GHG Protocol + factores MITECO");
    expect(data.fechaGeneracion).toBe("12 de julio de 2026");
    expect(data.numero).toBe("SL-2025-0001");
  });

  it("passes a null Scope 3 through unchanged", () => {
    const data = buildInformeData({
      emisor: { nombre: "Imprenta Solvent", nif: null },
      destinatario: "Grupo Altavera",
      ejercicio: 2025,
      calculo: { ...calculo, alcance3_estimado_tco2e: null },
      factorAnio: 2025,
      fuenteFactores: "MITECO 2025",
    });
    expect(data.alcance3_estimado_tco2e).toBeNull();
  });
});
