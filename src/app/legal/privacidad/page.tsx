import type { Metadata } from "next";
import { LegalPage, H2, H3, P, UL, LI, Table } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Política de privacidad · Sellium",
  description:
    "Política de privacidad de Sellium: qué datos tratamos, con qué base legal, con qué proveedores y qué derechos tienes (RGPD / LOPDGDD).",
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      title="Política de privacidad"
      updated="12 de julio de 2026"
      current="privacidad"
    >
      <P>
        Esta política explica cómo Sellium trata los datos personales de los usuarios
        del Servicio, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica
        3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los
        derechos digitales (LOPDGDD).
      </P>

      <H2>1. Responsable del tratamiento</H2>
      <UL>
        <LI>Responsable: Telmo Freire Montero (persona física)</LI>
        <LI>
          Contacto en materia de protección de datos:{" "}
          <a href="mailto:contact@sellium.eu" className="text-link">
            contact@sellium.eu
          </a>
        </LI>
      </UL>

      <H2>2. Datos que tratamos</H2>
      <H3>Datos de cuenta y facturación</H3>
      <UL>
        <LI>Identificativos y de contacto: nombre, correo electrónico, tipo de cuenta (pyme o gestoría).</LI>
        <LI>Datos de la empresa del usuario: denominación, NIF, sector, ejercicio.</LI>
        <LI>
          Datos de pago: gestionados directamente por la pasarela de pago (Stripe).
          Sellium no almacena números completos de tarjeta.
        </LI>
      </UL>
      <H3>Datos aportados para elaborar el informe</H3>
      <UL>
        <LI>
          Facturas de consumo (electricidad, gas, combustible u otros) y los datos
          que contienen: consumos, importes, fechas, suministrador y, en su caso,
          datos identificativos que figuren en la factura.
        </LI>
        <LI>
          Datos del cliente destinatario del informe (por ejemplo, la denominación
          de la empresa a la que va dirigido).
        </LI>
      </UL>
      <H3>Datos de uso</H3>
      <UL>
        <LI>Datos técnicos y de sesión necesarios para la autenticación y la seguridad.</LI>
        <LI>
          Datos de navegación agregados, solo si el usuario consiente las cookies
          analíticas (ver{" "}
          <a href="/legal/cookies" className="text-link">
            Política de cookies
          </a>
          ).
        </LI>
      </UL>
      <P>
        <strong className="text-ink-text">Sobre datos de terceros:</strong> cuando el
        usuario sube facturas o datos del cliente destinatario, garantiza que está
        legitimado para aportarlos. Respecto de esa información, Sellium actúa como{" "}
        <em>encargado del tratamiento</em> por cuenta del usuario, que es el
        responsable de dichos datos.
      </P>

      <H2>3. Finalidades y bases legales</H2>
      <Table
        head={["Finalidad", "Base legal (art. 6 RGPD)"]}
        rows={[
          [
            "Crear y gestionar la cuenta y prestar el Servicio (extraer datos de las facturas, calcular la huella y generar el informe en PDF).",
            "Ejecución del contrato (art. 6.1.b).",
          ],
          [
            "Gestionar el cobro y la facturación del Servicio.",
            "Ejecución del contrato y obligación legal (art. 6.1.b y 6.1.c).",
          ],
          [
            "Cumplir obligaciones contables y fiscales.",
            "Obligación legal (art. 6.1.c).",
          ],
          [
            "Seguridad del Servicio y prevención del fraude.",
            "Interés legítimo (art. 6.1.f).",
          ],
          [
            "Comunicaciones comerciales sobre Sellium y analítica de uso.",
            "Consentimiento (art. 6.1.a), revocable en cualquier momento.",
          ],
        ]}
      />

      <H2>4. Uso de inteligencia artificial</H2>
      <P>
        Para acelerar la lectura de las facturas, Sellium emplea un modelo de
        inteligencia artificial (Claude, de Anthropic) que extrae los datos de consumo
        de los documentos que el usuario sube. Este tratamiento es automatizado, pero
        el usuario puede revisar, corregir y confirmar manualmente los datos antes de
        generar el informe, por lo que no se adoptan decisiones con efectos jurídicos
        basadas únicamente en el tratamiento automatizado. Los datos enviados al
        proveedor de IA no se utilizan por este para entrenar sus modelos, conforme a
        los términos comerciales aplicables a su API.
      </P>

      <H2>5. Destinatarios y encargados del tratamiento</H2>
      <P>
        No vendemos datos personales. Para prestar el Servicio recurrimos a los
        siguientes proveedores, que actúan como encargados del tratamiento bajo
        contrato conforme al art. 28 RGPD:
      </P>
      <Table
        head={["Proveedor", "Función", "Ubicación / transferencia"]}
        rows={[
          [
            "Supabase",
            "Base de datos, autenticación y almacenamiento de facturas e informes.",
            "UE / EE. UU. con garantías adecuadas.",
          ],
          [
            "Vercel",
            "Alojamiento de la aplicación web.",
            "EE. UU. — Cláusulas Contractuales Tipo (CCT).",
          ],
          [
            "Anthropic",
            "Extracción de datos de las facturas mediante IA.",
            "EE. UU. — Cláusulas Contractuales Tipo (CCT).",
          ],
          [
            "Stripe",
            "Procesamiento de pagos.",
            "EE. UU. — Cláusulas Contractuales Tipo (CCT).",
          ],
          [
            "Resend",
            "Envío de correos transaccionales (informes y notificaciones).",
            "EE. UU. — Cláusulas Contractuales Tipo (CCT).",
          ],
        ]}
      />
      <P>
        Algunos proveedores están ubicados fuera del Espacio Económico Europeo. En
        esos casos, las transferencias internacionales se amparan en las Cláusulas
        Contractuales Tipo aprobadas por la Comisión Europea u otras garantías
        adecuadas previstas en el Capítulo V del RGPD. También podremos comunicar datos
        a autoridades públicas cuando exista obligación legal.
      </P>

      <H2>6. Plazos de conservación</H2>
      <UL>
        <LI>
          Datos de cuenta: mientras la cuenta permanezca activa y, tras su
          cancelación, durante los plazos de prescripción de posibles
          responsabilidades.
        </LI>
        <LI>
          Facturas e informes: durante la vigencia del Servicio y hasta que el usuario
          los elimine o solicite su supresión, salvo obligación legal de conservación.
        </LI>
        <LI>
          Datos de facturación: durante los plazos exigidos por la normativa fiscal y
          mercantil (con carácter general, hasta 6 años).
        </LI>
      </UL>

      <H2>7. Derechos de las personas usuarias</H2>
      <P>
        Puedes ejercer los derechos de acceso, rectificación, supresión, oposición,
        limitación del tratamiento y portabilidad, así como retirar el consentimiento
        prestado, escribiendo a{" "}
        <a href="mailto:contact@sellium.eu" className="text-link">
          contact@sellium.eu
        </a>
        . Podemos solicitarte que acredites tu identidad. Desde tu panel puedes,
        además, eliminar tu cuenta y los datos asociados.
      </P>
      <P>
        Si consideras que el tratamiento no se ajusta a la normativa, tienes derecho a
        reclamar ante la Agencia Española de Protección de Datos (AEPD),{" "}
        <a href="https://www.aepd.es" className="text-link" target="_blank" rel="noopener noreferrer">
          www.aepd.es
        </a>
        .
      </P>

      <H2>8. Seguridad</H2>
      <P>
        Aplicamos medidas técnicas y organizativas apropiadas para proteger los datos,
        incluidas la autenticación de usuarios, el control de acceso a nivel de fila en
        la base de datos y el cifrado en tránsito. Ningún sistema es infalible, pero
        trabajamos para reducir los riesgos y responder ante incidentes conforme a la
        normativa.
      </P>

      <H2>9. Menores</H2>
      <P>
        El Servicio se dirige a empresas, autónomos y profesionales, y no está
        destinado a menores de edad.
      </P>

      <H2>10. Cambios en esta política</H2>
      <P>
        Podremos actualizar esta política para reflejar cambios legales o del Servicio.
        Publicaremos la versión vigente en esta página e indicaremos la fecha de última
        actualización; si el cambio es sustancial, te lo comunicaremos por los medios
        adecuados.
      </P>
    </LegalPage>
  );
}
