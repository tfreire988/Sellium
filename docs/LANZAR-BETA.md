# Lanzar la beta de Sellium

Checklist para dejar la beta gratis funcionando en producción. Orden recomendado.
Todo lo de código ya está hecho; esto es **configuración** en Supabase y Vercel.

---

## 1. Supabase — base de datos

Proyecto: `https://xbtiruphqnjphhbazmha.supabase.co`

### 1.1 Ejecutar el SQL

Supabase → **SQL Editor** → pega **todo** el contenido de
[`supabase/apply_all.sql`](../supabase/apply_all.sql) → **Run**.

Crea, en orden: esquema (tablas), políticas RLS, factores de emisión del MITECO
(13 filas, ejercicio 2025) y el trigger que crea el perfil al registrarse.

- Si sale **"Success. No rows returned"** → perfecto.
- Si ya lo habías ejecutado y ahora sale **"... already exists"** → normal, ya estaba
  puesto. Puedes ignorarlo.

Comprueba que hay factores cargados:

```sql
select ejercicio, count(*) from public.factores_emision group by ejercicio;
-- debe devolver: 2025 | 13
```

### 1.2 Crear los buckets de Storage

Supabase → **Storage** → **New bucket**. Crea **dos**, ambos **privados**
(desmarca "Public bucket"):

| Nombre | Público | Para qué |
|---|---|---|
| `facturas` | No | Facturas que sube el usuario |
| `informes` | No | PDFs de los informes generados |

> Los nombres tienen que ser exactos (`facturas` e `informes`). El acceso va siempre
> por el servidor con URLs firmadas; por eso son privados.

### 1.3 Configurar las URLs de autenticación

Supabase → **Authentication** → **URL Configuration**:

- **Site URL**: la URL de tu proyecto en Vercel (p. ej. `https://sellium.vercel.app`
  o tu dominio propio cuando lo tengas).
- **Redirect URLs**: añade
  - `https://TU-DOMINIO-VERCEL/**`
  - `http://localhost:3000/**` (para desarrollo local)

Sin esto, el registro/login y la recuperación de contraseña no redirigen bien.

---

## 2. Vercel — variables de entorno

Vercel → tu proyecto → **Settings** → **Environment Variables**. Añade estas
(Production y Preview):

### Imprescindibles (sin ellas la app no arranca)

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (secreta) |

### Opcionales (la beta funciona sin ellas)

| Variable | Qué habilita | Si falta… |
|---|---|---|
| `ANTHROPIC_API_KEY` | Lectura automática de facturas con IA | Se usa la confirmación **manual** del consumo (funciona igual) |
| `RESEND_API_KEY` + `SELLIUM_FROM_EMAIL` | Enviar el informe por email al cliente | Se descarga el PDF y se envía a mano |
| `STRIPE_*` | Cobros | No hacen falta: la beta es gratis |

Tras añadirlas, Vercel → **Deployments** → **Redeploy** (o haz un push a `main`).

---

## 3. Seguridad — rotar la service_role key

La `service_role` key se compartió por chat durante el desarrollo. Antes de abrir
la beta al público, **rótala**:

Supabase → Settings → API → **Roll** `service_role` → copia la nueva → actualízala en
Vercel (`SUPABASE_SERVICE_ROLE_KEY`) y en tu `.env.local`. La antigua queda inválida.

---

## 4. Prueba de humo (5 min)

1. Entra en tu web de Vercel → **Crear una cuenta** (registro).
2. Confirma el email si Supabase lo pide (Authentication → Providers → Email).
3. **Nuevo informe** → sube una factura de prueba (o rellena el consumo a mano).
4. Indica un cliente → **Generar informe**.
5. Comprueba que se abre el informe, la tarjeta del MITECO y que **Descargar PDF**
   funciona.

Si algo falla, mira Vercel → Deployments → el deploy → **Logs** (Functions): el error
suele decir qué variable o bucket falta.

---

## 5. Pendientes tuyos (no bloquean la beta)

- [ ] Abrir una vez el enlace del registro del MITECO y confirmar que la URL sigue
      vigente (`src/components/panel/RegistroMiteco.tsx`).
- [ ] Cuando quieras **cobrar**: darte de alta como autónomo + activar Stripe +
      añadir Términos de venta y DPA.
- [ ] Verificar el dominio en Resend para enviar emails desde `@sellium.es`.
