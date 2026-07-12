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
