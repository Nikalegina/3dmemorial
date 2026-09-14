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
  assert.equal(result.context.sourceProfileId, null)
  assert.equal(result.context.sourceVariantIndex, null)
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
  assert.equal(result.context.sourceProfileId, null)
  assert.equal(result.context.sourceVariantIndex, null)
  assert.equal(result.context.sourceSku, 'СТ-01')
  assert.equal(result.project.layout.type, 'single')
  assert.equal(result.project.steles[0].monument.material, 'glass')
  assert.equal(result.project.steles[0].glass.mountType, 'groove')
  assert.equal(result.project.flowerBed.styleId, 'glass-panel-granite-frame')
})

test('source profile entry opens exact catalog geometry and source dimensions', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?profile=ermis-105&variant=0&sourceSku=CAT-105',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.presetId, null)
  assert.equal(result.context.catalogProductId, null)
  assert.equal(result.context.sourceProfileId, 'ermis-105')
  assert.equal(result.context.sourceVariantIndex, 0)
  assert.equal(result.context.sourceSku, 'CAT-105')
  assert.equal(result.project.layout.type, 'single')
  assert.equal(result.project.steles[0].monument.shape, 'ermis-105')
  assert.equal(result.project.steles[0].monument.heightM, 0.9)
  assert.equal(result.project.steles[0].monument.widthM, 0.4)
  assert.equal(result.project.steles[0].monument.depthM, 0.07)
})

test('source profile has priority over catalog recipe and legacy preset', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?profile=ermis-114&variant=0&catalog=catalog-glass-muslim&preset=classic-granite&sourceSku=CAT-114',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.sourceProfileId, 'ermis-114')
  assert.equal(result.context.sourceVariantIndex, 0)
  assert.equal(result.project.steles[0].monument.shape, 'ermis-114')
  assert.equal(result.project.steles[0].monument.widthM, 0.5)
  assert.equal(result.project.steles[0].monument.heightM, 1)
  assert.equal(result.project.steles[0].monument.depthM, 0.05)
})

test('catalog recipe has priority over legacy preset when both are supplied', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?catalog=catalog-glass-muslim&preset=classic-granite&sourceSku=ST-M-01',
    null,
  )
  assert.equal(result.source, 'catalog')
  assert.equal(result.context.catalogProductId, 'catalog-glass-muslim')
  assert.equal(result.context.sourceProfileId, null)
  assert.equal(result.project.steles[0].monument.shape, 'muslim-arch')
  assert.equal(result.project.steles[0].monument.material, 'glass')
})

test('source profile variant deep-link selects the exact confirmed catalog dimensions', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?profile=ermis-10&variant=2&sourceSku=CAT-10-V3',
    null,
  )
  assert.equal(result.context.sourceProfileId, 'ermis-10')
  assert.equal(result.context.sourceVariantIndex, 2)
  assert.equal(result.project.steles[0].monument.shape, 'ermis-10')
  assert.equal(result.project.steles[0].monument.heightM, 0.8)
  assert.equal(result.project.steles[0].monument.widthM, 0.4)
  assert.equal(result.project.steles[0].monument.depthM, 0.05)
})

test('out-of-range source variant fails closed to the first confirmed size', () => {
  const result = resolveStartupProject(
    'https://example.test/constructor?profile=ermis-10&variant=999&sourceSku=CAT-10-BAD',
    null,
  )
  assert.equal(result.context.sourceProfileId, 'ermis-10')
  assert.equal(result.context.sourceVariantIndex, null)
  assert.equal(result.project.steles[0].monument.heightM, 1)
  assert.equal(result.project.steles[0].monument.widthM, 0.45)
  assert.equal(result.project.steles[0].monument.depthM, 0.07)
})

test('invalid profile, catalog product, preset and unsafe SKU fail closed and do not override local project', () => {
  const stored = createDefaultProject()
  stored.projectId = 'LOCAL-KEEP'
  const result = resolveStartupProject(
    'https://example.test/constructor?profile=unknown&catalog=unknown&preset=unknown&sourceSku=%3Cscript%3E',
    stored,
  )
  assert.equal(result.source, 'local')
  assert.equal(result.project.projectId, 'LOCAL-KEEP')
  assert.deepEqual(result.context, {
    presetId: null,
    catalogProductId: null,
    sourceProfileId: null,
    sourceVariantIndex: null,
    sourceSku: null,
  })
})

test('explicit shared project has priority over source profile, catalog product and preset', () => {
  const shared = withLayout(createDefaultProject(), 'paired')
  shared.projectId = 'SHARED-WINS'
  const shareUrl = new URL(createShareUrl(
    shared,
    'https://example.test/constructor?profile=ermis-105&variant=0&catalog=catalog-glass-complete&preset=classic-granite&sourceSku=KM-1',
  ))
  const result = resolveStartupProject(shareUrl.toString(), null)
  assert.equal(result.source, 'shared')
  assert.equal(result.project.projectId, 'SHARED-WINS')
  assert.equal(result.context.sourceProfileId, 'ermis-105')
  assert.equal(result.context.sourceVariantIndex, 0)
  assert.equal(result.context.catalogProductId, 'catalog-glass-complete')
  assert.equal(result.context.sourceSku, 'KM-1')
})

test('catalog parser tolerates malformed URLs by returning empty context', () => {
  assert.deepEqual(readCatalogEntry('not a url'), {
    presetId: null,
    catalogProductId: null,
    sourceProfileId: null,
    sourceVariantIndex: null,
    sourceSku: null,
  })
})
