import {
  createDefaultGlassSteleConfig,
  glassThicknessMeters,
  normalizeGlassSteleConfig,
  type GlassSteleConfig,
} from './glassMemorial.ts'
import type { SourceCatalogProfileId } from './sourceCatalogProfileTypes.ts'
import type {
  BenchStyleId,
  BorderStyleId,
  FenceStyleId,
  FlowerBedStyleId,
  FurnitureSide,
  GateSide,
  PavingStyleId,
  TableStyleId,
  VasePlacement,
  VaseStyleId,
} from './componentCatalog.ts'

export type StandardMonumentShape =
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

export type MonumentShape = StandardMonumentShape | SourceCatalogProfileId

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
export type PortraitFrame = 'oval' | 'rectangle' | 'full'
export type LayoutType = 'single' | 'paired' | 'family'

export interface MonumentConfig {
  shape: MonumentShape
  material: MonumentMaterial
  surfaceId: SurfaceMaterialId
  widthM: number
  heightM: number
  depthM: number
}

export interface PortraitConfig {
  mode: PortraitMode
  frame: PortraitFrame
  size: number
  enabled: boolean
  offsetX: number
  offsetY: number
  zoom: number
}

export interface InscriptionConfig {
  enabled: boolean
  name: string
  dates: string
  epitaph: string
}

export interface MemorialStele {
  id: string
  monument: MonumentConfig
  portrait: PortraitConfig
  glass: GlassSteleConfig
  inscription: InscriptionConfig
}

export interface MemorialProject {
  schemaVersion: 6
  projectId: string
  layout: {
    type: LayoutType
    gapM: number
  }
  steles: MemorialStele[]
  plot: {
    widthM: number
    depthM: number
  }
  flowerBed: { enabled: boolean; styleId: FlowerBedStyleId }
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
  monument: Omit<MonumentConfig, 'surfaceId'>
  portrait: Pick<PortraitConfig, 'mode' | 'enabled'>
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}

type LegacyPortraitConfigV4 = Omit<PortraitConfig, 'frame' | 'size'>

interface LegacyProjectV2 {
  schemaVersion: 2
  projectId: string
  plot: MemorialProject['plot']
  monument: MonumentConfig
  portrait: LegacyPortraitConfigV4
  inscription: InscriptionConfig
  flowerBed: { enabled: boolean }
  plinth: { enabled: boolean }
  paving: { enabled: boolean }
  fence: { enabled: boolean }
  bench: { enabled: boolean }
  table: { enabled: boolean }
  vase: { enabled: boolean }
}

interface LegacyProjectV3 {
  schemaVersion: 3
  projectId: string
  plot: MemorialProject['plot']
  monument: MonumentConfig
  portrait: LegacyPortraitConfigV4
  inscription: InscriptionConfig
  flowerBed: MemorialProject['flowerBed']
  plinth: MemorialProject['plinth']
  paving: MemorialProject['paving']
  border: MemorialProject['border']
  fence: MemorialProject['fence']
  bench: MemorialProject['bench']
  table: MemorialProject['table']
  vase: MemorialProject['vase']
}

interface LegacyMemorialSteleV4 {
  id: string
  monument: MonumentConfig
  portrait: LegacyPortraitConfigV4
  inscription: InscriptionConfig
}

interface LegacyProjectV4 {
  schemaVersion: 4
  projectId: string
  layout: MemorialProject['layout']
  steles: LegacyMemorialSteleV4[]
  plot: MemorialProject['plot']
  flowerBed: MemorialProject['flowerBed']
  plinth: MemorialProject['plinth']
  paving: MemorialProject['paving']
  border: MemorialProject['border']
  fence: MemorialProject['fence']
  bench: MemorialProject['bench']
  table: MemorialProject['table']
  vase: MemorialProject['vase']
}

interface LegacyMemorialSteleV5 {
  id: string
  monument: MonumentConfig
  portrait: PortraitConfig
  inscription: InscriptionConfig
}

interface LegacyProjectV5 {
  schemaVersion: 5
  projectId: string
  layout: MemorialProject['layout']
  steles: LegacyMemorialSteleV5[]
  plot: MemorialProject['plot']
  flowerBed: MemorialProject['flowerBed']
  plinth: MemorialProject['plinth']
  paving: MemorialProject['paving']
  border: MemorialProject['border']
  fence: MemorialProject['fence']
  bench: MemorialProject['bench']
  table: MemorialProject['table']
  vase: MemorialProject['vase']
}

export const PROJECT_SCHEMA_VERSION = 6 as const
export const MAX_SUPPORTED_STELES = 6
export const FAMILY_UI_MAX_STELES = 4

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min))
}

function defaultSurfaceFor(material: MonumentMaterial): SurfaceMaterialId {
  return material === 'glass' ? 'glass-clear' : 'gabbro-polished'
}

