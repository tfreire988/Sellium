import type { Metadata } from "next";
import { LegalPage, H2, P, UL, LI } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Aviso legal · Sellium",
  description:
    "Aviso legal y condiciones de uso de Sellium, servicio de informes de huella de carbono para pymes y gestorías.",
};

export default function AvisoLegalPage() {
  return (
    <LegalPage title="Aviso legal" updated="12 de julio de 2026" current="aviso-legal">
      <P>
        El presente aviso legal regula el acceso y uso del sitio web y la aplicación
        de Sellium (en adelante, «Sellium», «el Servicio» o «el sitio web»), en
        cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad
        de la Información y de Comercio Electrónico (LSSI-CE).
      </P>

      <H2>1. Titular del sitio web</H2>
      <P>
        En cumplimiento del deber de información recogido en el artículo 10 de la
        LSSI-CE, se facilitan los siguientes datos del titular:
      </P>
      <UL>
        <LI>Titular: Telmo Freire Montero (persona física)</LI>
        <LI>
          Correo electrónico de contacto:{" "}
          <a href="mailto:contacto@sellium.eu" className="text-link">
            contacto@sellium.eu
          </a>
        </LI>
        <LI>
          A efectos de notificaciones, el correo electrónico indicado constituye el
          medio de comunicación directa y efectiva con el titular.
        </LI>
        <LI>Datos registrales: no aplica (persona física, no inscrita en registro mercantil).</LI>
      </UL>

      <H2>2. Objeto</H2>
      <P>
        Sellium es un servicio en línea que permite a pymes, autónomos y gestorías
        elaborar informes de huella de carbono (Alcances 1 y 2, y una estimación de
        Alcance 3) a partir de las facturas de consumo aportadas por el usuario,
        aplicando los factores de emisión oficiales publicados por el Ministerio para
        la Transición Ecológica y el Reto Demográfico (MITECO). El resultado es un
        documento en formato PDF destinado a ser entregado por el usuario a sus
        propios clientes.
      </P>
      <P>
        Sellium es una herramienta de cálculo y elaboración documental. No constituye
        asesoramiento legal, fiscal, medioambiental ni de sostenibilidad, ni sustituye
        a una verificación o certificación por una entidad acreditada cuando esta sea
        exigida por un tercero o por la normativa aplicable.
      </P>

      <H2>3. Condiciones de acceso y uso</H2>
      <P>
        El acceso al sitio web es gratuito, salvo en lo relativo al coste de la
        conexión a través de la red de telecomunicaciones. Determinadas
        funcionalidades requieren registro y la contratación de un servicio de pago.
      </P>
      <P>El usuario se compromete a:</P>
      <UL>
        <LI>
          Utilizar el Servicio conforme a la ley, este aviso legal, la moral y el
          orden público.
        </LI>
        <LI>
          Aportar información veraz en el registro y mantenerla actualizada, siendo el
          único responsable de la exactitud de las facturas y datos que suba.
        </LI>
        <LI>
          Custodiar sus credenciales de acceso y no cederlas a terceros no autorizados.
        </LI>
        <LI>
          No introducir contenidos ilícitos, ni realizar acciones que dañen, inutilicen
          o sobrecarguen el Servicio, o impidan su normal uso por otros usuarios.
        </LI>
        <LI>
          Disponer de los derechos y autorizaciones necesarios sobre la documentación
          que aporte, especialmente cuando incorpore datos de terceros (por ejemplo,
          del cliente destinatario del informe).
        </LI>
      </UL>

      <H2>4. Exactitud de los cálculos y limitación de responsabilidad</H2>
      <P>
        Sellium aplica los factores de emisión oficiales del MITECO vigentes en cada
        ejercicio y una metodología basada en el GHG Protocol. No obstante, el
        resultado del informe depende directamente de la calidad, integridad y
        veracidad de las facturas y datos aportados por el usuario. Sellium no
        garantiza que el informe sea aceptado por el destinatario final ni que
        satisfaga requisitos específicos de esquemas de verificación de terceros.
      </P>
      <P>
        En la medida permitida por la legislación aplicable, Sellium no será
        responsable de los daños derivados de: (i) datos incorrectos, incompletos o
        no veraces aportados por el usuario; (ii) el uso que el usuario o su cliente
        hagan del informe; (iii) interrupciones, errores o indisponibilidad del
        Servicio ajenos a un incumplimiento doloso o gravemente negligente de Sellium.
        Nada de lo aquí dispuesto excluye o limita la responsabilidad que no pueda
        excluirse o limitarse legalmente frente a consumidores.
      </P>

      <H2>5. Propiedad intelectual e industrial</H2>
      <P>
        Los derechos de propiedad intelectual e industrial sobre el sitio web, su
        código, diseño, marca, logotipos y contenidos propios corresponden al titular
        o a los terceros que hayan otorgado las licencias correspondientes. Queda
        prohibida su reproducción, distribución o transformación sin autorización.
      </P>
      <P>
        Las facturas, datos e informes generados por el usuario son de su titularidad.
        El usuario concede a Sellium una licencia limitada para tratarlos con la única
        finalidad de prestar el Servicio, en los términos de la{" "}
        <a href="/legal/privacidad" className="text-link">
          Política de privacidad
        </a>
        .
      </P>

      <H2>6. Enlaces y servicios de terceros</H2>
      <P>
        El Servicio se apoya en proveedores tecnológicos de terceros (alojamiento,
        base de datos, procesamiento de pagos, inteligencia artificial y envío de
        correo) descritos en la{" "}
        <a href="/legal/privacidad" className="text-link">
          Política de privacidad
        </a>
        . Sellium no se responsabiliza de los contenidos o políticas de sitios de
        terceros a los que pueda enlazarse.
      </P>

      <H2>7. Legislación aplicable y jurisdicción</H2>
      <P>
        El presente aviso legal se rige por la legislación española. Para la
        resolución de cualquier controversia, las partes se someten a los juzgados y
        tribunales que resulten competentes conforme a la normativa aplicable. Cuando
        el usuario actúe como consumidor, será competente el fuero que legalmente le
        corresponda y podrá acudir a las vías de resolución de conflictos previstas
        para consumidores.
      </P>

      <H2>8. Modificaciones</H2>
      <P>
        Sellium podrá modificar este aviso legal para adaptarlo a novedades
        legislativas, técnicas o del propio Servicio. La versión vigente será la
        publicada en esta página, con indicación de su fecha de última actualización.
      </P>
    </LegalPage>
  );
}
