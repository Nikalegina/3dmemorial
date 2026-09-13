import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject } from '../src/domain/memorialProject.ts'

// Browser btoa/atob are available in supported Node 22 CI.
const { createShareUrl, readSharedProject, clearSharedProjectFromUrl } = await import('../src/domain/shareProject.ts')

test('share URL round-trips the current project configuration', () => {
  const project = createDefaultProject()
  project.inscription.name = 'ИВАНОВ ИВАН'
  project.monument.material = 'glass'
  project.monument.surfaceId = 'glass-clear'
  const url = createShareUrl(project, 'https://example.test/constructor')
  const restored = readSharedProject(url)
  assert.deepEqual(restored, project)
})

test('malformed shared project fails closed', () => {
  assert.equal(readSharedProject('https://example.test/?project=broken'), null)
})

test('shared configuration can be removed from URL', () => {
  const project = createDefaultProject()
  const url = createShareUrl(project, 'https://example.test/constructor?foo=bar')
  const cleared = new URL(clearSharedProjectFromUrl(url))
  assert.equal(cleared.searchParams.get('project'), null)
  assert.equal(cleared.searchParams.get('foo'), 'bar')
})
