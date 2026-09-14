import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'

const { createShareUrl, readSharedProject, clearSharedProjectFromUrl } = await import('../src/domain/shareProject.ts')

test('share URL round-trips paired current project configuration', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].inscription.name = 'ИВАНОВ ИВАН'
  project.steles[0].monument.material = 'glass'
  project.steles[0].monument.surfaceId = 'glass-clear'
  project.steles[0].portrait.frame = 'full'
  project.steles[0].portrait.size = 1.2
  project.steles[1].inscription.name = 'ИВАНОВА МАРИЯ'
  project.steles[1].monument.shape = 'heart'
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
