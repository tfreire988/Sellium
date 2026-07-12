import "server-only";
import { renderToBuffer } from "@react-pdf/renderer";
import { InformeDocument, type InformeData } from "./InformeDocument";

/**
 * Renders the report to a PDF Buffer, ready to upload to Supabase Storage.
 * Server-only (uses the Node renderer).
 */
export async function renderInformePDF(data: InformeData): Promise<Buffer> {
  return renderToBuffer(InformeDocument(data));
}

export type { InformeData };
