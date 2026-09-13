export type MonumentShape = 'rectangle' | 'arch' | 'slant' | 'wave' | 'heart' | 'muslim-arch'
export type MonumentMaterial = 'gabbro' | 'glass' | 'hybrid'
export type PortraitMode = 'color' | 'bw' | 'engraving'

export interface MemorialProject {
  schemaVersion: 1
  projectId: string
  plot: {
    widthM: number
    depthM: number
  }
  monument: {
    shape: MonumentShape
    material: MonumentMaterial
    widthM: number
    heightM: number
    depthM: number
  }
  portrait: {
    mode: PortraitMode
    enabled: boolean
  }
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}

export const PROJECT_SCHEMA_VERSION = 1 as const

export function createDefaultProject(): MemorialProject {
  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: 'LOCAL-DRAFT',
    plot: { widthM: 2, depthM: 2.4 },
    monument: {
      shape: 'arch',
      material: 'gabbro',
      widthM: 0.65,
      heightM: 1.25,
      depthM: 0.09,
    },
    portrait: { mode: 'color', enabled: true },
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

  return {
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    plot: {
      widthM: clamp(input.plot.widthM, 1.2, 6),
      depthM: clamp(input.plot.depthM, 1.2, 8),
    },
    monument: {
      ...input.monument,
      widthM: clamp(input.monument.widthM, 0.3, 2.5),
      heightM: clamp(input.monument.heightM, 0.5, 3),
      depthM: clamp(input.monument.depthM, 0.04, 0.4),
    },
  }
}

export function serializeProject(project: MemorialProject): string {
  return JSON.stringify(normalizeProject(project), null, 2)
}

export function parseProject(raw: string): MemorialProject {
  const parsed = JSON.parse(raw) as Partial<MemorialProject>
  if (parsed.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(`Unsupported project schema: ${String(parsed.schemaVersion)}`)
  }
  if (!parsed.plot || !parsed.monument || !parsed.portrait) {
    throw new Error('Project is missing required sections')
  }
  return normalizeProject(parsed as MemorialProject)
}
