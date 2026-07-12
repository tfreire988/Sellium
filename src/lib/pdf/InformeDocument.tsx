import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { MedidaReduccion } from "../reduccion";

/**
 * Formal carbon-footprint report PDF.
 *
 * Deliberately impeccable: no rotation, even corners, no "hand-made" brand
 * imperfection — this document has to slip into a procurement inbox without
 * looking out of place (brief de diseño §5 y §6). The app UI carries the brand
 * texture; the output PDF does not.
 *
 * Fonts: uses the built-in Helvetica for zero-dependency reliability. "CO2e" is
 * written without a subscript because Helvetica has no U+2082 glyph.
 */

export interface DesgloseLinea {
  fuente: string;
  periodo: string;
  consumo: string;
  factor: string;
  emisiones: string;
  alcance: string;
}

export interface FactorLinea {
  fuente: string;
  factor: string;
  origen: string;
}

export interface InformeData {
  /** Report reference / number, e.g. "SL-2026-0001". Optional. */
  numero?: string;
  /** Reporting year the factors correspond to. */
  ejercicio: number;
  /** Base year for future comparison (equals the reporting year here). */
  anioBase: number;
  emisor: { nombre: string; nif?: string | null };
  destinatario: string;
  alcance1_tco2e: number;
  alcance2_tco2e: number;
  alcance3_estimado_tco2e: number | null;
  totalTco2e: number;
  metodologia: string;
  /** MITECO factor vintage actually used in the calculation. */
  factorAnio: number;
  /** Exact source citation for the factors. */
  fuenteFactores: string;
  /** Human-readable generation date, e.g. "12 de julio de 2026". */
  fechaGeneracion: string;
  /** Number of bills priced into the inventory. */
  nFacturas: number;
  /** Per-bill audit breakdown. */
  desglose: DesgloseLinea[];
  /** Emission factors actually applied. */
  factores: FactorLinea[];
  /** Prioritised reduction measures (3–5 year outlook). May be empty. */
  medidas: MedidaReduccion[];
}

const INK = "#241F16";
const MUTED = "#7C7368";
const LINE = "#D8D0BC";
const C_A1 = "#B8763A";
const C_A2 = "#4F6B4A";
const C_A3 = "#8A8073";

