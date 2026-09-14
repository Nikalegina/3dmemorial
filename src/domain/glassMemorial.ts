export type GlassClarity = 'clear-m1' | 'low-iron'
export type GlassSteleThicknessMm = 12 | 16
export type GlassMountType = 'groove' | 'manet' | 'floor-holder' | 'clamp-profile'
export type GlassUvPrintSides = 1 | 2

export interface GlassSteleConfig {
  clarity: GlassClarity
  thicknessMm: GlassSteleThicknessMm
  mountType: GlassMountType
  uvPrintSides: GlassUvPrintSides
  printEdgeMarginMm: number
}

export interface GlassSizeDefinition {
  id: string
  widthMm: number
  heightMm: number
}

export const GLASS_PRINT_EDGE_MARGIN_MIN_MM = 10 as const

export const GLASS_STELE_THICKNESSES: readonly GlassSteleThicknessMm[] = [12, 16] as const

export const GLASS_CLARITY_OPTIONS = [
  { id: 'clear-m1', name: 'Бесцветное стекло М1' },
  { id: 'low-iron', name: 'Осветлённое стекло (low-iron)' },
] as const

export const GLASS_MOUNT_OPTIONS = [
  { id: 'groove', name: 'Монтаж в паз' },
  { id: 'manet', name: 'Монтаж на манетах' },
  { id: 'floor-holder', name: 'Напольные стеклодержатели' },
  { id: 'clamp-profile', name: 'Зажимной профиль' },
] as const

export const GLASS_UV_PRINT_OPTIONS = [
  { id: 1, name: 'УФ-печать с одной стороны' },
  { id: 2, name: 'УФ-печать с двух сторон' },
] as const

export const GLASS_STELE_STANDARD_SIZES: readonly GlassSizeDefinition[] = [
  { id: '400x800', widthMm: 400, heightMm: 800 },
  { id: '400x900', widthMm: 400, heightMm: 900 },
  { id: '450x900', widthMm: 450, heightMm: 900 },
  { id: '500x1000', widthMm: 500, heightMm: 1000 },
  { id: '500x1100', widthMm: 500, heightMm: 1100 },
  { id: '500x1200', widthMm: 500, heightMm: 1200 },
  { id: '600x1200', widthMm: 600, heightMm: 1200 },
] as const

export const GLASS_PORTRAIT_STANDARD_SIZES = [
  { id: '130x180', widthMm: 130, heightMm: 180, tempered: false, thicknessMm: 8 },
  { id: '180x240', widthMm: 180, heightMm: 240, tempered: false, thicknessMm: 8 },
  { id: '240x300', widthMm: 240, heightMm: 300, tempered: false, thicknessMm: 8 },
  { id: '300x400', widthMm: 300, heightMm: 400, tempered: true, thicknessMm: 8 },
  { id: '400x600', widthMm: 400, heightMm: 600, tempered: true, thicknessMm: 10 },
] as const

export const GLASS_FLOWERBED_PANEL_STANDARD_SIZES = [
  { id: '1050x550-12', widthMm: 550, heightMm: 1050, thicknessMm: 12 },
  { id: '1050x550-16', widthMm: 550, heightMm: 1050, thicknessMm: 16 },
  { id: '1070x600-12', widthMm: 600, heightMm: 1070, thicknessMm: 12 },
  { id: '1070x700-16', widthMm: 700, heightMm: 1070, thicknessMm: 16 },
  { id: '1270x700-12', widthMm: 700, heightMm: 1270, thicknessMm: 12 },
  { id: '1270x700-16', widthMm: 700, heightMm: 1270, thicknessMm: 16 },
] as const

export function createDefaultGlassSteleConfig(): GlassSteleConfig {
  return {
    clarity: 'clear-m1',
    thicknessMm: 12,
    mountType: 'groove',
    uvPrintSides: 1,
    printEdgeMarginMm: GLASS_PRINT_EDGE_MARGIN_MIN_MM,
  }
}

export function normalizeGlassSteleConfig(input?: Partial<GlassSteleConfig> | null): GlassSteleConfig {
  const defaults = createDefaultGlassSteleConfig()
  const thicknessMm: GlassSteleThicknessMm = input?.thicknessMm === 16 ? 16 : 12
  const clarity: GlassClarity = input?.clarity === 'low-iron' ? 'low-iron' : 'clear-m1'
  const mountType: GlassMountType = ['groove', 'manet', 'floor-holder', 'clamp-profile'].includes(input?.mountType ?? '')
    ? input!.mountType as GlassMountType
    : defaults.mountType
  const uvPrintSides: GlassUvPrintSides = input?.uvPrintSides === 2 ? 2 : 1
  const requestedMargin = Number.isFinite(input?.printEdgeMarginMm) ? Number(input?.printEdgeMarginMm) : defaults.printEdgeMarginMm

  return {
    clarity,
    thicknessMm,
    mountType,
    uvPrintSides,
    printEdgeMarginMm: Math.min(80, Math.max(GLASS_PRINT_EDGE_MARGIN_MIN_MM, requestedMargin)),
  }
}

export function glassThicknessMeters(config: Pick<GlassSteleConfig, 'thicknessMm'>): number {
  return config.thicknessMm / 1000
}

export function findStandardGlassSteleSize(widthM: number, heightM: number): GlassSizeDefinition | null {
  const widthMm = Math.round(widthM * 1000)
  const heightMm = Math.round(heightM * 1000)
  return GLASS_STELE_STANDARD_SIZES.find((item) => item.widthMm === widthMm && item.heightMm === heightMm) ?? null
}
