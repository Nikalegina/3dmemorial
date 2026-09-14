import type { MaterialDefinition } from './catalog.ts'
import {
  createDefaultProject,
  normalizeProject,
  type MemorialProject,
  type MonumentShape,
  type SurfaceMaterialId,
} from './memorialProject.ts'
import { SOURCE_CATALOG_DATA } from './sourceCatalogData.ts'
import { hasSourceCatalogProfile } from './sourceCatalogProfiles.ts'

export type SourceCatalogCategory = 'combined' | 'single' | 'family' | 'elite'
export type SourceCatalogGeometryMode = 'catalog-profile' | 'procedural' | 'mesh-required'

export interface SourceCatalogVariant {
  heightMm: number
  widthMm: number
  depthMm: number
  stoneCodes: readonly string[]
}

export interface SourceCatalogModel {
  id: string
  code: string
  category: SourceCatalogCategory
  categoryLabel: string
  sourcePage: number
  geometryMode: SourceCatalogGeometryMode
  profileId: string | null
  variants: readonly SourceCatalogVariant[]
  sourceNote: string | null
}

export interface SourceStoneDefinition {
  code: string
  name: string
  family: string
  densityGcm3: string | null
  compression: string | null
  porosity: string | null
  waterAbsorption: string | null
  frostResistance: string | null
  durability: string | null
  sourceStatus: 'documented' | 'unresolved'
  renderSurfaceId: SurfaceMaterialId
  renderColor: string
}

