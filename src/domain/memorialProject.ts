import type {
  BenchStyleId,
  BorderStyleId,
  FenceStyleId,
  FurnitureSide,
  GateSide,
  PavingStyleId,
  TableStyleId,
  VasePlacement,
  VaseStyleId,
} from './componentCatalog.ts'

export type MonumentShape =
  | 'rectangle'
  | 'rounded-rectangle'
  | 'arch'
  | 'dome'
  | 'slant'
  | 'bevel-left'
  | 'bevel-right'
  | 'wave'
  | 'ogee'
  | 'shield'
  | 'book'
  | 'teardrop'
  | 'heart'
  | 'muslim-arch'
  | 'muslim-dome'

export type MonumentMaterial = 'gabbro' | 'glass' | 'hybrid'
export type SurfaceMaterialId =
  | 'gabbro-polished'
  | 'gabbro-matte'
  | 'granite-grey'
  | 'granite-red'
  | 'granite-brown'
  | 'granite-green'
  | 'glass-clear'
  | 'glass-frosted'
  | 'glass-smoke'
  | 'glass-bronze'
export type PortraitMode = 'color' | 'bw' | 'engraving'

export interface MemorialProject {
  schemaVersion: 3
  projectId: string
  plot: {
    widthM: number
    depthM: number
  }
  monument: {
    shape: MonumentShape
    material: MonumentMaterial
    surfaceId: SurfaceMaterialId
    widthM: number
    heightM: number
    depthM: number
  }
  portrait: {
    mode: PortraitMode
    enabled: boolean
    offsetX: number
    offsetY: number
    zoom: number
  }
  inscription: {
    enabled: boolean
    name: string
    dates: string
    epitaph: string
  }
  flowerBed: { enabled: boolean; styleId: 'open-granite' | 'closed-granite' }
  plinth: { enabled: boolean; materialId: 'gabbro' | 'grey-granite' }
  paving: { enabled: boolean; styleId: PavingStyleId }
  border: { enabled: boolean; styleId: BorderStyleId }
  fence: { enabled: boolean; styleId: FenceStyleId; gateSide: GateSide }
  bench: { enabled: boolean; styleId: BenchStyleId; side: FurnitureSide }
  table: { enabled: boolean; styleId: TableStyleId; side: FurnitureSide }
  vase: { enabled: boolean; styleId: VaseStyleId; placement: VasePlacement }
}

interface LegacyProjectV1 {
  schemaVersion: 1
  projectId: string
  plot: MemorialProject['plot']
  monument: Omit<MemorialProject['monument'], 'surfaceId'>
  portrait: Pick<MemorialProject['portrait'], 'mode' | 'enabled'>
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}

interface LegacyProjectV2 {
  schemaVersion: 2
  projectId: string
  plot: MemorialProject['plot']
  monument: MemorialProject['monument']
  portrait: MemorialProject['portrait']
  inscription: MemorialProject['inscription']
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}

export const PROJECT_SCHEMA_VERSION = 3 as const

function defaultSurfaceFor(material: MonumentMaterial): SurfaceMaterialId {
  return material === 'glass' ? 'glass-clear' : 'gabbro-polished'
}

function defaultManagedComponents(input: {
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}) {
  return {
    flowerBed: { enabled: input.flowerBed.enabled, styleId: 'open-granite' as const },
    plinth: { enabled: input.plinth.enabled, materialId: 'gabbro' as const },
    paving: { enabled: input.paving.enabled, styleId: 'stone-grey' as const },
    border: { enabled: false, styleId: 'granite-dark' as const },
    fence: { enabled: input.fence.enabled, styleId: 'classic-black' as const, gateSide: 'front' as const },
    bench: { enabled: input.bench.enabled, styleId: 'wood-classic' as const, side: 'right' as const },
    table: { enabled: input.table.enabled, styleId: 'round-granite' as const, side: 'left' as const },
    vase: { enabled: input.vase.enabled, styleId: 'classic-vase' as const, placement: 'right' as const },
  }
}

