import type { SourceCatalogRawProfileTuple } from './sourceCatalogProfileTypes.ts'

/**
 * Gate 17 only includes elite monuments that can be represented honestly by
 * the existing profile-extrusion engine. Sculptural and open-frame elite
 * products stay in eliteCatalog.ts until their compound/GLB renderers exist.
 */
export const SOURCE_CATALOG_RAW_ELITE = [
  [
    'ermis-elite-19',
    '19',
    26,
    [[1500, 700, 150, ['K06', 'K05', 'K10', 'K11']]],
    [
      [-0.43, 0],
      [0.43, 0],
      [0.46, 0.91],
      [0.28, 0.96],
      [0.08, 1],
      [-0.12, 0.975],
      [-0.31, 1],
      [-0.46, 0.94],
    ],
  ],
] as const satisfies readonly SourceCatalogRawProfileTuple[]
