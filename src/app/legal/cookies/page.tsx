import type { Metadata } from "next";
import { LegalPage, H2, P, UL, LI, Table } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de cookies · Sellium",
  description:
    "Política de cookies de Sellium: qué cookies y almacenamiento local usamos, para qué, y cómo gestionar tu consentimiento.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de cookies"
      updated="12 de julio de 2026"
      current="cookies"
    >
      <P>
        Esta política describe las cookies y tecnologías de almacenamiento similares
        que utiliza Sellium, conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE) y a
        la normativa de protección de datos. Usamos el mínimo imprescindible para que
        el Servicio funcione y, solo con tu consentimiento, cookies adicionales.
      </P>

      <H2>1. ¿Qué son las cookies?</H2>
      <P>
        Una cookie es un pequeño fichero que un sitio web almacena en tu navegador. El
        almacenamiento local («localStorage») es una tecnología similar que guarda
        información en tu dispositivo. Ambas permiten recordar información entre
        visitas o durante la sesión.
      </P>

      <H2>2. Cookies que utilizamos</H2>
      <P>
        <strong className="text-ink-text">Técnicas o necesarias (exentas de consentimiento).</strong>{" "}
        Imprescindibles para que puedas iniciar sesión y usar el panel de forma segura.
      </P>
      <Table
        head={["Nombre", "Finalidad", "Tipo / duración"]}
        rows={[
          [
            "Cookies de autenticación de Supabase",
            "Mantener tu sesión iniciada y proteger la cuenta.",
            "Técnica · sesión / persistente (según proveedor).",
          ],
          [
            "sellium-cookie-consent (localStorage)",
            "Recordar tu elección sobre cookies para no volver a preguntártelo.",
            "Técnica · persistente.",
          ],
        ]}
      />
      <P>
        <strong className="text-ink-text">Analíticas (requieren tu consentimiento).</strong>{" "}
        Usamos <strong className="text-ink-text">Google Analytics 4</strong> para entender de
        forma agregada cómo se usa el sitio y mejorarlo. Estas cookies{" "}
        <strong className="text-ink-text">solo se cargan si aceptas las cookies analíticas</strong>;
        si las rechazas, Google Analytics no se activa. Puedes revocar tu consentimiento en
        cualquier momento (sección 3).
      </P>
      <Table
        head={["Cookie", "Proveedor", "Finalidad", "Duración"]}
        rows={[
          ["_ga", "Google", "Distinguir usuarios de forma agregada.", "Hasta 2 años"],
          ["_ga_<id>", "Google", "Mantener el estado de la sesión de analítica.", "Hasta 2 años"],
        ]}
      />
      <P>
        <strong className="text-ink-text">Marketing.</strong>{" "}
        No usamos cookies de marketing ni publicitarias de terceros. Si en el futuro las
        incorporáramos, se solicitaría tu consentimiento previo y se detallarían aquí.
      </P>

      <H2>3. Gestión y retirada del consentimiento</H2>
      <P>
        Cuando accedes por primera vez, mostramos un aviso donde puedes{" "}
        <strong className="text-ink-text">aceptar todas</strong>,{" "}
        <strong className="text-ink-text">rechazar</strong> las opcionales o{" "}
        <strong className="text-ink-text">configurar</strong> por categorías. Rechazar
        es tan sencillo como aceptar, y las cookies opcionales nunca están marcadas por
        defecto.
      </P>
      <UL>
        <LI>
          Puedes cambiar tu decisión borrando el almacenamiento del sitio en tu
          navegador, lo que hará que volvamos a preguntarte.
        </LI>
        <LI>
          También puedes bloquear o eliminar cookies desde la configuración de tu
          navegador (Chrome, Firefox, Safari, Edge, etc.). Ten en cuenta que
          desactivar las cookies técnicas puede impedir el uso del panel.
        </LI>
      </UL>

      <H2>4. Cookies de terceros y transferencias</H2>
      <P>
        Las cookies técnicas de sesión las gestiona nuestro proveedor de autenticación
        (Supabase). El tratamiento de datos por parte de nuestros proveedores, incluidas
        posibles transferencias internacionales, se detalla en la{" "}
        <a href="/legal/privacidad" className="text-link">
          Política de privacidad
        </a>
        .
      </P>

      <H2>5. Cambios</H2>
      <P>
        Podemos actualizar esta política si cambian las cookies utilizadas o la
        normativa. La versión vigente será la publicada en esta página, con su fecha de
        última actualización.
      </P>
    </LegalPage>
  );
}
