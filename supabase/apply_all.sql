-- =============================================================
-- Sellium — script único para el SQL Editor de Supabase
-- Pega TODO este archivo en Supabase → SQL Editor → Run.
-- Orden: 1) esquema 2) RLS 3) factores MITECO 4) trigger de perfil.
-- Generado a partir de supabase/migrations/*.sql + seed/*.sql
-- =============================================================

-- ========== 1) ESQUEMA (0001_schema.sql) ==========
-- Sellium — core schema
-- Source: project/uploads/sellium-brief-desarrollo.md §2
--
-- All monetary/measurement figures use numeric with explicit scale so reports
-- remain auditable against the emission factor that was in force when generated.

-- ---------------------------------------------------------------------------
-- profiles — one row per account (pyme or gestoría), keyed to auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre_empresa text not null,
  nif text,
  tipo_cuenta text not null default 'pyme'
    check (tipo_cuenta in ('pyme', 'gestoria')),
  plan text not null default 'trial'
    check (plan in ('trial', 'informe_unico', 'gestoria_mensual')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- clientes_gestionados — end clients managed by a gestoría
-- (empty for tipo_cuenta = 'pyme')
-- ---------------------------------------------------------------------------
create table if not exists public.clientes_gestionados (
  id uuid primary key default gen_random_uuid(),
  gestoria_id uuid not null references public.profiles (id) on delete cascade,
  nombre_empresa text not null,
  nif text,
  email_contacto text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- destinatarios — the "big client" that requested the ESG/footprint report
-- ---------------------------------------------------------------------------
create table if not exists public.destinatarios (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  cliente_gestionado_id uuid references public.clientes_gestionados (id) on delete cascade,
  nombre_cliente_grande text not null,
  formato_preferido text, -- detected template or 'generico'
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- facturas_consumo — uploaded consumption bills (source data)
-- ---------------------------------------------------------------------------
create table if not exists public.facturas_consumo (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  cliente_gestionado_id uuid references public.clientes_gestionados (id) on delete cascade,
  tipo text not null
    check (tipo in ('electricidad', 'gas', 'combustible', 'otro')),
  archivo_url text not null, -- path in Supabase Storage
  periodo_inicio date,
  periodo_fin date,
  consumo_extraido numeric(12, 2), -- kWh or litres, per `unidad`
  unidad text check (unidad in ('kWh', 'm3', 'litros')),
  estado_extraccion text not null default 'pendiente'
    check (estado_extraccion in ('pendiente', 'ok', 'revision_manual')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- informes — generated reports
-- ---------------------------------------------------------------------------
create table if not exists public.informes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  destinatario_id uuid not null references public.destinatarios (id) on delete restrict,
  cliente_gestionado_id uuid references public.clientes_gestionados (id) on delete cascade,
  ejercicio int not null default extract(year from now())::int,
  alcance1_tco2e numeric(10, 3),
  alcance2_tco2e numeric(10, 3),
  alcance3_estimado_tco2e numeric(10, 3),
  metodologia text not null default 'GHG Protocol + factores MITECO',
  pdf_url text,
  estado text not null default 'borrador'
    check (estado in ('borrador', 'listo', 'enviado')),
  enviado_a_email text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- factores_emision — MITECO emission factors, kept in-house and versioned by
-- `ejercicio` so historical reports stay auditable. Updated once a year; never
-- delete prior years (see brief §5).
-- ---------------------------------------------------------------------------
create table if not exists public.factores_emision (
  id uuid primary key default gen_random_uuid(),
  ejercicio int not null,
  tipo_fuente text not null, -- 'electricidad_red' | 'gas_natural' | 'gasoleo' | ...
  factor_kgco2e_por_unidad numeric(10, 6) not null,
  unidad text not null, -- 'kWh' | 'm3' | 'litros'
  fuente text not null default 'MITECO',
  created_at timestamptz not null default now(),
  unique (ejercicio, tipo_fuente)
);

-- Helpful indexes for the common access paths.
create index if not exists idx_clientes_gestionados_gestoria on public.clientes_gestionados (gestoria_id);
create index if not exists idx_destinatarios_profile on public.destinatarios (profile_id);
create index if not exists idx_facturas_profile on public.facturas_consumo (profile_id);
create index if not exists idx_informes_profile on public.informes (profile_id);
create index if not exists idx_factores_lookup on public.factores_emision (ejercicio, tipo_fuente);

-- ========== 2) RLS (0002_rls.sql) ==========
-- Sellium — Row Level Security
-- Source: project/uploads/sellium-brief-desarrollo.md §2 notes
--
-- Rule: a 'pyme' profile sees only its own rows; a 'gestoria' profile sees its
-- own rows plus everything tied to the clientes_gestionados it owns. Because
-- every domain row already carries `profile_id = auth.uid()` for the owning
-- account, `profile_id = auth.uid()` is the base predicate; the gestoría's
-- managed clients are reached through clientes_gestionados.gestoria_id.
--
-- The server uses the service-role key (which bypasses RLS) only inside trusted
-- API routes. These policies protect any access made with the user's own JWT.

alter table public.profiles            enable row level security;
alter table public.clientes_gestionados enable row level security;
alter table public.destinatarios        enable row level security;
alter table public.facturas_consumo     enable row level security;
alter table public.informes             enable row level security;
alter table public.factores_emision     enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: a user reads/updates only their own profile.
-- ---------------------------------------------------------------------------
create policy profiles_select_own on public.profiles
  for select using (id = auth.uid());
create policy profiles_insert_own on public.profiles
  for insert with check (id = auth.uid());
create policy profiles_update_own on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- clientes_gestionados: owned by the gestoría profile.
-- ---------------------------------------------------------------------------
create policy clientes_all_own on public.clientes_gestionados
  for all
  using (gestoria_id = auth.uid())
  with check (gestoria_id = auth.uid());

-- Reusable predicate: the current user owns this managed client.
-- (Inlined in each policy below rather than a SQL function to keep the
-- migration self-contained.)

-- ---------------------------------------------------------------------------
-- destinatarios
-- ---------------------------------------------------------------------------
create policy destinatarios_all_own on public.destinatarios
  for all
  using (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  )
  with check (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- facturas_consumo
-- ---------------------------------------------------------------------------
create policy facturas_all_own on public.facturas_consumo
  for all
  using (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  )
  with check (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- informes
-- ---------------------------------------------------------------------------
create policy informes_all_own on public.informes
  for all
  using (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  )
  with check (
    profile_id = auth.uid()
    or cliente_gestionado_id in (
      select id from public.clientes_gestionados where gestoria_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- factores_emision: reference data. Any authenticated user may read it (needed
-- to compute a report); only the service role writes it (annual maintenance).
-- ---------------------------------------------------------------------------
create policy factores_select_all on public.factores_emision
  for select using (auth.role() = 'authenticated');

-- ========== 3) FACTORES MITECO (seed) ==========
-- ============================================================================
--  Factores de emisión oficiales del MITECO — datos REALES (no estimados)
-- ============================================================================
--  Fuente: MITECO, "Factores de emisión. Registro de huella de carbono,
--  compensación y proyectos de absorción de dióxido de carbono."
--  Edición 2026 · versión V6, publicada 2026-05-07.
--  Cubre 2007–2025; el año de factor más reciente publicado es 2025.
--
--  Archivo: factoresemision_tcm30-542746.xlsx
--    · Hoja "2. Instalaciones fijas"        → gas natural, gasóleos, GLP…
--    · Hoja "3. Vehículos y maquinaria"     → carburantes de automoción
--    · Hoja "5. Factores de mix eléctricos" → electricidad
--
--  Todos los factores están en kgCO2e por unidad (CO2e = CO2 + CH4 + N2O).
--  NO modificar los valores a mano: al publicarse una nueva edición anual del
--  MITECO, añadir el nuevo `ejercicio` con esos valores y NO borrar los años
--  anteriores (los informes ya emitidos deben poder auditarse con el factor que
--  se usó — brief de desarrollo §5).
--
--  Nota de unidades:
--   · Gas natural: kgCO2e por kWh de PCS (Poder Calorífico Superior). Para pasar
--     de PCS a PCI, MITECO usa el factor 0,901. Las facturas de gas en España se
--     expresan en kWh, por eso `unidad = 'kWh'`.
--   · Electricidad: "Mix sin GdO" es el factor nacional que MITECO indica aplicar
--     cuando NO se conoce la comercializadora concreta ni sus Garantías de Origen.
--     Comercializadoras con GdO 100% renovable = 0; con GdO cogeneración de alta
--     eficiencia = 0,302. La hoja 5 lista el factor por comercializadora si se
--     conoce el suministrador exacto.
--   · Automoción: la gasolina y el gasóleo de surtidor se venden mezclados por
--     mandato legal (gasolina = E5/E10; gasóleo A = B7), por eso los valores de
--     'gasolina' y 'gasoleo_a' provienen de esas mezclas. Categoría de referencia:
--     Turismos (M1); MITECO desglosa por tipo de vehículo en la hoja 3.
-- ============================================================================

insert into public.factores_emision (ejercicio, tipo_fuente, factor_kgco2e_por_unidad, unidad, fuente)
values
  -- Electricidad — Hoja 5, "Mix sin GdO", 2025
  (2025, 'electricidad_red', 0.258000, 'kWh', 'MITECO Ed.2026 (V6) · Hoja 5 Mix sin GdO · 2025'),
  (2025, 'electricidad_gdo_renovable', 0.000000, 'kWh', 'MITECO Ed.2026 (V6) · Hoja 5 GdO renovable · 2025'),
  (2025, 'electricidad_gdo_cogeneracion', 0.302000, 'kWh', 'MITECO Ed.2026 (V6) · Hoja 5 GdO cogeneración alta eficiencia · 2025'),

  -- Gas natural — Hoja 2, "Gas natural (kWhPCS)", 2025
  (2025, 'gas_natural', 0.182000, 'kWh', 'MITECO Ed.2026 (V6) · Hoja 2 Gas natural (kWh PCS) · 2025'),

  -- Gasóleos — Hoja 2 (instalaciones fijas) y Hoja 3 (automoción), 2025
  (2025, 'gasoleo_a', 2.516000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 3 B7 Turismos M1 (gasóleo A surtidor) · 2025'),
  (2025, 'gasoleo_c', 2.898000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 2 Gasóleo C (calefacción) · 2025'),
  (2025, 'gasoleo_b', 2.737000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 2 Gasóleo B · 2025'),

  -- Gasolina — Hoja 3, "E5" Turismos M1 (gasolina de surtidor), 2025
  (2025, 'gasolina', 2.249000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 3 E5 Turismos M1 (gasolina surtidor) · 2025'),

  -- GLP / gases licuados — Hoja 2 (fijas) y Hoja 3 (automoción), 2025
  (2025, 'glp_auto', 1.661000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 3 LPG Turismos M1 · 2025'),
  (2025, 'glp', 1.545000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 2 LPG · 2025'),
  (2025, 'gas_propano', 2.966000, 'kg', 'MITECO Ed.2026 (V6) · Hoja 2 Gas propano · 2025'),
  (2025, 'gas_butano', 2.996000, 'kg', 'MITECO Ed.2026 (V6) · Hoja 2 Gas butano · 2025'),

  -- Fuelóleo — Hoja 2, 2025
  (2025, 'fueloleo', 3.031000, 'litros', 'MITECO Ed.2026 (V6) · Hoja 2 Fuelóleo · 2025')
on conflict (ejercicio, tipo_fuente) do update
  set factor_kgco2e_por_unidad = excluded.factor_kgco2e_por_unidad,
      unidad                    = excluded.unidad,
      fuente                    = excluded.fuente;

-- ========== 4) TRIGGER DE PERFIL (0003_profile_trigger.sql) ==========
-- Sellium — auto-create a profile row when a user signs up.
--
-- The registro form passes nombre_empresa / nif / tipo_cuenta as auth user
-- metadata (options.data). This trigger copies them into public.profiles so the
-- profile always exists by the time the user reaches the app — no client-side
-- insert, no race with email confirmation.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nombre_empresa, nif, tipo_cuenta)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nombre_empresa', 'Mi empresa'),
    nullif(new.raw_user_meta_data ->> 'nif', ''),
    coalesce(new.raw_user_meta_data ->> 'tipo_cuenta', 'pyme')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
