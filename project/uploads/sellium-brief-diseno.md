# Sellium — Brief de diseño (sitio web + app)

*Nombre confirmado: dominio disponible en Namecheap. Pendiente aún verificar marca en la OEPM antes de darlo por definitivo. "Sellium" viene de "sello" (el momento de satisfacción del producto: el informe queda "sellado" y listo para el cliente) + sufijo de sonoridad tecnológica — el nombre y el elemento visual de marca (el sello dibujado a mano) se refuerzan mutuamente.*

**Producto:** micro-SaaS que traduce el cuestionario ESG/huella de carbono que una gran empresa exige a su proveedor pyme, en un informe listo para entregar — sin que el usuario tenga que entender GHG Protocol, Alcances ni jerga de sostenibilidad.

**Audiencia real (dos perfiles, diseñar para ambos):**
1. **Dueño de pyme/autónomo** (taller, imprenta, transportista, limpieza industrial) al que su cliente grande le ha pedido "su huella de carbono" y no sabe qué es eso ni por dónde empezar.
2. **Gestoría/asesoría** que gestiona esto para varios de sus clientes a la vez — perfil más profesional, compra en volumen, necesita gestionar varios informes desde un mismo panel.

---

## 1. Marca y voz

**Personalidad:** un trámite que por fin alguien te resuelve sin rodeos — no un activista medioambiental, no una consultora cara. El tono es de alivio práctico ("esto que te están pidiendo, lo resolvemos hoy"), nunca de discurso de sostenibilidad corporativa.

**Regla de tono:** cercano y claro con el dueño de pyme (que llega agobiado y sin saber el vocabulario); profesional y eficiente con la gestoría (que ya sabe de qué se habla y quiere velocidad, no explicaciones básicas).

**Lo que Sellium nunca hace:** sermonear sobre el cambio climático, usar iconografía de hojitas/planeta verde genérica, ni hacer sentir culpable al usuario por no haber medido antes su huella — llega sin juzgar, a resolver.

---

## 2. Sistema de diseño (tokens)

### Color
| Token | Hex | Uso |
|---|---|---|
| `ink` (fondo) | `#1C2620` | Fondo principal, verde pino muy oscuro — serio, no "eco-genérico" |
| `paper` | `#F2EEE0` | Tarjetas tipo documento/certificado |
| `paper-text` | `#241F16` | Texto sobre `paper` |
| `paper-muted` | `#7C7368` | Texto secundario sobre `paper` |
| `sello` (acento primario) | `#B8763A` | CTAs, acción de generar informe — ocre tierra, no el terracota genérico de IA (`#D97757`) |
| `verificado` (éxito) | `#4F6B4A` | Informe generado, checks de cumplimiento — verde musgo, no verde neón |
| `ink-text` | `#F2EEE0` | Texto sobre `ink` |
| `ink-muted` | `#8C9689` | Texto secundario sobre `ink` |
| `alerta` | `#C9752A` | Avisos (factura ilegible, dato faltante) |
| `error` | `#9C3B3B` | Errores reales de procesamiento |

### Tipografía
- **Fraunces** (serif, 500-700): titulares del sitio, nombres de informe, momentos de mayor peso.
- **IBM Plex Sans** (400-600): cuerpo, botones, formularios.
- **IBM Plex Mono** (400-500): cifras — toneladas de CO₂e, consumos, importes, fechas de informe.
- Nada de tipografía manuscrita aquí (a diferencia de otros productos): esta audiencia es más formal — dueños de pyme agobiados y gestorías profesionales no necesitan calidez artesanal, necesitan sentir seriedad y velocidad.

### Imperfección deliberada (con matiz respecto a otros productos)
Mantén el lenguaje visual de "documento real, no plantilla de SaaS": tarjetas con esquinas desiguales, ligera rotación en tarjetas de informe (entre -1deg y 0.8deg), sombras cálidas nunca grises. **Pero reduce la intensidad** respecto a un producto dirigido a autónomos creativos — aquí cada informe final debe leerse como un documento serio que alguien va a entregar a un cliente exigente, así que la imperfección vive en la interfaz de la app, nunca en el PDF de salida (el PDF final debe ser impecable, formal, sin ningún toque "hecho a mano").

