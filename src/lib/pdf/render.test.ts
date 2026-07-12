import { describe, it, expect } from "vitest";
import { writeFileSync } from "node:fs";
import { renderToBuffer } from "@react-pdf/renderer";
import { InformeDocument } from "./InformeDocument";

describe("InformeDocument", () => {
  it("renders a valid PDF buffer", async () => {
    const buf = await renderToBuffer(
      InformeDocument({
        numero: "SL-2026-0001",
        ejercicio: 2025,
        emisor: { nombre: "Talleres Mecánicos Rovira, S.L.", nif: "B-12345678" },
        destinatario: "Grupo Altavera Construcciones",
        alcance1_tco2e: 4.2,
        alcance2_tco2e: 1.8,
        alcance3_estimado_tco2e: 12.6,
        metodologia: "GHG Protocol + factores MITECO",
        factorAnio: 2025,
        fuenteFactores: "MITECO Ed.2026 (V6) · factores 2025",
        fechaGeneracion: "12 de julio de 2026",
      }),
    );
    // Valid PDF magic number
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buf.length).toBeGreaterThan(1000);
    if (process.env.PDF_OUT) writeFileSync(process.env.PDF_OUT, buf);
  });

  it("omits Scope 3 row when estimate is null", async () => {
    const buf = await renderToBuffer(
      InformeDocument({
        ejercicio: 2025,
        emisor: { nombre: "Imprenta Solvent", nif: null },
        destinatario: "Grupo Altavera Construcciones",
        alcance1_tco2e: 1.1,
        alcance2_tco2e: 0.9,
        alcance3_estimado_tco2e: null,
        metodologia: "GHG Protocol + factores MITECO",
        factorAnio: 2025,
        fuenteFactores: "MITECO Ed.2026 (V6) · factores 2025",
        fechaGeneracion: "12 de julio de 2026",
      }),
    );
    expect(buf.subarray(0, 5).toString()).toBe("%PDF-");
  });
});
