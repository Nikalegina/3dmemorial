import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, normalizeProject, parseProject, serializeProject } from '../src/domain/memorialProject.ts'

test('default project has canonical schema version', () => {
  const project = createDefaultProject()
  assert.equal(project.schemaVersion, 3)
  assert.equal(project.monument.material, 'gabbro')
  assert.equal(project.monument.surfaceId, 'gabbro-polished')
  assert.equal(project.border.enabled, false)
})

test('normalization clamps unsafe dimensions and portrait transforms', () => {
  const project = createDefaultProject()
  project.monument.widthM = 99
  project.monument.depthM = -10
  project.plot.depthM = Number.NaN
  project.portrait.zoom = 99
  project.portrait.offsetX = -99
  const normalized = normalizeProject(project)
  assert.equal(normalized.monument.widthM, 2.5)
  assert.equal(normalized.monument.depthM, 0.04)
  assert.equal(normalized.plot.depthM, 1.2)
  assert.equal(normalized.portrait.zoom, 3)
  assert.equal(normalized.portrait.offsetX, -1)
})

test('project serialization round-trips schema v3', () => {
  const source = createDefaultProject()
  source.monument.material = 'hybrid'
  source.fence.enabled = true
  source.fence.gateSide = 'left'
  source.border.enabled = true
  source.inscription.name = 'ТЕСТОВОЕ ИМЯ'
  const parsed = parseProject(serializeProject(source))
  assert.deepEqual(parsed, source)
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
  assert.equal(migrated.schemaVersion, 3)
  assert.equal(migrated.monument.surfaceId, 'glass-clear')
  assert.equal(migrated.portrait.zoom, 1)
  assert.equal(migrated.inscription.enabled, true)
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
  assert.equal(migrated.schemaVersion, 3)
  assert.equal(migrated.fence.enabled, true)
  assert.equal(migrated.fence.styleId, 'classic-black')
  assert.equal(migrated.bench.side, 'right')
  assert.equal(migrated.table.side, 'left')
  assert.equal(migrated.vase.styleId, 'classic-vase')
})

test('surface is normalized to construction-compatible material', () => {
  const project = createDefaultProject()
  project.monument.material = 'glass'
  project.monument.surfaceId = 'gabbro-polished'
  assert.equal(normalizeProject(project).monument.surfaceId, 'glass-clear')
})

test('unsupported schema is rejected', () => {
  const source = createDefaultProject() as unknown as Record<string, unknown>
  source.schemaVersion = 999
  assert.throws(() => parseProject(JSON.stringify(source)), /Unsupported project schema/)
})
