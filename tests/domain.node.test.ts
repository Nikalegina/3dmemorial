import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, normalizeProject, parseProject, serializeProject } from '../src/domain/memorialProject.ts'

test('default project has canonical schema version', () => {
  const project = createDefaultProject()
  assert.equal(project.schemaVersion, 2)
  assert.equal(project.monument.material, 'gabbro')
  assert.equal(project.monument.surfaceId, 'gabbro-polished')
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

test('project serialization round-trips', () => {
  const source = createDefaultProject()
  source.monument.material = 'hybrid'
  source.fence.enabled = true
  source.inscription.name = 'ТЕСТОВОЕ ИМЯ'
  const parsed = parseProject(serializeProject(source))
  assert.deepEqual(parsed, source)
})

test('schema v1 migrates to current project model', () => {
  const legacy = {
    schemaVersion: 1,
    projectId: 'LEGACY',
    plot: { widthM: 2, depthM: 2.4 },
    monument: { shape: 'rectangle', material: 'glass', widthM: 0.7, heightM: 1.2, depthM: 0.08 },
    portrait: { mode: 'color', enabled: true },
    flowerBed: { enabled: true }, plinth: { enabled: true }, paving: { enabled: true },
    fence: { enabled: false }, bench: { enabled: false }, table: { enabled: false }, vase: { enabled: false },
  }
  const migrated = parseProject(JSON.stringify(legacy))
  assert.equal(migrated.schemaVersion, 2)
  assert.equal(migrated.monument.surfaceId, 'glass-clear')
  assert.equal(migrated.portrait.zoom, 1)
  assert.equal(migrated.inscription.enabled, true)
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