const styles = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingBottom: 58,
    paddingHorizontal: 54,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: INK,
    backgroundColor: "#FFFFFF",
    lineHeight: 1.5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: INK,
    paddingBottom: 12,
    marginBottom: 24,
  },
  wordmark: { fontFamily: "Helvetica-Bold", fontSize: 16, color: INK },
  headerMeta: { fontSize: 8, color: MUTED, textAlign: "right", lineHeight: 1.4 },
  docLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: { fontFamily: "Helvetica-Bold", fontSize: 20, marginBottom: 20 },
  partiesRow: { flexDirection: "row", gap: 28, marginBottom: 24 },
  party: { flex: 1 },
  partyLabel: {
    fontSize: 7.5,
    letterSpacing: 1.2,
    color: MUTED,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  partyName: { fontFamily: "Helvetica-Bold", fontSize: 11.5 },
  partySub: { fontSize: 9, color: MUTED, marginTop: 1 },

  // Sections
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    marginTop: 26,
    marginBottom: 4,
  },
  sectionIntro: { fontSize: 9, color: MUTED, marginBottom: 12 },
  resumen: {
    padding: 13,
    backgroundColor: "#FBF8EF",
    borderWidth: 1,
    borderColor: LINE,
    borderRadius: 3,
    fontSize: 10,
    lineHeight: 1.55,
    marginBottom: 6,
  },
  resumenStrong: { fontFamily: "Helvetica-Bold" },

  // Scope split bar
  bar: {
    flexDirection: "row",
    height: 14,
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 14,
    marginBottom: 10,
  },
  legendRow: { flexDirection: "row", gap: 18, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 2 },
  legendText: { fontSize: 8.5, color: INK },

  // Scope table
  tableHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingBottom: 6,
    marginBottom: 2,
  },
  thScope: { flex: 1, fontSize: 8, letterSpacing: 1, color: MUTED, textTransform: "uppercase" },
  thValue: { width: 120, fontSize: 8, letterSpacing: 1, color: MUTED, textTransform: "uppercase", textAlign: "right" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  scopeCell: { flex: 1, paddingRight: 12 },
  scopeName: { fontSize: 10.5 },
  scopeDesc: { fontSize: 8.5, color: MUTED, marginTop: 1 },
  valueCell: { width: 120, textAlign: "right", fontSize: 11 },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 2,
    borderTopColor: INK,
    marginTop: 2,
    paddingTop: 12,
  },
  totalLabel: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 12 },
  totalValue: { width: 120, textAlign: "right", fontFamily: "Helvetica-Bold", fontSize: 16 },

  estimateNote: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#FBF8EF",
    borderWidth: 1,
    borderColor: LINE,
    fontSize: 8.5,
    color: "#4A443A",
    lineHeight: 1.5,
  },

  // Generic data table (desglose, factores)
  dtHead: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: INK,
    paddingBottom: 5,
  },
  dtRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: LINE,
  },
  dtHeadCell: { fontSize: 7.5, letterSpacing: 0.8, color: MUTED, textTransform: "uppercase" },
  dtCell: { fontSize: 9 },
  dtCellMuted: { fontSize: 8.5, color: MUTED },

  // Methodology
  methItem: { flexDirection: "row", marginBottom: 6 },
  methKey: { width: 130, fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  methVal: { flex: 1, fontSize: 9.5, color: "#3A342A", lineHeight: 1.5 },

  // Reduction plan
  medidaRow: { flexDirection: "row", marginBottom: 11 },
  medidaNum: { width: 18, fontFamily: "Helvetica-Bold", fontSize: 10, color: C_A1 },
  medidaBody: { flex: 1 },
  medidaTitulo: { fontFamily: "Helvetica-Bold", fontSize: 10.5, marginBottom: 1 },
  medidaDetalle: { fontSize: 9, color: "#4A443A", lineHeight: 1.5 },

  disclaimer: {
    marginTop: 22,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: LINE,
    fontSize: 7.5,
    color: MUTED,
    lineHeight: 1.55,
  },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 54,
    right: 54,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7.5, color: MUTED },
});

function fmt(n: number): string {
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  });
}

