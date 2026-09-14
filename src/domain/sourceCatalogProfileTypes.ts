export type SourceCatalogProfileId = `ermis-${string}`

export type SourceCatalogVariantTuple = readonly [
  heightMm: number,
  widthMm: number,
  depthMm: number,
  materialCodes: readonly string[],
]

export type SourceCatalogPointTuple = readonly [x: number, y: number]

export type SourceCatalogRawProfileTuple = readonly [
  id: SourceCatalogProfileId,
  sourceModel: string,
  sourcePage: number,
  variants: readonly SourceCatalogVariantTuple[],
  points: readonly SourceCatalogPointTuple[],
]

export interface SourceCatalogVariant {
  heightMm: number
  widthMm: number
  depthMm: number
  materialCodes: readonly string[]
}

export interface SourceCatalogProfile {
  id: SourceCatalogProfileId
  sourceModel: string
  sourcePage: number
  variants: readonly SourceCatalogVariant[]
  points: readonly SourceCatalogPointTuple[]
}
