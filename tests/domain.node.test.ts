import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createDefaultProject,
  normalizeProject,
  parseProject,
  serializeProject,
  withLayout,
} from '../src/domain/memorialProject.ts'

test('default project has canonical schema version and one stele', () => {
  const project = createDefaultProject()
  assert.equal(project.schemaVersion, 5)
  assert.equal(project.layout.type, 'single')
  assert.equal(project.steles.length, 1)
  assert.equal(project.steles[0].monument.material, 'gabbro')
  assert.equal(project.steles[0].monument.surfaceId, 'gabbro-polished')
  assert.equal(project.steles[0].portrait.frame, 'oval')
  assert.equal(project.steles[0].portrait.size, 1)
  assert.equal(project.border.enabled, false)
})

test('normalization clamps unsafe stele dimensions and portrait transforms', () => {
  const project = createDefaultProject()
  project.steles[0].monument.widthM = 99
  project.steles[0].monument.depthM = -10
  project.plot.depthM = Number.NaN
  project.steles[0].portrait.zoom = 99
  project.steles[0].portrait.size = 99
  project.steles[0].portrait.offsetX = -99
  project.layout.gapM = 99
  const normalized = normalizeProject(project)
  assert.equal(normalized.steles[0].monument.widthM, 2.5)
  assert.equal(normalized.steles[0].monument.depthM, 0.04)
  assert.equal(normalized.plot.depthM, 1.2)
  assert.equal(normalized.steles[0].portrait.zoom, 3)
  assert.equal(normalized.steles[0].portrait.size, 1.35)
  assert.equal(normalized.steles[0].portrait.offsetX, -1)
  assert.equal(normalized.layout.gapM, 0.8)
})

test('project serialization round-trips schema v5 paired composition', () => {
  const source = withLayout(createDefaultProject(), 'paired')
  source.steles[0].monument.material = 'hybrid'
  source.steles[0].portrait.frame = 'full'
  source.steles[0].portrait.size = 1.2
  source.steles[0].inscription.name = 'ПЕРВЫЙ'
  source.steles[1].inscription.name = 'ВТОРОЙ'
  source.steles[1].monument.shape = 'book'
  source.fence.enabled = true
  source.fence.gateSide = 'left'
  source.border.enabled = true
  const parsed = parseProject(serializeProject(source))
  assert.deepEqual(parsed, source)
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
  assert.equal(migrated.steles[0].portrait.frame, 'rectangle')
  assert.equal(migrated.steles[0].portrait.size, 1)
  assert.equal(migrated.steles[0].inscription.name, 'СОХРАНИТЬ ИМЯ')
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
  assert.equal(migrated.steles[0].portrait.frame, 'rectangle')
  assert.equal(migrated.steles[0].portrait.size, 1)
  assert.equal(migrated.steles[0].inscription.enabled, true)
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

test('schema v4 migrates portrait layout fields without losing paired composition', () => {
  const legacy = {
    schemaVersion: 4,
    projectId: 'LEGACY-V4',
    layout: { type: 'paired', gapM: 0.18 },
    steles: [
      {
        id: 'primary',
        monument: { shape: 'rectangle', material: 'glass', surfaceId: 'glass-clear', widthM: 0.7, heightM: 1.2, depthM: 0.08 },
        portrait: { mode: 'color', enabled: true, offsetX: 0.1, offsetY: -0.1, zoom: 1.25 },
        inscription: { enabled: true, name: 'ПЕРВЫЙ', dates: '19XX — 20XX', epitaph: '' },
      },
      {
        id: 'secondary',
        monument: { shape: 'arch', material: 'gabbro', surfaceId: 'gabbro-polished', widthM: 0.65, heightM: 1.18, depthM: 0.09 },
        portrait: { mode: 'bw', enabled: true, offsetX: 0, offsetY: 0, zoom: 1 },
        inscription: { enabled: true, name: 'ВТОРОЙ', dates: '19XX — 20XX', epitaph: '' },
      },
    ],
    plot: { widthM: 2.4, depthM: 2.6 },
    flowerBed: { enabled: true, styleId: 'open-granite' },
    plinth: { enabled: true, materialId: 'gabbro' },
    paving: { enabled: true, styleId: 'stone-grey' },
    border: { enabled: false, styleId: 'granite-dark' },
    fence: { enabled: false, styleId: 'classic-black', gateSide: 'front' },
    bench: { enabled: false, styleId: 'wood-classic', side: 'right' },
    table: { enabled: false, styleId: 'round-granite', side: 'left' },
    vase: { enabled: true, styleId: 'classic-vase', placement: 'right' },
  }

  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 5)
  assert.equal(migrated.layout.type, 'paired')
  assert.equal(migrated.steles.length, 2)
  assert.equal(migrated.steles[0].portrait.frame, 'rectangle')
  assert.equal(migrated.steles[0].portrait.size, 1)
  assert.equal(migrated.steles[0].portrait.zoom, 1.25)
  assert.equal(migrated.steles[1].inscription.name, 'ВТОРОЙ')
})

test('unsupported schema is rejected', () => {
  const source = createDefaultProject() as unknown as Record<string, unknown>
  source.schemaVersion = 999
  assert.throws(() => parseProject(JSON.stringify(source)), /Unsupported project schema/)
})