export function createDefaultProject(): MemorialProject {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: 'LOCAL-DRAFT',
    plot: { widthM: 2, depthM: 2.4 },
    monument: {
      shape: 'arch',
      material: 'gabbro',
      surfaceId: 'gabbro-polished',
      widthM: 0.65,
      heightM: 1.25,
      depthM: 0.09,
    },
    portrait: { mode: 'color', enabled: true, offsetX: 0, offsetY: 0, zoom: 1 },
    inscription: {
      enabled: true,
      name: 'ИМЯ ФАМИЛИЯ',
      dates: '19XX — 20XX',
      epitaph: '',
    },
    flowerBed: { enabled: true, styleId: 'open-granite' },
    plinth: { enabled: true, materialId: 'gabbro' },
    paving: { enabled: true, styleId: 'stone-grey' },
    border: { enabled: false, styleId: 'granite-dark' },
    fence: { enabled: false, styleId: 'classic-black', gateSide: 'front' },
    bench: { enabled: false, styleId: 'wood-classic', side: 'right' },
    table: { enabled: false, styleId: 'round-granite', side: 'left' },
    vase: { enabled: true, styleId: 'classic-vase', placement: 'right' },
  }
}

export function normalizeProject(input: MemorialProject): MemorialProject {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))

  const stoneSurface = input.monument.surfaceId.startsWith('gabbro-') || input.monument.surfaceId.startsWith('granite-')
  const surfaceId = input.monument.material === 'glass'
    ? (input.monument.surfaceId.startsWith('glass-') ? input.monument.surfaceId : 'glass-clear')
    : (stoneSurface ? input.monument.surfaceId : 'gabbro-polished')

  return {
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    plot: {
      widthM: clamp(input.plot.widthM, 1.2, 6),
      depthM: clamp(input.plot.depthM, 1.2, 8),
    },
    monument: {
      ...input.monument,
      surfaceId,
      widthM: clamp(input.monument.widthM, 0.3, 2.5),
      heightM: clamp(input.monument.heightM, 0.5, 3),
      depthM: clamp(input.monument.depthM, 0.04, 0.4),
    },
    portrait: {
      ...input.portrait,
      offsetX: clamp(input.portrait.offsetX, -1, 1),
      offsetY: clamp(input.portrait.offsetY, -1, 1),
      zoom: clamp(input.portrait.zoom, 1, 3),
    },
  }
}

export function migrateProjectV2(input: LegacyProjectV2): MemorialProject {
  return normalizeProject({
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    ...defaultManagedComponents(input),
  })
}

export function migrateProjectV1(input: LegacyProjectV1): MemorialProject {
  return normalizeProject({
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    monument: {
      ...input.monument,
      surfaceId: defaultSurfaceFor(input.monument.material),
    },
    portrait: {
      ...input.portrait,
      offsetX: 0,
      offsetY: 0,
      zoom: 1,
    },
    inscription: {
      enabled: true,
      name: 'ИМЯ ФАМИЛИЯ',
      dates: '19XX — 20XX',
      epitaph: '',
    },
    ...defaultManagedComponents(input),
  })
}

export function serializeProject(project: MemorialProject): string {
  return JSON.stringify(normalizeProject(project), null, 2)
}

export function parseProject(raw: string): MemorialProject {
  const parsed = JSON.parse(raw) as { schemaVersion?: unknown }
  if (parsed.schemaVersion === 1) return migrateProjectV1(parsed as LegacyProjectV1)
  if (parsed.schemaVersion === 2) return migrateProjectV2(parsed as LegacyProjectV2)
  if (parsed.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(`Unsupported project schema: ${String(parsed.schemaVersion)}`)
  }

  const current = parsed as unknown as Partial<MemorialProject>
  if (!current.plot || !current.monument || !current.portrait || !current.inscription || !current.border) {
    throw new Error('Project is missing required sections')
  }
  return normalizeProject(current as MemorialProject)
}
