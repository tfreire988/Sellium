import "server-only";
import type { User } from "@supabase/supabase-js";
import { getServiceClient } from "./supabase";

/**
 * Guarantees a `profiles` row exists for the signed-in user.
 *
 * A Postgres trigger normally creates the profile at sign-up, but we don't want
 * the whole app to depend on that one trigger being present and healthy: if it
 * ever fails or a user predates it, every write would break with a foreign-key
 * error. This upsert (ignore-on-conflict, so it never clobbers existing data)
 * is the belt-and-suspenders guarantee, called at the first write of each flow.
 */
export async function ensureProfile(user: User): Promise<void> {
  const md = (user.user_metadata ?? {}) as Record<string, unknown>;
  const nombre = typeof md.nombre_empresa === "string" && md.nombre_empresa
    ? md.nombre_empresa
    : "Mi empresa";
  const nif = typeof md.nif === "string" && md.nif ? md.nif : null;
  const tipo = md.tipo_cuenta === "gestoria" ? "gestoria" : "pyme";

  await getServiceClient()
    .from("profiles")
    .upsert(
      { id: user.id, nombre_empresa: nombre, nif, tipo_cuenta: tipo },
      { onConflict: "id", ignoreDuplicates: true },
    );
}
