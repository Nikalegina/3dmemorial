import assert from 'node:assert/strict'
import test from 'node:test'
import {
  CATALOG_PRODUCT_FAMILIES,
  getCatalogProductFamily,
  isCatalogProductFamilyId,
} from '../src/domain/catalogProducts.ts'

test('catalog product families expose unique managed ids and provenance', () => {
  const ids = CATALOG_PRODUCT_FAMILIES.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(ids.length >= 5)

  for (const item of CATALOG_PRODUCT_FAMILIES) {
    assert.ok(item.referenceAssets.length >= 1)
    assert.ok(['source-drawing', 'catalog-visual-reference'].includes(item.geometryAuthority))
  }
})

test('glass complete family reproduces the source construction as an editable project', () => {
  const project = getCatalogProductFamily('catalog-glass-complete').create()
  const stele = project.steles[0]

  assert.equal(project.schemaVersion, 6)
  assert.equal(project.layout.type, 'single')
  assert.equal(stele.monument.material, 'glass')
  assert.equal(stele.monument.shape, 'rectangle')
  assert.equal(stele.monument.depthM, 0.012)
  assert.equal(stele.glass.mountType, 'groove')
  assert.equal(stele.glass.printEdgeMarginMm, 10)
  assert.equal(project.flowerBed.enabled, true)
  assert.equal(project.flowerBed.styleId, 'glass-panel-granite-frame')
  assert.equal(project.plinth.enabled, false)
  assert.equal(project.paving.enabled, false)
})

test('paired, family and combined catalog families stay fully editable in schema v6', () => {
  const paired = getCatalogProductFamily('catalog-glass-paired').create()
  const family = getCatalogProductFamily('catalog-glass-family').create()
  const combined = getCatalogProductFamily('catalog-granite-glass').create()

  assert.equal(paired.layout.type, 'paired')
  assert.equal(paired.steles.length, 2)
  assert.ok(paired.steles.every((stele) => stele.monument.material === 'glass'))

  assert.equal(family.layout.type, 'family')
  assert.ok(family.steles.length >= 3)
  assert.ok(family.steles.slice(0, 3).every((stele) => stele.monument.material === 'glass'))

  assert.equal(combined.layout.type, 'paired')
  assert.equal(combined.steles[0].monument.material, 'gabbro')
  assert.equal(combined.steles[1].monument.material, 'glass')
})

test('catalog product id parser fails closed', () => {
  assert.equal(isCatalogProductFamilyId('catalog-glass-complete'), true)
  assert.equal(isCatalogProductFamilyId('unknown-product'), false)
})