### Elemento de firma: el sello de cumplimiento
Un sello circular dibujado a mano (mismo patrón técnico que `HandStamp` de proyectos anteriores, adaptado a esta paleta) que aparece cuando el informe queda listo — con la palabra "Listo para tu cliente" o el nombre del cliente destinatario. Es el momento de mayor satisfacción del producto: el usuario llegó agobiado por un cuestionario que no entendía, y termina con algo que parece (y es) profesional.

---

## 3. Cómo evitar que se note que lo ha hecho una IA (esto importa más que el color)

La paleta y la tipografía de la sección 2 ya evitan los clichés de color más obvios. Pero el "olor a IA" que detecta el ojo humano hoy en día está sobre todo en la **estructura y composición de la página**, no en los tokens de color — y esa parte hay que decidirla activamente, porque por defecto cualquier generador (incluido yo mismo si no se me da esta instrucción explícita) tiende a producir siempre el mismo esqueleto.

**El esqueleto que hay que evitar por defecto:**
Nav pegajoso → hero centrado con titular + subtítulo + botón, todo alineado al centro → fila de "logos de clientes" → 3 tarjetas idénticas con icono+título+párrafo → sección de testimonios en carrusel → tabla de precios de 2-3 columnas simétricas → acordeón de FAQ → footer de 4 columnas. Si Sellium sigue este orden exacto con estas proporciones exactas, se va a notar sin importar qué colores use.

**Reglas concretas para este proyecto:**

1. **Rompe la simetría del hero.** El titular y el CTA no van centrados — van alineados a un lado, y el espacio del otro lado lo ocupa el elemento visual (ver punto 4), con proporciones desiguales entre texto e imagen (ej. 40/60, nunca 50/50).

2. **No repitas el mismo tratamiento de tarjeta 3 veces.** En la sección "Cómo funciona" (3 pasos), varía el peso visual entre los tres: el paso 1 puede llevar el sello dibujado a mano como numeración, el paso 2 puede ser más tipográfico sin icono, el paso 3 puede incluir el fragmento real de informe. Que no parezca una plantilla clonada tres veces con solo el texto cambiado.

3. **Muestra el artefacto real, no una ilustración abstracta.** El elemento visual del hero debe ser un fragmento reconocible del informe PDF real que genera el producto — no un dashboard genérico, no un blob de gradiente, no un icono 3D flotante. Es lo más "no genérico" que puedes hacer, porque ningún competidor ni ninguna plantilla puede mostrar exactamente ese documento.

4. **Nada de blobs de gradiente decorativos de fondo.** Es probablemente el tell visual más reconocible de una landing generada por IA en 2025-2026. Si hace falta textura de fondo, usa el `GrainOverlay` ya definido u otros recursos propios del sistema, nunca formas orgánicas difuminadas en colores de acento.

5. **Varía la escala tipográfica de forma menos uniforme.** En vez de una progresión perfectamente proporcional h1 > h2 > h3, deja que algún titular secundario sea deliberadamente más grande de lo esperado y algún texto de apoyo más pequeño de lo esperado — la jerarquía perfecta y predecible es otro tell.

6. **Cero prueba social inventada.** Ya lo vimos con el hallazgo de Factibo: avatares genéricos repetidos con nombres inventados se detecta y además daña la confianza cuando se descubre. Si no hay testimonios reales todavía, la sección de confianza se apoya en la mención a los factores oficiales del MITECO (sección 4.6), no en reseñas ficticias.

7. **Reordena o fusiona secciones del esqueleto esperado.** Por ejemplo, la sección de precios puede ir inmediatamente después de "Cómo funciona" en vez de casi al final — reduce la sensación de checklist predecible que ya reconoce el usuario de mil landings anteriores.



### 3.1 Hero
**Titular (Fraunces, grande):** "Tu cliente te ha pedido tu huella de carbono. Aquí la tienes en un día."
**Subtítulo:** una frase que nombra el dolor exacto sin jerga — "Sube tus facturas de luz y combustible. Nosotros hacemos el resto y te damos algo que tu cliente va a aceptar."
**CTA primario (`sello`):** "Empezar mi informe" o "Ver cómo funciona" según si el visitante llega ya decidido (tráfico de gestoría) o explorando (tráfico de búsqueda).
**Elemento visual:** una tarjeta-documento mostrando un fragmento de informe ya generado (ficticio, de ejemplo) con el sello de "Listo para [Nombre Cliente]" — deja ver el resultado final desde el primer segundo, no una ilustración abstracta.