export const SOURCE_STONES: readonly SourceStoneDefinition[] = [
  { code: 'К02', name: 'ROYAL GREEN', family: 'зелёный габбро', densityGcm3: '2.75', compression: '1700 кг/см²', porosity: '≤2%', waterAbsorption: '≤0.1%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-green', renderColor: '#30483d' },
  { code: 'К03', name: 'BELLA WHITE', family: 'светло-серый гранит', densityGcm3: '2.67', compression: '1500 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1–0.2%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-grey', renderColor: '#858682' },
  { code: 'К04', name: 'MUD GREY', family: 'тёмно-серый габбро', densityGcm3: '2.80', compression: '1600 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-grey', renderColor: '#4c5051' },
  { code: 'К05', name: 'IMPERIAL RED', family: 'красный гранит', densityGcm3: '2.67', compression: '1500 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1–0.2%', frostResistance: '>50 циклов', durability: '250–500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-red', renderColor: '#723735' },
  { code: 'К06', name: 'BLACK GABBRO', family: 'чёрный габбро', densityGcm3: '2.80', compression: '1600 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'gabbro-polished', renderColor: '#111315' },
  { code: 'К08', name: 'К08', family: 'камень из source catalog', densityGcm3: null, compression: null, porosity: null, waterAbsorption: null, frostResistance: null, durability: null, sourceStatus: 'unresolved', renderSurfaceId: 'granite-grey', renderColor: '#626463' },
  { code: 'К10', name: 'VISAGE BLUE', family: 'серо-синий гранит', densityGcm3: '2.70', compression: '1450 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1–0.15%', frostResistance: '>50 циклов', durability: '250–500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-grey', renderColor: '#59646b' },
  { code: 'К11', name: 'INDIAN AURORA', family: 'коричнево-красный гранит', densityGcm3: '2.67', compression: '1500 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1–0.2%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-brown', renderColor: '#684941' },
  { code: 'К12', name: 'TAN BRAWN', family: 'коричневый гранит', densityGcm3: '2.75', compression: '200 МПа', porosity: '≤1.4%', waterAbsorption: '≤0.1%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-brown', renderColor: '#665047' },
  { code: 'К13', name: 'GABBRO-DIABASE', family: 'габбро-диабаз', densityGcm3: '3.07', compression: '1400 кг/см²', porosity: '≤1%', waterAbsorption: '≤0.1%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'gabbro-polished', renderColor: '#151719' },
  { code: 'К14', name: 'DYMOVSKY GRANITE', family: 'дымoвский гранит', densityGcm3: '2.70', compression: '175 МПа', porosity: '≤1.7%', waterAbsorption: '≤0.14%', frostResistance: '>50 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'granite-brown', renderColor: '#75564b' },
  { code: 'К15', name: 'GARNET AMPHIBOLITE', family: 'гранатовый амфиболит', densityGcm3: '2.8', compression: '302 МПа', porosity: '1%', waterAbsorption: '0.12%', frostResistance: '100 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'gabbro-polished', renderColor: '#292227' },
  { code: 'К16', name: 'KUPETSKY GABBRO-NORITE', family: 'габбро-норит', densityGcm3: '3.0', compression: '232 МПа', porosity: '≤0.44%', waterAbsorption: '0.09%', frostResistance: '100 циклов', durability: '≥500 лет', sourceStatus: 'documented', renderSurfaceId: 'gabbro-polished', renderColor: '#202326' },
  { code: 'G654', name: 'G654', family: 'камень из source catalog', densityGcm3: null, compression: null, porosity: null, waterAbsorption: null, frostResistance: null, durability: null, sourceStatus: 'unresolved', renderSurfaceId: 'granite-grey', renderColor: '#55595a' },
] as const

const CATEGORY_LABELS: Record<SourceCatalogCategory, string> = {
  combined: 'Комбинированные памятники',
  single: 'Одиночные и фигурные памятники',
  family: 'Семейные памятники',
  elite: 'Элитные памятники',
}

const GEOMETRY_MODES: Record<string, SourceCatalogGeometryMode> = {
  p: 'catalog-profile',
  r: 'procedural',
  m: 'mesh-required',
}

const ELITE_PROXY_SHAPES: Record<string, MonumentShape> = {
  '1': 'heart',
  '2': 'wave',
  '3': 'arch',
  '4': 'arch',
  '5': 'heart',
  '6': 'dome',
  '7': 'wave',
  '9': 'arch',
  '10': 'ogee',
  '11': 'teardrop',
  '12': 'rounded-rectangle',
  '13': 'heart',
  '14': 'dome',
  '16': 'dome',
  '17': 'heart',
  '18': 'teardrop',
  '19': 'shield',
  '21': 'rectangle',
  '22': 'arch',
  '24': 'arch',
  '25': 'arch',
}

function canonicalCode(raw: string): string {
  return raw.trim().toUpperCase().replaceAll('Е', 'E')
}

function profileSlug(raw: string): string {
  return canonicalCode(raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function parseVariant(raw: string): SourceCatalogVariant {
  const [height, width, depth, stones = ''] = raw.split(',')
  const heightMm = Number(height)
  const widthMm = Number(width)
  const depthMm = Number(depth)
  if (![heightMm, widthMm, depthMm].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error(`Invalid source catalog dimensions: ${raw}`)
  }
  const stoneCodes = stones.split('.').map((value) => value.trim()).filter(Boolean)
  return { heightMm, widthMm, depthMm, stoneCodes }
}

function parseModel(line: string): SourceCatalogModel {
  const [categoryRaw, codeRaw, pageRaw, geometryRaw, variantsRaw = '', noteRaw = ''] = line.split('|')
  const category = categoryRaw as SourceCatalogCategory
  if (!(category in CATEGORY_LABELS)) throw new Error(`Unknown source catalog category: ${categoryRaw}`)
  const sourcePage = Number(pageRaw)
  const geometryMode = GEOMETRY_MODES[geometryRaw]
  if (!Number.isInteger(sourcePage) || !geometryMode) throw new Error(`Invalid source catalog row: ${line}`)
  const code = canonicalCode(codeRaw)
  const variants = variantsRaw ? variantsRaw.split('/').filter(Boolean).map(parseVariant) : []
  const profileId = geometryMode === 'catalog-profile'
    ? `ermis-${category}-${profileSlug(code)}`
    : null
  if (profileId && !hasSourceCatalogProfile(profileId)) {
    throw new Error(`Missing catalog profile: ${profileId}`)
  }
  return {
    id: `ERMIS-${category.toUpperCase()}-${code}`,
    code,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    sourcePage,
    geometryMode,
    profileId,
    variants,
    sourceNote: noteRaw.trim() || null,
  }
}

export const SOURCE_CATALOG_MODELS: readonly SourceCatalogModel[] = SOURCE_CATALOG_DATA
  .trim()
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map(parseModel)

const SOURCE_CATALOG_BY_ID = new Map(SOURCE_CATALOG_MODELS.map((model) => [model.id, model]))
const SOURCE_STONE_BY_CODE = new Map(SOURCE_STONES.map((stone) => [stone.code, stone]))

export function getSourceCatalogModel(modelId: string): SourceCatalogModel {
  const normalized = modelId.trim().toUpperCase().replaceAll('Е', 'E')
  const model = SOURCE_CATALOG_BY_ID.get(normalized)
  if (!model) throw new Error(`Unknown source catalog model: ${modelId}`)
  return model
}

export function findSourceCatalogModelBySku(sourceSku: string | null | undefined): SourceCatalogModel | null {
  if (!sourceSku) return null
  const normalized = sourceSku.trim().toUpperCase().replaceAll('Е', 'E')
  return SOURCE_CATALOG_BY_ID.get(normalized) ?? null
}

export function getSourceStone(code: string | null | undefined): SourceStoneDefinition | null {
  if (!code) return null
  return SOURCE_STONE_BY_CODE.get(code.trim().toUpperCase()) ?? null
}

export function getSourceStoneRenderDefinition(code: string): MaterialDefinition | null {
  const stone = getSourceStone(code)
  if (!stone) return null
  return {
    id: stone.renderSurfaceId,
    name: `${stone.code} — ${stone.name}`,
    kind: 'stone',
    color: stone.renderColor,
    roughness: stone.renderSurfaceId === 'gabbro-polished' ? 0.16 : 0.3,
    metalness: 0.01,
    clearcoat: 0.44,
    clearcoatRoughness: 0.13,
  }
}

function applyStone(project: MemorialProject, stoneCode: string | null): void {
  const stele = project.steles[0]
  const stone = getSourceStone(stoneCode)
  stele.monument.material = 'gabbro'
  stele.monument.stoneCode = stoneCode
  stele.monument.surfaceId = stone?.renderSurfaceId ?? 'gabbro-polished'
}

export function createProjectFromSourceCatalogModel(
  modelId: string,
  variantIndex = 0,
  requestedStoneCode?: string | null,
): MemorialProject {
  const model = getSourceCatalogModel(modelId)
  const project = createDefaultProject()
  const stele = project.steles[0]
  const variant = model.variants[variantIndex] ?? model.variants[0] ?? null

  project.projectId = model.id
  project.catalogSource = {
    modelId: model.id,
    modelCode: model.code,
    sourcePage: model.sourcePage,
    geometryMode: model.geometryMode,
    variantIndex: variant ? Math.max(0, model.variants.indexOf(variant)) : null,
  }
  project.layout.type = 'single'
  project.flowerBed.enabled = false
  project.vase.enabled = false

  stele.monument.profileId = model.profileId
  stele.monument.shape = model.geometryMode === 'mesh-required'
    ? (ELITE_PROXY_SHAPES[model.code] ?? 'arch')
    : 'rectangle'

  if (variant) {
    // The source catalog dimensions are HEIGHT × WIDTH × DEPTH.
    stele.monument.heightM = variant.heightMm / 1000
    stele.monument.widthM = variant.widthMm / 1000
    stele.monument.depthM = variant.depthMm / 1000

    const candidate = requestedStoneCode?.trim().toUpperCase()
    const stoneCode = candidate && variant.stoneCodes.includes(candidate)
      ? candidate
      : (variant.stoneCodes[0] ?? null)
    applyStone(project, stoneCode)
  } else {
    applyStone(project, null)
  }

  stele.portrait.mode = 'bw'
  stele.portrait.frame = model.category === 'family' ? 'rectangle' : 'oval'
  stele.inscription.name = 'ИМЯ ФАМИЛИЯ'

  return normalizeProject(project)
}

export function updateSourceCatalogVariant(
  project: MemorialProject,
  variantIndex: number,
  requestedStoneCode?: string | null,
): MemorialProject {
  const modelId = project.catalogSource?.modelId
  if (!modelId) return project
  return createProjectFromSourceCatalogModel(modelId, variantIndex, requestedStoneCode)
}

export const SOURCE_CATALOG_COUNTS = {
  total: SOURCE_CATALOG_MODELS.length,
  combined: SOURCE_CATALOG_MODELS.filter((model) => model.category === 'combined').length,
  single: SOURCE_CATALOG_MODELS.filter((model) => model.category === 'single').length,
  family: SOURCE_CATALOG_MODELS.filter((model) => model.category === 'family').length,
  elite: SOURCE_CATALOG_MODELS.filter((model) => model.category === 'elite').length,
  catalogProfiles: SOURCE_CATALOG_MODELS.filter((model) => model.geometryMode === 'catalog-profile').length,
} as const
