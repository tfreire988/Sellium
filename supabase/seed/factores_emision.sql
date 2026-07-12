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