function normalizeSurface(material: MonumentMaterial, surfaceId: SurfaceMaterialId): SurfaceMaterialId {
  const stoneSurface = surfaceId.startsWith('gabbro-') || surfaceId.startsWith('granite-')
  return material === 'glass'
    ? (surfaceId.startsWith('glass-') ? surfaceId : 'glass-clear')
    : (stoneSurface ? surfaceId : 'gabbro-polished')
}

export function createDefaultStele(id = 'primary'): MemorialStele {
  return {
    id,
    monument: {
      shape: 'arch',
      material: 'gabbro',
      surfaceId: 'gabbro-polished',
      widthM: 0.65,
      heightM: 1.25,
      depthM: 0.09,
    },
    portrait: { mode: 'color', frame: 'oval', size: 1, enabled: true, offsetX: 0, offsetY: 0, zoom: 1 },
    glass: createDefaultGlassSteleConfig(),
    inscription: {
      enabled: true,
      name: 'ИМЯ ФАМИЛИЯ',
      dates: '19XX — 20XX',
      epitaph: '',
    },
  }
}

function createFamilyCompanionStele(id: string, index: number): MemorialStele {
  const stele = createDefaultStele(id)
  stele.monument.widthM = index % 2 === 0 ? 0.52 : 0.56
  stele.monument.heightM = index % 2 === 0 ? 1.12 : 1.18
  return stele
}

function normalizeStele(input: MemorialStele, fallbackId: string): MemorialStele {
  const id = typeof input.id === 'string' && input.id.trim() ? input.id.trim() : fallbackId
  const glass = normalizeGlassSteleConfig(input.glass)
  const normalizedDepth = input.monument.material === 'glass'
    ? glassThicknessMeters(glass)
    : clamp(input.monument.depthM, 0.04, 0.4)

  return {
    ...input,
    id,
    monument: {
      ...input.monument,
      surfaceId: normalizeSurface(input.monument.material, input.monument.surfaceId),
      widthM: clamp(input.monument.widthM, 0.3, 2.5),
      heightM: clamp(input.monument.heightM, 0.5, 3),
      depthM: normalizedDepth,
    },
    portrait: {
      ...input.portrait,
      frame: ['oval', 'rectangle', 'full'].includes(input.portrait.frame) ? input.portrait.frame : 'oval',
      size: clamp(Number.isFinite(input.portrait.size) ? input.portrait.size : 1, 0.6, 1.35),
      offsetX: clamp(input.portrait.offsetX, -1, 1),
      offsetY: clamp(input.portrait.offsetY, -1, 1),
      zoom: clamp(input.portrait.zoom, 1, 3),
    },
    glass,
  }
}

function uniqueSteleIds(steles: MemorialStele[]): MemorialStele[] {
  const used = new Set<string>()
  return steles.map((stele, index) => {
    let id = stele.id
    if (!id || used.has(id)) id = `stele-${index + 1}`
    while (used.has(id)) id = `${id}-copy`
    used.add(id)
    return { ...stele, id }
  })
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
    layout: { type: 'single', gapM: 0.16 },
    steles: [createDefaultStele('primary')],
    plot: { widthM: 2, depthM: 2.4 },
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
  let steles = (Array.isArray(input.steles) ? input.steles : [])
    .slice(0, MAX_SUPPORTED_STELES)
    .map((stele, index) => normalizeStele(stele, `stele-${index + 1}`))

  if (steles.length === 0) steles = [createDefaultStele('primary')]
  if (input.layout.type === 'paired' && steles.length < 2) {
    steles.push(createDefaultStele('secondary'))
  }
  if (input.layout.type === 'family' && steles.length < 3) {
    while (steles.length < 3) {
      steles.push(createFamilyCompanionStele(`family-${steles.length + 1}`, steles.length))
    }
  }

  steles = uniqueSteleIds(steles)

  return {
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    layout: {
      type: input.layout.type,
      gapM: clamp(input.layout.gapM, 0.04, 0.8),
    },
    steles,
    plot: {
      widthM: clamp(input.plot.widthM, 1.2, 6),
      depthM: clamp(input.plot.depthM, 1.2, 8),
    },
  }
}

export function getVisibleSteles(project: MemorialProject): MemorialStele[] {
  if (project.layout.type === 'single') return project.steles.slice(0, 1)
  if (project.layout.type === 'paired') return project.steles.slice(0, 2)
  return project.steles
}

export function getCompositionWidth(project: MemorialProject): number {
  const steles = getVisibleSteles(project)
  if (steles.length === 0) return 0
  return steles.reduce((sum, stele) => sum + stele.monument.widthM, 0)
    + project.layout.gapM * Math.max(0, steles.length - 1)
}

export function getSteleLayoutPositions(project: MemorialProject): Array<{ stele: MemorialStele; x: number }> {
  const steles = getVisibleSteles(project)
  const total = getCompositionWidth(project)
  let cursor = -total / 2

  return steles.map((stele) => {
    const x = cursor + stele.monument.widthM / 2
    cursor += stele.monument.widthM + project.layout.gapM
    return { stele, x }
  })
}

