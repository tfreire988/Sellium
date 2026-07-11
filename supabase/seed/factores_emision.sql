-- ============================================================================
--  ⚠️  PLACEHOLDER DATA — DO NOT USE FOR REAL REPORTS  ⚠️
-- ============================================================================
--  The values below are illustrative placeholders of the right ORDER OF
--  MAGNITUDE and shape only. They are NOT the official MITECO figures.
--
--  Per project/uploads/sellium-brief-desarrollo.md §5, the real factors MUST be
--  copied from the official MITECO publication for the given `ejercicio`, and
--  prior years must never be deleted (historical reports stay auditable against
--  the factor in force when they were generated).
--
--  Before Sellium computes a single real report:
--    1. Pull the official MITECO factor document for the target year.
--    2. Replace every row below with the published values + exact `fuente`.
--    3. Re-run this seed (it is idempotent via the (ejercicio, tipo_fuente) key).
-- ============================================================================

insert into public.factores_emision (ejercicio, tipo_fuente, factor_kgco2e_por_unidad, unidad, fuente)
values
  -- electricity from the grid (kgCO2e per kWh) — PLACEHOLDER
  (2026, 'electricidad_red', 0.000000, 'kWh', 'PLACEHOLDER — reemplazar con MITECO 2026'),
  -- natural gas (kgCO2e per kWh PCS) — PLACEHOLDER
  (2026, 'gas_natural',      0.000000, 'kWh', 'PLACEHOLDER — reemplazar con MITECO 2026'),
  -- diesel / gasóleo (kgCO2e per litre) — PLACEHOLDER
  (2026, 'gasoleo',          0.000000, 'litros', 'PLACEHOLDER — reemplazar con MITECO 2026'),
  -- petrol / gasolina (kgCO2e per litre) — PLACEHOLDER
  (2026, 'gasolina',         0.000000, 'litros', 'PLACEHOLDER — reemplazar con MITECO 2026')
on conflict (ejercicio, tipo_fuente) do update
  set factor_kgco2e_por_unidad = excluded.factor_kgco2e_por_unidad,
      unidad                    = excluded.unidad,
      fuente                    = excluded.fuente;
