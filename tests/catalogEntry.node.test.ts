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
  assert.equal(result.context.catalogProductId, null)
  assert.equal(result.context.sourceSku, 'KM-PAIR-001')
  assert.equal(result.project.layout.type, 'paired')
  assert.equal(result.project.steles[0].monument.material, 'glass')
  assert.equal(result.project.steles[1].monument.material, 'glass')
  assert.equal(result.project.steles[0].monument.depthM, 0.012)
  assert.equal(result.project.steles[0].glass.thicknessMm, 12)
})

test('catalog product entry resolves an editable catalog recipe and accepts Cyrillic SKU', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?catalog=catalog-glass-complete&sourceSku=%D0%A1%D0%A2-01',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.presetId, null)
  assert.equal(result.context.catalogProductId, 'catalog-glass-complete')
  assert.equal(result.context.sourceSku, 'СТ-01')
  assert.equal(result.project.layout.type, 'single')
  assert.equal(result.project.steles[0].monument.material, 'glass')
  assert.equal(result.project.steles[0].glass.mountType, 'groove')
  assert.equal(result.project.flowerBed.styleId, 'glass-panel-granite-frame')
})

test('catalog recipe has priority over legacy preset when both are supplied', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?catalog=catalog-glass-muslim&preset=classic-granite&sourceSku=ST-M-01',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.catalogProductId, 'catalog-glass-muslim')
  assert.equal(result.project.steles[0].monument.shape, 'muslim-arch')
  assert.equal(result.project.steles[0].monument.material, 'glass')
})


test('exact source catalog SKU resolves model geometry before legacy preset', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?sourceSku=ERMIS-SINGLE-20&preset=classic-granite',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.sourceSku, 'ERMIS-SINGLE-20')
  assert.equal(result.project.catalogSource?.modelId, 'ERMIS-SINGLE-20')
  assert.equal(result.project.catalogSource?.geometryMode, 'catalog-profile')
  assert.equal(result.project.steles[0].monument.profileId, 'ermis-single-20')
  assert.equal(result.project.steles[0].monument.heightM, 1.1)
  assert.equal(result.project.steles[0].monument.widthM, 0.6)
  assert.equal(result.project.steles[0].monument.stoneCode, 'К06')
})

test('invalid catalog product, preset and unsafe SKU fail closed and do not override local project', () => {
  const stored = createDefaultProject()
  stored.projectId = 'LOCAL-KEEP'
  const result = resolveStartupProject(
    'https://example.test/constructor?catalog=unknown&preset=unknown&sourceSku=%3Cscript%3E',
    stored,
  )
  assert.equal(result.source, 'local')
  assert.equal(result.project.projectId, 'LOCAL-KEEP')
  assert.deepEqual(result.context, { presetId: null, catalogProductId: null, sourceSku: null })
})

test('explicit shared project has priority over catalog product and preset', () => {
  const shared = withLayout(createDefaultProject(), 'paired')
  shared.projectId = 'SHARED-WINS'
  const shareUrl = new URL(createShareUrl(
    shared,
    'https://example.test/constructor?catalog=catalog-glass-complete&preset=classic-granite&sourceSku=KM-1',
  ))
  const result = resolveStartupProject(shareUrl.toString(), null)
  assert.equal(result.source, 'shared')
  assert.equal(result.project.projectId, 'SHARED-WINS')
  assert.equal(result.context.catalogProductId, 'catalog-glass-complete')
  assert.equal(result.context.sourceSku, 'KM-1')
})

test('catalog parser tolerates malformed URLs by returning empty context', () => {
  assert.deepEqual(readCatalogEntry('not a url'), { presetId: null, catalogProductId: null, sourceSku: null })
})
