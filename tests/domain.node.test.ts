import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createDefaultProject,
  normalizeProject,
  parseProject,
  serializeProject,
  withLayout,
} from '../src/domain/memorialProject.ts'

test('default project has canonical schema v5 and safe inscription defaults', () => {
  const project = createDefaultProject()
  assert.equal(project.schemaVersion, 5)
  assert.equal(project.layout.type, 'single')
  assert.equal(project.steles.length, 1)
  assert.equal(project.steles[0].monument.material, 'gabbro')
  assert.equal(project.steles[0].monument.surfaceId, 'gabbro-polished')
  assert.equal(project.steles[0].inscription.typographyId, 'classic-serif')
  assert.equal(project.steles[0].inscription.symbolId, 'none')
  assert.equal(project.steles[0].inscription.align, 'center')
  assert.equal(project.border.enabled, false)
})

test('normalization clamps dimensions, portrait transforms and inscription scale', () => {
  const project = createDefaultProject()
  project.steles[0].monument.widthM = 99
  project.steles[0].monument.depthM = -10
  project.plot.depthM = Number.NaN
  project.steles[0].portrait.zoom = 99
  project.steles[0].portrait.offsetX = -99
  project.steles[0].inscription.textScale = 99
  project.layout.gapM = 99
  const normalized = normalizeProject(project)
  assert.equal(normalized.steles[0].monument.widthM, 2.5)
  assert.equal(normalized.steles[0].monument.depthM, 0.04)
  assert.equal(normalized.plot.depthM, 1.2)
  assert.equal(normalized.steles[0].portrait.zoom, 3)
  assert.equal(normalized.steles[0].portrait.offsetX, -1)
  assert.equal(normalized.steles[0].inscription.textScale, 1.35)
  assert.equal(normalized.layout.gapM, 0.8)
})

test('project serialization round-trips schema v5 paired composition and inscription design', () => {
  const source = withLayout(createDefaultProject(), 'paired')
  source.steles[0].monument.material = 'hybrid'
  source.steles[0].inscription.name = 'ПЕРВЫЙ'
  source.steles[0].inscription.typographyId = 'clean-sans'
  source.steles[0].inscription.symbolId = 'laurel'
  source.steles[1].inscription.name = 'ВТОРОЙ'
  source.steles[1].inscription.symbolId = 'crescent-star'
  source.steles[1].inscription.symbolPlacement = 'bottom'
  source.steles[1].monument.shape = 'book'
  source.fence.enabled = true
  source.fence.gateSide = 'left'
  source.border.enabled = true
  const parsed = parseProject(serializeProject(source))
  assert.deepEqual(parsed, source)
})

test('schema v4 migrates inscription design defaults without losing text', () => {
  const current = createDefaultProject()
  const legacy = {
    ...current,
    schemaVersion: 4,
    steles: current.steles.map((stele) => ({
      ...stele,
      inscription: {
        enabled: stele.inscription.enabled,
        name: 'СОХРАНИТЬ V4',
        dates: '1940 — 2020',
        epitaph: 'Память',
      },
    })),
  }

  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 5)
  assert.equal(migrated.steles[0].inscription.name, 'СОХРАНИТЬ V4')
  assert.equal(migrated.steles[0].inscription.typographyId, 'classic-serif')
  assert.equal(migrated.steles[0].inscription.symbolId, 'none')
  assert.equal(migrated.steles[0].inscription.textScale, 1)
})

test('schema v3 migrates monument portrait and inscription into primary stele', () => {
  const legacy = {
    schemaVersion: 3,
    projectId: 'LEGACY-V3',
    plot: { widthM: 2, depthM: 2.4 },
    monument: { shape: 'book', material: 'gabbro', surfaceId: 'granite-red', widthM: 0.72, heightM: 1.31, depthM: 0.1 },
    portrait: { mode: 'bw', enabled: true, offsetX: 0.2, offsetY: -0.1, zoom: 1.4 },
    inscription: { enabled: true, name: 'СОХРАНИТЬ ИМЯ', dates: '1940 — 2020', epitaph: 'Память' },
    flowerBed: { enabled: true, styleId: 'closed-granite' },
    plinth: { enabled: true, materialId: 'grey-granite' },
    paving: { enabled: true, styleId: 'stone-grey' },
    border: { enabled: true, styleId: 'granite-dark' },
    fence: { enabled: true, styleId: 'classic-black', gateSide: 'left' },
    bench: { enabled: true, styleId: 'wood-classic', side: 'right' },
    table: { enabled: false, styleId: 'round-granite', side: 'left' },
    vase: { enabled: true, styleId: 'classic-vase', placement: 'pair' },
  }
  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 5)
  assert.equal(migrated.layout.type, 'single')
  assert.equal(migrated.steles.length, 1)
  assert.equal(migrated.steles[0].monument.shape, 'book')
  assert.equal(migrated.steles[0].monument.surfaceId, 'granite-red')
  assert.equal(migrated.steles[0].portrait.zoom, 1.4)
  assert.equal(migrated.steles[0].inscription.name, 'СОХРАНИТЬ ИМЯ')
  assert.equal(migrated.steles[0].inscription.typographyId, 'classic-serif')
  assert.equal(migrated.border.enabled, true)
  assert.equal(migrated.vase.placement, 'pair')
})

