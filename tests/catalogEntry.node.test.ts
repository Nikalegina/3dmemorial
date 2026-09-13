import assert from 'node:assert/strict'
import test from 'node:test'
import { resolveStartupProject, readCatalogEntry } from '../src/domain/catalogEntry.ts'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'
import { createShareUrl } from '../src/domain/shareProject.ts'

test('catalog entry starts a validated paired preset and keeps source SKU attribution', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?preset=paired-glass&sourceSku=KM-PAIR-001',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.presetId, 'paired-glass')
  assert.equal(result.context.sourceSku, 'KM-PAIR-001')
  assert.equal(result.project.layout.type, 'paired')
  assert.equal(result.project.steles[0].monument.material, 'glass')
  assert.equal(result.project.steles[1].monument.material, 'glass')
})

test('invalid preset and unsafe SKU fail closed and do not override local project', () => {
  const stored = createDefaultProject()
  stored.projectId = 'LOCAL-KEEP'
  const result = resolveStartupProject(
    'https://example.test/constructor?preset=unknown&sourceSku=%3Cscript%3E',
    stored,
  )
  assert.equal(result.source, 'local')
  assert.equal(result.project.projectId, 'LOCAL-KEEP')
  assert.deepEqual(result.context, { presetId: null, sourceSku: null })
})

test('explicit shared project has priority over catalog preset', () => {
  const shared = withLayout(createDefaultProject(), 'paired')
  shared.projectId = 'SHARED-WINS'
  const shareUrl = new URL(createShareUrl(shared, 'https://example.test/constructor?preset=classic-granite&sourceSku=KM-1'))
  const result = resolveStartupProject(shareUrl.toString(), null)
  assert.equal(result.source, 'shared')
  assert.equal(result.project.projectId, 'SHARED-WINS')
  assert.equal(result.context.sourceSku, 'KM-1')
})

test('catalog parser tolerates malformed URLs by returning empty context', () => {
  assert.deepEqual(readCatalogEntry('not a url'), { presetId: null, sourceSku: null })
})