### 3.2 El problema (agitar sin sermonear)
Tres líneas cortas, cada una nombrando una fricción real y concreta: "no sabes qué es Alcance 1 ni Alcance 2", "una consultora te cobra 2.000€ por algo que haces una vez al año", "tu gestoría no incluye esto en su servicio habitual". Sin gráficos de planeta ni CO₂ dramatizado — solo el problema administrativo tal cual.

### 3.3 Cómo funciona (3 pasos, no más)
1. Sube tus facturas (foto o PDF) — icono de factura, no de nube/IA genérica.
2. Te preguntamos para qué cliente es el informe — para adaptarlo a lo que ese cliente concreto pide.
3. Descarga el informe firmado, listo para enviar.

### 3.4 Para gestorías (sección separada, tono distinto)
Bloque específico: "¿Gestionas varios clientes con este mismo problema?" — mensaje de eficiencia y volumen, con mención a panel multi-cliente y precio por volumen. Visualmente puede diferenciarse con un fondo `paper` en vez de `ink`, para marcar que es una sección "aparte" dirigida a otro perfil.

### 3.5 Precios
Tarjetas-documento con los dos planes (informe único vs. plan gestoría), precio en IBM Plex Mono grande, y una frase de ROI explícita bajo cada uno ("una consultora cobra 10-20 veces más por esto mismo"). Transparencia total, sin "contacta con ventas" para el plan individual.

### 3.6 Confianza / cumplimiento
Una línea breve indicando que los cálculos usan los factores de emisión oficiales del MITECO — esto es el equivalente de "sello Verifactu" en otros productos: la palabra que da legitimidad instantánea a ojos de quien no sabe del tema.

### 3.7 CTA final + footer
Repetición simple del CTA principal. Footer minimalista: enlaces legales, contacto, sin redes sociales infladas si todavía no existen.

---

## 5. Pantallas de la app — especificación

### 4.1 Subida de facturas
Zona de arrastre/carga (drag-and-drop + botón de cámara para móvil) sobre una tarjeta-documento. Mensaje claro: "Sube las facturas de luz, gas o combustible del último año — cuantas más, más preciso el informe." Lista de archivos subidos con miniatura, no una tabla fría.

### 4.2 Selección de destinatario
Antes de procesar, un desplegable simple: "¿Para qué cliente es este informe?" con opción de escribir el nombre si no está en la lista. Este paso es el corazón de la diferenciación del producto — coméntalo así en cualquier copy de ayuda contextual.

### 4.3 Procesando
Pantalla de espera breve con mensaje de progreso concreto, no genérico: "Leyendo tus facturas… calculando con los factores oficiales del MITECO…" — nombrar el paso real genera más confianza que una barra de carga muda.

### 4.4 Informe generado
Tarjeta-documento con el resumen (Alcance 1, Alcance 2, estimación de Alcance 3 si aplica), el sello de "Listo para [Cliente]", botón de descarga de PDF y botón de "Enviar por email directamente al contacto de mi cliente" si se ha indicado.

### 4.5 Historial (para uso recurrente y para gestorías)
Lista de informes generados por cliente propio y, en el caso de gestoría, agrupado por cliente final gestionado. Estado de cada informe (borrador / listo / enviado).

### 4.6 Panel de gestoría (multi-cliente)
Vista adicional exclusiva del plan gestoría: lista de todos sus clientes finales, estado del informe de cada uno, y botón de "Solicitar facturas a este cliente" que envía un enlace de subida simplificado al cliente final (para que la gestoría no tenga que pedir manualmente las facturas por email).

### 4.7 Planes / suscripción
Igual que en el sitio: tarjetas comparativas, transparencia de precio total, sin letra pequeña.

---

## 6. Anti-patrones de color e iconografía (además de los estructurales de la sección 3)

- Nada de iconografía de hoja verde, planeta Tierra o gotas de agua genéricas — es el atajo visual que usa todo el sector y no comunica nada específico de Sellium.
- Nada de gradientes verdes brillantes tipo "app de sostenibilidad corporativa" — la paleta de este documento es deliberadamente terrosa y seria, no "eco-friendly startup".
- Nada de dashboards con gráficos circulares y métricas que el usuario no pidió ver — el usuario no quiere "gestionar su sostenibilidad", quiere resolver un trámite puntual y seguir con su día.
- El PDF de salida nunca lleva imperfección de marca (rotaciones, esquinas desiguales) — tiene que poder colarse sin extrañeza en la bandeja de entrada de un departamento de compras serio.