function pct(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function InformeDocument(data: InformeData) {
  const a1 = data.alcance1_tco2e;
  const a2 = data.alcance2_tco2e;
  const a3 = data.alcance3_estimado_tco2e ?? 0;
  const total = data.totalTco2e;

  const p1 = pct(a1, total);
  const p2 = pct(a2, total);
  const p3 = pct(a3, total);

  const mayor = a1 >= a2 && a1 >= a3 ? "Alcance 1 (combustión directa)" : a2 >= a3 ? "Alcance 2 (electricidad)" : "Alcance 3 (estimación)";

  return (
    <Document
      title={`Informe de huella de carbono — ${data.emisor.nombre} — ${data.ejercicio}`}
      author="Sellium"
      subject="Huella de carbono (Alcance 1+2, estimación Alcance 3)"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.wordmark}>Sellium</Text>
          <View>
            <Text style={styles.headerMeta}>{data.metodologia}</Text>
            <Text style={styles.headerMeta}>Factores MITECO {data.factorAnio}</Text>
            {data.numero ? (
              <Text style={styles.headerMeta}>Ref. {data.numero}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.docLabel}>
          Informe de huella de carbono · Ejercicio {data.ejercicio}
        </Text>
        <Text style={styles.title}>{data.emisor.nombre}</Text>

        {/* Parties */}
        <View style={styles.partiesRow}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Emisor del informe</Text>
            <Text style={styles.partyName}>{data.emisor.nombre}</Text>
            {data.emisor.nif ? (
              <Text style={styles.partySub}>NIF {data.emisor.nif}</Text>
            ) : null}
          </View>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Destinatario</Text>
            <Text style={styles.partyName}>{data.destinatario}</Text>
          </View>
        </View>

        {/* Executive summary */}
        <Text style={styles.resumen}>
          Durante el ejercicio {data.ejercicio}, {data.emisor.nombre} generó unas
          emisiones totales de{" "}
          <Text style={styles.resumenStrong}>{fmt(total)} t CO2e</Text>, calculadas
          a partir de {data.nFacturas} factura{data.nFacturas === 1 ? "" : "s"} de
          consumo con los factores de emisión oficiales del MITECO. La mayor parte
          corresponde a {mayor}. Este informe recoge el detalle por alcance, el
          desglose por fuente, la metodología aplicada y un plan de reducción
          orientativo.
        </Text>

        {/* Scope split bar */}
        <Text style={styles.sectionTitle}>Distribución por alcance</Text>
        <View style={styles.bar}>
          {p1 > 0 ? <View style={{ width: `${p1}%`, backgroundColor: C_A1 }} /> : null}
          {p2 > 0 ? <View style={{ width: `${p2}%`, backgroundColor: C_A2 }} /> : null}
          {p3 > 0 ? <View style={{ width: `${p3}%`, backgroundColor: C_A3 }} /> : null}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: C_A1 }} />
            <Text style={styles.legendText}>Alcance 1 · {p1}%</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={{ ...styles.legendDot, backgroundColor: C_A2 }} />
            <Text style={styles.legendText}>Alcance 2 · {p2}%</Text>
          </View>
          {data.alcance3_estimado_tco2e != null ? (
            <View style={styles.legendItem}>
              <View style={{ ...styles.legendDot, backgroundColor: C_A3 }} />
              <Text style={styles.legendText}>Alcance 3 (est.) · {p3}%</Text>
            </View>
          ) : null}
        </View>

        {/* Scope table */}
        <Text style={styles.sectionTitle}>Resultados por alcance</Text>
        <View style={styles.tableHead}>
          <Text style={styles.thScope}>Alcance</Text>
          <Text style={styles.thValue}>Emisiones</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.scopeCell}>
            <Text style={styles.scopeName}>Alcance 1 — Combustión directa</Text>
            <Text style={styles.scopeDesc}>
              Combustibles y gas quemados directamente por la organización.
            </Text>
          </View>
          <Text style={styles.valueCell}>{fmt(a1)} t CO2e</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.scopeCell}>
            <Text style={styles.scopeName}>Alcance 2 — Electricidad</Text>
            <Text style={styles.scopeDesc}>
              Electricidad comprada de la red (factor de mix nacional).
            </Text>
          </View>
          <Text style={styles.valueCell}>{fmt(a2)} t CO2e</Text>
        </View>

        {data.alcance3_estimado_tco2e != null ? (
          <View style={styles.row}>
            <View style={styles.scopeCell}>
              <Text style={{ ...styles.scopeName, color: MUTED }}>Alcance 3 — Estimación</Text>
              <Text style={styles.scopeDesc}>
                Estimación por gasto (spend-based), no medición directa.
              </Text>
            </View>
            <Text style={{ ...styles.valueCell, color: MUTED }}>
              {fmt(data.alcance3_estimado_tco2e)} t CO2e
            </Text>
          </View>
        ) : null}

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{fmt(total)} t CO2e</Text>
        </View>

        {data.alcance3_estimado_tco2e != null ? (
          <Text style={styles.estimateNote}>
            La cifra de Alcance 3 es una estimación calculada por método de gasto
            (spend-based) a partir del gasto anual declarado en compras y servicios
            de terceros, aplicando un factor sectorial medio. No constituye una
            medición directa y debe interpretarse como una aproximación.
          </Text>
        ) : null}

        {/* Breakdown by source */}
        {data.desglose.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>Desglose por fuente</Text>
            <Text style={styles.sectionIntro}>
              Trazabilidad de cada factura de consumo incluida en el inventario.
            </Text>
            <View style={styles.dtHead}>
              <Text style={{ ...styles.dtHeadCell, flex: 2.2 }}>Fuente</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 1.4 }}>Periodo</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 1.6, textAlign: "right" }}>Consumo</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 1.8, textAlign: "right" }}>Factor</Text>
              <Text style={{ ...styles.dtHeadCell, width: 30, textAlign: "right" }}>Alc.</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 1.5, textAlign: "right" }}>Emisiones</Text>
            </View>
            {data.desglose.map((d, i) => (
              <View key={i} style={styles.dtRow} wrap={false}>
                <Text style={{ ...styles.dtCell, flex: 2.2 }}>{d.fuente}</Text>
                <Text style={{ ...styles.dtCellMuted, flex: 1.4 }}>{d.periodo}</Text>
                <Text style={{ ...styles.dtCell, flex: 1.6, textAlign: "right" }}>{d.consumo}</Text>
                <Text style={{ ...styles.dtCellMuted, flex: 1.8, textAlign: "right" }}>{d.factor}</Text>
                <Text style={{ ...styles.dtCellMuted, width: 30, textAlign: "right" }}>{d.alcance}</Text>
                <Text style={{ ...styles.dtCell, flex: 1.5, textAlign: "right" }}>{d.emisiones}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Emission factors used */}
        {data.factores.length > 0 ? (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Factores de emisión aplicados</Text>
            <View style={styles.dtHead}>
              <Text style={{ ...styles.dtHeadCell, flex: 2 }}>Fuente</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 2, textAlign: "right" }}>Factor</Text>
              <Text style={{ ...styles.dtHeadCell, flex: 3, textAlign: "right" }}>Origen</Text>
            </View>
            {data.factores.map((f, i) => (
              <View key={i} style={styles.dtRow} wrap={false}>
                <Text style={{ ...styles.dtCell, flex: 2 }}>{f.fuente}</Text>
                <Text style={{ ...styles.dtCell, flex: 2, textAlign: "right" }}>{f.factor}</Text>
                <Text style={{ ...styles.dtCellMuted, flex: 3, textAlign: "right" }}>{f.origen}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Methodology & boundaries */}
        <View wrap={false}>
          <Text style={styles.sectionTitle}>Metodología y límites</Text>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Norma de referencia</Text>
            <Text style={styles.methVal}>
              GHG Protocol Corporate Standard, alineado con la norma ISO 14064-1.
            </Text>
          </View>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Límite organizativo</Text>
            <Text style={styles.methVal}>
              Enfoque de control operacional: se incluyen las fuentes sobre las que
              la organización tiene control directo.
            </Text>
          </View>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Límite operativo</Text>
            <Text style={styles.methVal}>
              Alcance 1 (combustión directa) y Alcance 2 (electricidad adquirida),
              más una estimación de Alcance 3 cuando se aporta el gasto asociado.
            </Text>
          </View>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Año base</Text>
            <Text style={styles.methVal}>
              {data.anioBase} — primer ejercicio calculado, referencia para medir
              la evolución en años sucesivos.
            </Text>
          </View>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Factores de emisión</Text>
            <Text style={styles.methVal}>{data.fuenteFactores}.</Text>
          </View>
          <View style={styles.methItem}>
            <Text style={styles.methKey}>Datos de actividad</Text>
            <Text style={styles.methVal}>
              Consumos tomados directamente de las facturas aportadas por la
              organización. La calidad del resultado depende de su exactitud e
              integridad.
            </Text>
          </View>
        </View>

        {/* Reduction plan */}
        {data.medidas.length > 0 ? (
          <View wrap={false}>
            <Text style={styles.sectionTitle}>Plan de reducción</Text>
            <Text style={styles.sectionIntro}>
              Medidas prioritarias para un horizonte de 3 a 5 años, ordenadas según
              dónde se concentran hoy las emisiones.
            </Text>
            {data.medidas.map((m, i) => (
              <View key={i} style={styles.medidaRow} wrap={false}>
                <Text style={styles.medidaNum}>{i + 1}.</Text>
                <View style={styles.medidaBody}>
                  <Text style={styles.medidaTitulo}>{m.titulo}</Text>
                  <Text style={styles.medidaDetalle}>{m.detalle}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Legal disclaimer */}
        <Text style={styles.disclaimer}>
          Este informe es una autodeclaración de la huella de carbono elaborada a
          partir de los datos aportados por la organización emisora. No ha sido
          verificado por una entidad acreditada ni constituye una certificación
          oficial. Las medidas de reducción son orientativas y no sustituyen un
          plan de descarbonización detallado ni asesoramiento técnico
          especializado. Generado con Sellium — factores oficiales del MITECO.
        </Text>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{data.fuenteFactores}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Generado el ${data.fechaGeneracion} · Pág. ${pageNumber}/${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
