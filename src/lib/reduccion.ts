/**
 * Reduction-plan generator.
 *
 * A complete carbon-footprint report is expected to include a reduction plan
 * (a 3–5 year outlook with concrete measures), not just the calculation. These
 * measures are ORIENTATIVE — they are not consultancy advice — and the PDF says
 * so. They are prioritised by which scope contributes most to the total, so the
 * plan leads with where the organisation can actually move the needle.
 *
 * Pure function: no I/O, unit-testable.
 */

export interface MedidaReduccion {
  titulo: string;
  detalle: string;
}

const MEDIDAS_ALCANCE2: MedidaReduccion[] = [
  {
    titulo: "Electricidad con Garantía de Origen (GdO)",
    detalle:
      "Contratar un suministro 100% renovable certificado reduce el factor de tu Alcance 2 prácticamente a cero sin cambiar tu consumo.",
  },
  {
    titulo: "Autoconsumo fotovoltaico",
    detalle:
      "Instalar placas solares para cubrir parte del consumo diurno rebaja la factura y las emisiones de forma estable.",
  },
  {
    titulo: "Eficiencia energética",
    detalle:
      "Iluminación LED, climatización eficiente y apagado programado reducen el consumo eléctrico base.",
  },
];

const MEDIDAS_ALCANCE1: MedidaReduccion[] = [
  {
    titulo: "Renovación progresiva de la flota",
    detalle:
      "Sustituir vehículos diésel o gasolina por eléctricos o híbridos enchufables al final de su vida útil reduce las emisiones directas.",
  },
  {
    titulo: "Eficiencia en calderas y calefacción",
    detalle:
      "Mantenimiento periódico, termostatos programables y calderas de condensación reducen el consumo de gas o gasóleo.",
  },
  {
    titulo: "Electrificación del calor",
    detalle:
      "Sustituir calderas de combustión por bombas de calor donde sea viable elimina emisiones directas.",
  },
];

const MEDIDAS_ALCANCE3: MedidaReduccion[] = [
  {
    titulo: "Proveedores con menor huella",
    detalle:
      "Priorizar proveedores que ya midan y reduzcan sus emisiones rebaja tu Alcance 3 aguas arriba.",
  },
  {
    titulo: "Optimizar transporte y desplazamientos",
    detalle:
      "Agrupar envíos, optimizar rutas y fomentar reuniones remotas reducen las emisiones de la cadena.",
  },
];

const MEDIDA_ANUAL: MedidaReduccion = {
  titulo: "Medir cada ejercicio",
  detalle:
    "Repetir el cálculo cada año permite demostrar una reducción real y sostenida, que es lo que valoran tus clientes.",
};

export interface EmisionesPorAlcance {
  alcance1_tco2e: number;
  alcance2_tco2e: number;
  alcance3_estimado_tco2e: number | null;
}

/**
 * Builds a prioritised list of reduction measures: two from the largest
 * contributing scope, one from each of the others that has weight, plus the
 * always-relevant "measure again next year" closer.
 */
export function medidasReduccion(e: EmisionesPorAlcance): MedidaReduccion[] {
  const pools = [
    { peso: e.alcance2_tco2e, medidas: MEDIDAS_ALCANCE2 },
    { peso: e.alcance1_tco2e, medidas: MEDIDAS_ALCANCE1 },
    { peso: e.alcance3_estimado_tco2e ?? 0, medidas: MEDIDAS_ALCANCE3 },
  ].sort((a, b) => b.peso - a.peso);

  const out: MedidaReduccion[] = [];
  pools.forEach((pool, i) => {
    if (pool.peso <= 0) return;
    out.push(...pool.medidas.slice(0, i === 0 ? 2 : 1));
  });
  out.push(MEDIDA_ANUAL);
  return out;
}
