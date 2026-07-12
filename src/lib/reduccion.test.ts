import { describe, it, expect } from "vitest";
import { medidasReduccion } from "./reduccion";

describe("medidasReduccion", () => {
  it("leads with the dominant scope's measures", () => {
    // Electricity (Scope 2) dominant → first measure is the GdO one
    const m = medidasReduccion({
      alcance1_tco2e: 1,
      alcance2_tco2e: 10,
      alcance3_estimado_tco2e: 0.5,
    });
    expect(m[0].titulo).toContain("Garantía de Origen");
    // two from the top pool before switching scope
    expect(m[1].titulo).toContain("Autoconsumo");
  });

  it("leads with Scope 1 when combustion dominates", () => {
    const m = medidasReduccion({
      alcance1_tco2e: 8,
      alcance2_tco2e: 1,
      alcance3_estimado_tco2e: null,
    });
    expect(m[0].titulo).toContain("flota");
  });

  it("always closes with the annual-measurement advice", () => {
    const m = medidasReduccion({
      alcance1_tco2e: 3,
      alcance2_tco2e: 2,
      alcance3_estimado_tco2e: 1,
    });
    expect(m[m.length - 1].titulo).toBe("Medir cada ejercicio");
  });

  it("skips scopes with no emissions", () => {
    const m = medidasReduccion({
      alcance1_tco2e: 0,
      alcance2_tco2e: 5,
      alcance3_estimado_tco2e: null,
    });
    // only Scope 2 pool (2 measures) + annual closer
    expect(m).toHaveLength(3);
  });

  it("returns just the annual closer when there is no data", () => {
    const m = medidasReduccion({
      alcance1_tco2e: 0,
      alcance2_tco2e: 0,
      alcance3_estimado_tco2e: null,
    });
    expect(m).toHaveLength(1);
    expect(m[0].titulo).toBe("Medir cada ejercicio");
  });
});
