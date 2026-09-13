import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, normalizeProject, parseProject, serializeProject } from '../src/domain/memorialProject.ts'

test('default project has canonical schema version', () => {
  const project = createDefaultProject()
  assert.equal(project.schemaVersion, 1)
  assert.equal(project.monument.material, 'gabbro')
})

test('normalization clamps unsafe dimensions', () => {
  const project = createDefaultProject()
  project.monument.widthM = 99
  project.monument.depthM = -10
  project.plot.depthM = Number.NaN
  const normalized = normalizeProject(project)
  assert.equal(normalized.monument.widthM, 2.5)
  assert.equal(normalized.monument.depthM, 0.04)
  assert.equal(normalized.plot.depthM, 1.2)
})

test('project serialization round-trips', () => {
  const source = createDefaultProject()
  source.monument.material = 'hybrid'
  source.fence.enabled = true
  const parsed = parseProject(serializeProject(source))
  assert.deepEqual(parsed, source)
})

test('unsupported schema is rejected', () => {
  const source = createDefaultProject() as unknown as Record<string, unknown>
  source.schemaVersion = 999
  assert.throws(() => parseProject(JSON.stringify(source)), /Unsupported project schema/)
})