export function withLayout(project: MemorialProject, type: LayoutType): MemorialProject {
  const next = {
    ...project,
    layout: { ...project.layout, type },
    steles: [...project.steles],
  }
  if (type === 'paired' && next.steles.length < 2) {
    const secondary = createDefaultStele('secondary')
    secondary.monument.heightM = 1.18
    next.steles.push(secondary)
  }
  if (type === 'family' && next.steles.length < 3) {
    while (next.steles.length < 3) {
      next.steles.push(createFamilyCompanionStele(`family-${next.steles.length + 1}`, next.steles.length))
    }
  }
  return normalizeProject(next)
}

export function addFamilyStele(project: MemorialProject): MemorialProject {
  if (project.steles.length >= FAMILY_UI_MAX_STELES) return normalizeProject({ ...project, layout: { ...project.layout, type: 'family' } })

  const nextIndex = project.steles.length
  const stele = createFamilyCompanionStele(`family-${nextIndex + 1}`, nextIndex)
  return normalizeProject({
    ...project,
    layout: { ...project.layout, type: 'family' },
    steles: [...project.steles, stele],
  })
}

export function removeFamilyStele(project: MemorialProject, steleId: string): MemorialProject {
  if (project.layout.type !== 'family' || project.steles.length <= 3) return project

  const steles = project.steles.filter((stele) => stele.id !== steleId)
  if (steles.length === project.steles.length) return project

  return normalizeProject({
    ...project,
    steles,
  })
}

export function migrateProjectV5(input: LegacyProjectV5): MemorialProject {
  return normalizeProject({
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    steles: input.steles.map((stele) => ({
      ...stele,
      glass: createDefaultGlassSteleConfig(),
    })),
  })
}

export function migrateProjectV4(input: LegacyProjectV4): MemorialProject {
  return normalizeProject({
    ...input,
    schemaVersion: PROJECT_SCHEMA_VERSION,
    steles: input.steles.map((stele) => ({
      ...stele,
      portrait: {
        ...stele.portrait,
        frame: 'rectangle',
        size: 1,
      },
      glass: createDefaultGlassSteleConfig(),
    })),
  })
}

export function migrateProjectV3(input: LegacyProjectV3): MemorialProject {
  return normalizeProject({
    schemaVersion: PROJECT_SCHEMA_VERSION,
    projectId: input.projectId,
    layout: { type: 'single', gapM: 0.16 },
    steles: [{
      id: 'primary',
      monument: input.monument,
      portrait: { ...input.portrait, frame: 'rectangle', size: 1 },
      glass: createDefaultGlassSteleConfig(),
      inscription: input.inscription,
    }],
    plot: input.plot,
    flowerBed: input.flowerBed,
    plinth: input.plinth,
    paving: input.paving,
    border: input.border,
    fence: input.fence,
    bench: input.bench,
    table: input.table,
    vase: input.vase,
  })
}

export function migrateProjectV2(input: LegacyProjectV2): MemorialProject {
  const managed = defaultManagedComponents(input)
  return migrateProjectV3({
    schemaVersion: 3,
    projectId: input.projectId,
    plot: input.plot,
    monument: input.monument,
    portrait: input.portrait,
    inscription: input.inscription,
    ...managed,
  })
}

export function migrateProjectV1(input: LegacyProjectV1): MemorialProject {
  const managed = defaultManagedComponents(input)
  return migrateProjectV3({
    schemaVersion: 3,
    projectId: input.projectId,
    plot: input.plot,
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
    ...managed,
  })
}

export function serializeProject(project: MemorialProject): string {
  return JSON.stringify(normalizeProject(project), null, 2)
}

export function parseProject(raw: string): MemorialProject {
  const parsed = JSON.parse(raw) as { schemaVersion?: unknown }
  if (parsed.schemaVersion === 1) return migrateProjectV1(parsed as LegacyProjectV1)
  if (parsed.schemaVersion === 2) return migrateProjectV2(parsed as LegacyProjectV2)
  if (parsed.schemaVersion === 3) return migrateProjectV3(parsed as LegacyProjectV3)
  if (parsed.schemaVersion === 4) return migrateProjectV4(parsed as LegacyProjectV4)
  if (parsed.schemaVersion === 5) return migrateProjectV5(parsed as LegacyProjectV5)
  if (parsed.schemaVersion !== PROJECT_SCHEMA_VERSION) {
    throw new Error(`Unsupported project schema: ${String(parsed.schemaVersion)}`)
  }

  const current = parsed as unknown as Partial<MemorialProject>
  if (!current.layout || !Array.isArray(current.steles) || !current.plot || !current.border) {
    throw new Error('Project is missing required sections')
  }
  if (!['single', 'paired', 'family'].includes(current.layout.type ?? '')) {
    throw new Error('Project layout type is invalid')
  }
  if (current.steles.length === 0 || current.steles.length > MAX_SUPPORTED_STELES) {
    throw new Error('Project stele count is unsupported')
  }
  return normalizeProject(current as MemorialProject)
}
