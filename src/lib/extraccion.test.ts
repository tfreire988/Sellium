import { describe, it, expect } from "vitest";
import { validarExtraccion, type ExtraccionRaw } from "./extraccion";

const good: ExtraccionRaw = {
  tipo_fuente: "electricidad_red",
  periodo_inicio: "2025-01-01",
  periodo_fin: "2025-01-31",
  consumo: 3200,
  unidad: "kWh",
};

describe("validarExtraccion — happy path", () => {
  it("accepts a complete, in-range electricity bill", () => {
    const r = validarExtraccion(good, "electricidad");
    expect(r.estado).toBe("ok");
    expect(r.consumo_extraido).toBe(3200);
    expect(r.unidad).toBe("kWh");
    expect(r.motivos).toEqual([]);
  });
});

describe("validarExtraccion — routes to manual review", () => {
  it("flags a null consumo", () => {
    const r = validarExtraccion({ ...good, consumo: null }, "electricidad");
    expect(r.estado).toBe("revision_manual");
    expect(r.consumo_extraido).toBeNull();
    expect(r.motivos).toContain("No se pudo extraer el consumo");
  });

  it("flags a non-positive consumo", () => {
    const r = validarExtraccion({ ...good, consumo: 0 }, "electricidad");
    expect(r.estado).toBe("revision_manual");
  });

  it("flags an implausible consumo for the unit", () => {
    const r = validarExtraccion({ ...good, consumo: 99_999_999 }, "electricidad");
    expect(r.estado).toBe("revision_manual");
    expect(r.consumo_extraido).toBeNull();
  });

  it("flags a missing unit", () => {
    const r = validarExtraccion({ ...good, unidad: null }, "electricidad");
    expect(r.estado).toBe("revision_manual");
    expect(r.motivos).toContain("Falta la unidad de consumo");
  });

  it("flags an unrecognized unit", () => {
    const r = validarExtraccion({ ...good, unidad: "MWh" }, "electricidad");
    expect(r.estado).toBe("revision_manual");
    expect(r.unidad).toBeNull();
  });

  it("flags a missing period date", () => {
    const r = validarExtraccion({ ...good, periodo_fin: null }, "electricidad");
    expect(r.estado).toBe("revision_manual");
    expect(r.motivos).toContain("Falta periodo_fin");
  });

  it("flags a malformed date", () => {
    const r = validarExtraccion({ ...good, periodo_inicio: "01/01/2025" }, "electricidad");
    expect(r.estado).toBe("revision_manual");
  });

  it("flags an inverted period", () => {
    const r = validarExtraccion(
      { ...good, periodo_inicio: "2025-02-01", periodo_fin: "2025-01-01" },
      "electricidad",
    );
    expect(r.estado).toBe("revision_manual");
    expect(r.motivos).toContain("El periodo de inicio es posterior al de fin");
  });

  it("flags a fuente that contradicts the declared bill type", () => {
    const r = validarExtraccion({ ...good, tipo_fuente: "gas_natural" }, "electricidad");
    expect(r.estado).toBe("revision_manual");
  });
});

describe("validarExtraccion — fuel bills", () => {
  it("accepts diesel litres for a 'combustible' bill", () => {
    const r = validarExtraccion(
      {
        tipo_fuente: "gasoleo_a",
        periodo_inicio: "2025-03-01",
        periodo_fin: "2025-03-31",
        consumo: 850,
        unidad: "litros",
      },
      "combustible",
    );
    expect(r.estado).toBe("ok");
  });

  it("does not cross-check when the bill type is 'otro'", () => {
    const r = validarExtraccion({ ...good, tipo_fuente: "gas_natural" }, "otro");
    expect(r.estado).toBe("ok");
  });
});