test('schema v1 migrates to current project model', () => {
  const legacy = {
    schemaVersion: 1,
    projectId: 'LEGACY-V1',
    plot: { widthM: 2, depthM: 2.4 },
    monument: { shape: 'rectangle', material: 'glass', widthM: 0.7, heightM: 1.2, depthM: 0.08 },
    portrait: { mode: 'color', enabled: true },
    flowerBed: { enabled: true }, plinth: { enabled: true }, paving: { enabled: true },
    fence: { enabled: false }, bench: { enabled: false }, table: { enabled: false }, vase: { enabled: false },
  }
  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 5)
  assert.equal(migrated.steles[0].monument.surfaceId, 'glass-clear')
  assert.equal(migrated.steles[0].portrait.zoom, 1)
  assert.equal(migrated.steles[0].inscription.enabled, true)
  assert.equal(migrated.steles[0].inscription.symbolId, 'none')
  assert.equal(migrated.paving.styleId, 'stone-grey')
  assert.equal(migrated.border.enabled, false)
})

test('schema v2 migrates managed complex components without losing enabled state', () => {
  const legacy = {
    schemaVersion: 2,
    projectId: 'LEGACY-V2',
    plot: { widthM: 2, depthM: 2.4 },
    monument: { shape: 'arch', material: 'gabbro', surfaceId: 'gabbro-polished', widthM: 0.65, heightM: 1.25, depthM: 0.09 },
    portrait: { mode: 'color', enabled: true, offsetX: 0, offsetY: 0, zoom: 1 },
    inscription: { enabled: true, name: 'ИМЯ', dates: '19XX — 20XX', epitaph: '' },
    flowerBed: { enabled: true }, plinth: { enabled: true }, paving: { enabled: true },
    fence: { enabled: true }, bench: { enabled: true }, table: { enabled: false }, vase: { enabled: true },
  }
  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 5)
  assert.equal(migrated.fence.enabled, true)
  assert.equal(migrated.fence.styleId, 'classic-black')
  assert.equal(migrated.bench.side, 'right')
  assert.equal(migrated.table.side, 'left')
  assert.equal(migrated.vase.styleId, 'classic-vase')
})

test('current schema normalizes invalid inscription design values fail-safe', () => {
  const raw = JSON.parse(serializeProject(createDefaultProject()))
  raw.steles[0].inscription.typographyId = 'external-font'
  raw.steles[0].inscription.symbolId = 'unknown-symbol'
  raw.steles[0].inscription.align = 'diagonal'
  raw.steles[0].inscription.symbolPlacement = 'middle'
  raw.steles[0].inscription.textScale = 99
  const parsed = parseProject(JSON.stringify(raw))

  assert.equal(parsed.steles[0].inscription.typographyId, 'classic-serif')
  assert.equal(parsed.steles[0].inscription.symbolId, 'none')
  assert.equal(parsed.steles[0].inscription.align, 'center')
  assert.equal(parsed.steles[0].inscription.symbolPlacement, 'top')
  assert.equal(parsed.steles[0].inscription.textScale, 1.35)
})

test('surface is normalized to construction-compatible material per stele', () => {
  const project = createDefaultProject()
  project.steles[0].monument.material = 'glass'
  project.steles[0].monument.surfaceId = 'gabbro-polished'
  assert.equal(normalizeProject(project).steles[0].monument.surfaceId, 'glass-clear')
})

test('paired normalization guarantees a secondary stele', () => {
  const project = createDefaultProject()
  project.layout.type = 'paired'
  const normalized = normalizeProject(project)
  assert.equal(normalized.steles.length, 2)
  assert.notEqual(normalized.steles[0].id, normalized.steles[1].id)
})

test('unsupported schema is rejected', () => {
  const source = createDefaultProject() as unknown as Record<string, unknown>
  source.schemaVersion = 999
  assert.throws(() => parseProject(JSON.stringify(source)), /Unsupported project schema/)
})
