import "server-only";
import { getServiceClient } from "./supabase";

/**
 * Supabase Storage buckets. Create these in the dashboard (Storage → New bucket),
 * both PRIVATE — access is mediated by the server routes, never public URLs:
 *   · `facturas` — uploaded consumption bills (source documents)
 *   · `informes` — generated report PDFs
 */
export const BUCKET_FACTURAS = "facturas";
export const BUCKET_INFORMES = "informes";

/**
 * Uploads a generated report PDF and returns its storage path (not a public URL;
 * serve it later via a signed URL). Path is namespaced by profile so it maps to
 * the owner: `<profileId>/<informeId>.pdf`.
 */
export async function uploadInformePDF(
  profileId: string,
  informeId: string,
  pdf: Buffer,
): Promise<string> {
  const path = `${profileId}/${informeId}.pdf`;
  const { error } = await getServiceClient()
    .storage.from(BUCKET_INFORMES)
    .upload(path, pdf, { contentType: "application/pdf", upsert: true });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}

/** Time-limited signed URL to download a stored report. */
export async function signedInformeURL(
  path: string,
  expiresInSeconds = 60 * 60,
): Promise<string> {
  const { data, error } = await getServiceClient()
    .storage.from(BUCKET_INFORMES)
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`);
  return data.signedUrl;
}
