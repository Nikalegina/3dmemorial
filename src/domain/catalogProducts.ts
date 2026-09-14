import {
  createDefaultProject,
  normalizeProject,
  withLayout,
  type MemorialProject,
  type MemorialStele,
  type MonumentShape,
} from './memorialProject.ts'

export type CatalogProductFamilyId =
  | 'catalog-glass-complete'
  | 'catalog-glass-paired'
  | 'catalog-glass-muslim'
  | 'catalog-granite-glass'
  | 'catalog-glass-family'

export type CatalogGeometryAuthority =
  | 'source-drawing'
  | 'catalog-visual-reference'

export interface CatalogReferenceAsset {
  assetName: string
  role: 'technical-drawing' | 'catalog-visual'
}

export interface CatalogProductFamily {
  id: CatalogProductFamilyId
  name: string
  description: string
  category:
    | 'glass'
    | 'paired'
    | 'muslim'
    | 'combined'
    | 'family'
  geometryAuthority: CatalogGeometryAuthority
  referenceAssets: readonly CatalogReferenceAsset[]
  create: () => MemorialProject
}

function configureGlassStele(
  stele: MemorialStele,
  shape: MonumentShape = 'rectangle',
): MemorialStele {
  stele.monument.shape = shape
  stele.monument.material = 'glass'
  stele.monument.surfaceId = 'glass-clear'
  stele.monument.widthM = 0.5
  stele.monument.heightM = 1
  stele.monument.depthM = 0.012
  stele.glass.clarity = 'clear-m1'
  stele.glass.thicknessMm = 12
  stele.glass.mountType = 'groove'
  stele.glass.uvPrintSides = 1
  stele.glass.printEdgeMarginMm = 10
  stele.portrait.enabled = true
  stele.portrait.mode = 'color'
  stele.portrait.frame = 'full'
  stele.portrait.size = 1.12
  stele.portrait.zoom = 1
  stele.portrait.offsetX = 0
  stele.portrait.offsetY = 0
  return stele
}

function configureGlassPanelComplex(project: MemorialProject): MemorialProject {
  project.plot.widthM = Math.max(project.plot.widthM, 1.8)
  project.plot.depthM = Math.max(project.plot.depthM, 2.4)
  project.flowerBed.enabled = true
  project.flowerBed.styleId = 'glass-panel-granite-frame'
  project.plinth.enabled = false
  project.paving.enabled = false
  project.border.enabled = false
  project.fence.enabled = false
  project.bench.enabled = false
  project.table.enabled = false
  project.vase.enabled = false
  return project
}

function withCatalogProjectId(
  project: MemorialProject,
  familyId: CatalogProductFamilyId,
): MemorialProject {
  return normalizeProject({
    ...project,
    projectId: `CATALOG-${familyId.toUpperCase()}`,
  })
}

function createGlassComplete(): MemorialProject {
  const project = configureGlassPanelComplex(createDefaultProject())
  configureGlassStele(project.steles[0], 'rectangle')
  return withCatalogProjectId(project, 'catalog-glass-complete')
}

function createGlassPaired(): MemorialProject {
  const project = configureGlassPanelComplex(withLayout(createDefaultProject(), 'paired'))
  project.plot.widthM = 2.4
  project.layout.gapM = 0.12
  configureGlassStele(project.steles[0], 'rounded-rectangle')
  configureGlassStele(project.steles[1], 'rounded-rectangle')
  return withCatalogProjectId(project, 'catalog-glass-paired')
}

function createGlassMuslim(): MemorialProject {
  const project = configureGlassPanelComplex(createDefaultProject())
  configureGlassStele(project.steles[0], 'muslim-arch')
  project.steles[0].inscription.epitaph = ''
  return withCatalogProjectId(project, 'catalog-glass-muslim')
}

