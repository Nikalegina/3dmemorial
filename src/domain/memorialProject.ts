export type MonumentShape = 'rectangle' | 'arch' | 'slant' | 'wave' | 'heart' | 'muslim-arch'
export type MonumentMaterial = 'gabbro' | 'glass' | 'hybrid'
export type SurfaceMaterialId = 'gabbro-polished' | 'gabbro-matte' | 'glass-clear' | 'glass-frosted'
export type PortraitMode = 'color' | 'bw' | 'engraving'

export interface MemorialProject {
  schemaVersion: 2
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
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
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

export const PROJECT_SCHEMA_VERSION = 2 as const

function defaultSurfaceFor(material: MonumentMaterial): SurfaceMaterialId {
  return material === 'glass' ? 'glass-clear' : 'gabbro-polished'
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
    flowerBed: { enabled: true },
    plinth: { enabled: true },
    paving: { enabled: true },
    fence: { enabled: false },
    bench: { enabled: false },
    table: { enabled: false },
    vase: { enabled: true },
  }
}

export function normalizeProject(input: MemorialProject): MemorialProject {
  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))

  const surfaceId = input.monument.material === 'glass'
    ? (input.monument.surfaceId.startsWith('glass-') ? input.monument.surfaceId : 'glass-clear')
    : (input.monument.surfaceId.startsWith('gabbro-') ? input.monument.surfaceId : 'gabbro-polished')

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
  })
}

export function serializeProject(project: MemorialProject): string {
  return JSON.stringify(normalizeProject(project), null, 2)
}

export function parseProject(raw: string): MemorialProject {
  const parsed = JSON.parse(raw) as { schemaVersion?: unknown }
  if (parsed.schemaVersion === 1) return migrateProjectV1(parsed as LegacyProjectV1)
  if (parsed.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(`Unsupported project schema: ${String(parsed.schemaVersion)}`)
  }

  const current = parsed as unknown as Partial<MemorialProject>
  if (!current.plot || !current.monument || !current.portrait || !current.inscription) {
    throw new Error('Project is missing required sections')
  }
  return normalizeProject(current as MemorialProject)
}
