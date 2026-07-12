import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

/**
 * Formal carbon-footprint report PDF.
 *
 * Deliberately impeccable: no rotation, even corners, no "hand-made" brand
 * imperfection — this document has to slip into a procurement inbox without
 * looking out of place (brief de diseño §5 y §6). The app UI carries the brand
 * texture; the output PDF does not.
 *
 * Fonts: uses the built-in Helvetica for zero-dependency reliability. Fraunces /
 * IBM Plex can be registered later via Font.register once font files are bundled.
 */

export interface InformeData {
  /** Report reference / number, e.g. "SL-2026-0001". Optional. */
  numero?: string;
  /** Reporting year the factors correspond to. */
  ejercicio: number;
  emisor: { nombre: string; nif?: string | null };
  destinatario: string;
  alcance1_tco2e: number;
  alcance2_tco2e: number;
  alcance3_estimado_tco2e: number | null;
  metodologia: string;
  /** MITECO factor vintage actually used in the calculation. */
  factorAnio: number;
  /** Exact source citation for the factors. */
  fuenteFactores: string;
  /** Human-readable generation date, e.g. "12 de julio de 2026". */
  fechaGeneracion: string;
}

const INK = "#241F16";
const MUTED = "#7C7368";
const LINE = "#D8D0BC";

const styles = StyleSheet.create({
  page: {
    paddingTop: 54,
    paddingBottom: 56,
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
    marginBottom: 26,
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
  title: { fontFamily: "Helvetica-Bold", fontSize: 20, marginBottom: 22 },
  partiesRow: { flexDirection: "row", gap: 28, marginBottom: 28 },
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
    marginTop: 18,
    padding: 12,
    backgroundColor: "#FBF8EF",
    borderWidth: 1,
    borderColor: LINE,
    fontSize: 8.5,
    color: "#4A443A",
    lineHeight: 1.5,
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

export function InformeDocument(data: InformeData) {
  const total =
    data.alcance1_tco2e +
    data.alcance2_tco2e +
    (data.alcance3_estimado_tco2e ?? 0);

  return (
    <Document
      title={`Informe de huella de carbono — ${data.emisor.nombre} — ${data.ejercicio}`}
      author="Sellium"
      subject="Huella de carbono (Alcance 1+2, estimación Alcance 3)"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.wordmark}>Sellium</Text>
          </View>
          <View>
            <Text style={styles.headerMeta}>{data.metodologia}</Text>
            <Text style={styles.headerMeta}>
              Factores MITECO {data.factorAnio}
            </Text>
            {data.numero ? (
              <Text style={styles.headerMeta}>Ref. {data.numero}</Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.docLabel}>
          Informe de huella de carbono · Ejercicio {data.ejercicio}
        </Text>
        <Text style={styles.title}>{data.emisor.nombre}</Text>

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
          <Text style={styles.valueCell}>{fmt(data.alcance1_tco2e)} t CO2e</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.scopeCell}>
            <Text style={styles.scopeName}>Alcance 2 — Electricidad</Text>
            <Text style={styles.scopeDesc}>
              Electricidad comprada de la red (factor de mix nacional).
            </Text>
          </View>
          <Text style={styles.valueCell}>{fmt(data.alcance2_tco2e)} t CO2e</Text>
        </View>

        {data.alcance3_estimado_tco2e != null ? (
          <View style={styles.row}>
            <View style={styles.scopeCell}>
              <Text style={{ ...styles.scopeName, color: MUTED }}>
                Alcance 3 — Estimación
              </Text>
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
            (spend-based) a partir del gasto anual declarado en compras y
            servicios de terceros, aplicando un factor sectorial medio. No
            constituye una medición directa y debe interpretarse como una
            aproximación.
          </Text>
        ) : null}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {data.fuenteFactores}
          </Text>
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
