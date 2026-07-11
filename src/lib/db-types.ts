/**
 * Hand-written row types mirroring supabase/migrations/0001_schema.sql.
 *
 * Once a Supabase project exists, these can be replaced with the generated
 * types (`supabase gen types typescript`). Kept manual for now so the
 * scaffolding type-checks without a live project.
 */

export type TipoCuenta = "pyme" | "gestoria";
export type Plan = "trial" | "informe_unico" | "gestoria_mensual";
export type TipoFactura = "electricidad" | "gas" | "combustible" | "otro";
export type Unidad = "kWh" | "m3" | "litros";
export type EstadoExtraccion = "pendiente" | "ok" | "revision_manual";
export type EstadoInforme = "borrador" | "listo" | "enviado";

export interface Profile {
  id: string;
  nombre_empresa: string;
  nif: string | null;
  tipo_cuenta: TipoCuenta;
  plan: Plan;
  created_at: string;
}

export interface ClienteGestionado {
  id: string;
  gestoria_id: string;
  nombre_empresa: string;
  nif: string | null;
  email_contacto: string | null;
  created_at: string;
}

export interface Destinatario {
  id: string;
  profile_id: string;
  cliente_gestionado_id: string | null;
  nombre_cliente_grande: string;
  formato_preferido: string | null;
  created_at: string;
}

export interface FacturaConsumo {
  id: string;
  profile_id: string;
  cliente_gestionado_id: string | null;
  tipo: TipoFactura;
  archivo_url: string;
  periodo_inicio: string | null;
  periodo_fin: string | null;
  consumo_extraido: number | null;
  unidad: Unidad | null;
  estado_extraccion: EstadoExtraccion;
  created_at: string;
}

export interface Informe {
  id: string;
  profile_id: string;
  destinatario_id: string;
  cliente_gestionado_id: string | null;
  ejercicio: number;
  alcance1_tco2e: number | null;
  alcance2_tco2e: number | null;
  alcance3_estimado_tco2e: number | null;
  metodologia: string;
  pdf_url: string | null;
  estado: EstadoInforme;
  enviado_a_email: string | null;
  created_at: string;
}

export interface FactorEmision {
  id: string;
  ejercicio: number;
  tipo_fuente: string;
  factor_kgco2e_por_unidad: number;
  unidad: string;
  fuente: string;
  created_at: string;
}
