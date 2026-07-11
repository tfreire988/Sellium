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
