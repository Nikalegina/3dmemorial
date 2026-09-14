import type { SourceCatalogRawProfileTuple } from './sourceCatalogProfileTypes.ts'

/**
 * Elite catalog runtime registry.
 *
 * Profile #19 uses the normal silhouette-extrusion renderer.
 * #4/#22/#24/#25 are registered here for source lookup, dimensions and materials,
 * but their visible runtime geometry is rendered by EliteCompoundStele.
 * Their points are only bounded outer envelopes and must not be interpreted as
 * manufacturing contours or as the authoritative visible geometry.
 */
export const SOURCE_CATALOG_RAW_ELITE = [
  [
    'ermis-elite-4',
    '4',
    25,
    [[1630, 1180, 200, ['K06', 'K05', 'K10', 'K11']]],
    [
      [-0.5, 0],
      [0.5, 0],
      [0.5, 0.69],
      [0.43, 0.69],
      [0.39, 0.82],
      [0.27, 0.95],
      [0, 1],
      [-0.27, 0.95],
      [-0.39, 0.82],
      [-0.43, 0.69],
      [-0.5, 0.69],
    ],
  ],
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
  [
    'ermis-elite-22',
    '22',
    27,
    [[2000, 1200, 200, ['K13', 'K06']]],
    [
      [-0.5, 0],
      [0.5, 0],
      [0.5, 0.7],
      [0.42, 0.7],
      [0.37, 0.84],
      [0.25, 0.96],
      [0, 1],
      [-0.25, 0.96],
      [-0.37, 0.84],
      [-0.42, 0.7],
      [-0.5, 0.7],
    ],
  ],
  [
    'ermis-elite-24',
    '24',
    27,
    [
      [2500, 1200, 300, ['K05', 'K06', 'K10', 'K11']],
      [2500, 1200, 250, ['K13', 'K14']],
    ],
    [
      [-0.46, 0],
      [0.46, 0],
      [0.46, 0.76],
      [0.4, 0.82],
      [0.28, 0.87],
      [0.08, 0.9],
      [0.05, 1],
      [-0.05, 1],
      [-0.08, 0.9],
      [-0.28, 0.87],
      [-0.4, 0.82],
      [-0.46, 0.76],
    ],
  ],
  [
    'ermis-elite-25',
    '25',
    27,
    [[1200, 1500, 250, ['K14']]],
    [
      [-0.5, 0],
      [0.5, 0],
      [0.5, 0.82],
      [0.42, 0.89],
      [0.18, 0.94],
      [0, 0.96],
      [-0.18, 0.94],
      [-0.42, 0.89],
      [-0.5, 0.82],
    ],
  ],
] as const satisfies readonly SourceCatalogRawProfileTuple[]