function createGraniteGlassCombined(): MemorialProject {
  const project = configureGlassPanelComplex(withLayout(createDefaultProject(), 'paired'))
  project.plot.widthM = 2.35
  project.layout.gapM = 0.08

  const stone = project.steles[0]
  stone.monument.shape = 'ogee'
  stone.monument.material = 'gabbro'
  stone.monument.surfaceId = 'gabbro-polished'
  stone.monument.widthM = 0.58
  stone.monument.heightM = 1.18
  stone.monument.depthM = 0.09
  stone.portrait.mode = 'bw'
  stone.portrait.frame = 'oval'
  stone.portrait.size = 0.92

  configureGlassStele(project.steles[1], 'rectangle')
  project.steles[1].monument.widthM = 0.52
  project.steles[1].monument.heightM = 1.12

  return withCatalogProjectId(project, 'catalog-granite-glass')
}

function createGlassFamily(): MemorialProject {
  const project = configureGlassPanelComplex(withLayout(createDefaultProject(), 'family'))
  project.plot.widthM = 3.1
  project.layout.gapM = 0.1
  for (const [index, stele] of project.steles.slice(0, 3).entries()) {
    configureGlassStele(stele, index === 1 ? 'rounded-rectangle' : 'rectangle')
    stele.monument.widthM = index === 1 ? 0.55 : 0.48
    stele.monument.heightM = index === 1 ? 1.12 : 1
  }
  return withCatalogProjectId(project, 'catalog-glass-family')
}

export const CATALOG_PRODUCT_FAMILIES: readonly CatalogProductFamily[] = [
  {
    id: 'catalog-glass-complete',
    name: 'Стеклянная стела + панель цветника',
    description: 'Стела в пазу гранитной тумбы и стеклянная панель цветника в гранитной рамке.',
    category: 'glass',
    geometryAuthority: 'source-drawing',
    referenceAssets: [
      { assetName: 'e_01.jpg … e_10.jpg', role: 'technical-drawing' },
      { assetName: 'Каталог стеклянных памятников с фотопечатью.png', role: 'catalog-visual' },
    ],
    create: createGlassComplete,
  },
  {
    id: 'catalog-glass-paired',
    name: 'Парный стеклянный',
    description: 'Две редактируемые стеклянные стелы на общей композиции.',
    category: 'paired',
    geometryAuthority: 'catalog-visual-reference',
    referenceAssets: [
      { assetName: 'Двойной стеклянный памятник на закате.png', role: 'catalog-visual' },
    ],
    create: createGlassPaired,
  },
  {
    id: 'catalog-glass-muslim',
    name: 'Мусульманский стеклянный',
    description: 'Стеклянная стела со стрельчатым профилем без религиозного декора по умолчанию.',
    category: 'muslim',
    geometryAuthority: 'catalog-visual-reference',
    referenceAssets: [
      { assetName: 'Стеклянные мемориалы в исламском саду.png', role: 'catalog-visual' },
    ],
    create: createGlassMuslim,
  },
  {
    id: 'catalog-granite-glass',
    name: 'Гранит + стекло',
    description: 'Комбинированная композиция из гранитной и стеклянной стел.',
    category: 'combined',
    geometryAuthority: 'catalog-visual-reference',
    referenceAssets: [
      { assetName: 'Парный памятник из стекла и гранита', role: 'catalog-visual' },
    ],
    create: createGraniteGlassCombined,
  },
  {
    id: 'catalog-glass-family',
    name: 'Семейная стеклянная композиция',
    description: 'Три независимо редактируемые стеклянные стелы на общем участке.',
    category: 'family',
    geometryAuthority: 'catalog-visual-reference',
    referenceAssets: [
      { assetName: 'Семейный мемориал из стекла.png', role: 'catalog-visual' },
    ],
    create: createGlassFamily,
  },
] as const

const CATALOG_PRODUCT_IDS = new Set(CATALOG_PRODUCT_FAMILIES.map((item) => item.id))

export function isCatalogProductFamilyId(value: string): value is CatalogProductFamilyId {
  return CATALOG_PRODUCT_IDS.has(value as CatalogProductFamilyId)
}

export function getCatalogProductFamily(id: CatalogProductFamilyId): CatalogProductFamily {
  const item = CATALOG_PRODUCT_FAMILIES.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Unknown catalog product family: ${id}`)
  return item
}
