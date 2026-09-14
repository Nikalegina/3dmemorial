import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SOURCE_COMPONENT_PRODUCTS,
  SOURCE_COMPONENT_PRODUCT_COUNT,
  formatSourcePartDimensions,
  getSourceComponentProduct,
  isSourceComponentProductId,
} from '../src/domain/sourceComponentCatalog.ts'
import {
  createSourceComponentProject,
  findSourceComponentProductId,
} from '../src/domain/sourceComponentProject.ts'

test('source component registry contains the complete pages 27-30 bounded set', () => {
  assert.equal(SOURCE_COMPONENT_PRODUCT_COUNT, 21)
  const ids = SOURCE_COMPONENT_PRODUCTS.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(isSourceComponentProductId('ermis-tsk50'), true)
  assert.equal(isSourceComponentProductId('ermis-fence-f04'), true)
  assert.equal(isSourceComponentProductId('invented-component'), false)
})

test('TSK50 and TSR50 preserve exact source furniture part dimensions', () => {
  for (const id of ['ermis-tsk50', 'ermis-tsr50'] as const) {
    const product = getSourceComponentProduct(id)
    assert.equal(product.sourcePage, 27)
    assert.equal(product.parts.length, 4)
    assert.deepEqual(product.parts.map((part) => part.dimensionsMm), [
      [500, 500, 30],
      [750, 150, 150],
      [800, 300, 30],
      [420, 140, 140],
    ])
    assert.ok(product.parts.every((part) => part.materialCodes.length === 1 && part.materialCodes[0] === 'K06'))
  }
  assert.equal(getSourceComponentProduct('ermis-tsk50').sourceSku, 'TSK50')
  assert.equal(getSourceComponentProduct('ermis-tsr50').sourceSku, 'TSR50')
})

test('grave slabs and paving preserve only source-confirmed dimensions and raw material codes', () => {
  const slab = getSourceComponentProduct('ermis-grave-slab-1000x500')
  assert.deepEqual(slab.parts[0].dimensionsMm, [1000, 500])
  assert.equal(formatSourcePartDimensions(slab.parts[0]), '1000 × 500 мм')
  assert.equal(slab.sourceSku, null)

  const paving = getSourceComponentProduct('ermis-paving-600x300')
  assert.deepEqual(paving.parts[0].dimensionsMm, [600, 300])
  assert.deepEqual(paving.parts[0].materialCodes.slice(-3), ['KW', 'KT', 'KB'])
  assert.equal(paving.sourceSku, null)
})

test('page 28 vase and accessory families retain source envelopes', () => {
  const vase = getSourceComponentProduct('ermis-vase-600x260x260')
  assert.deepEqual(vase.parts[0].dimensionsMm, [600, 260, 260])
  assert.deepEqual(vase.parts[0].materialCodes, ['K06'])

  const lampada = getSourceComponentProduct('ermis-lampada-300x150x150')
  assert.deepEqual(lampada.parts[0].dimensionsMm, [300, 150, 150])
  assert.deepEqual(lampada.parts[0].materialCodes, ['K06', 'K05'])

  const sphere = getSourceComponentProduct('ermis-sphere-140x90x90')
  assert.deepEqual(sphere.parts[0].dimensionsMm, [140, 90, 90])
})

test('granite fences F-01 through F-04 preserve source parts without renaming F-04 rows', () => {
  for (const sku of ['F-01', 'F-02', 'F-03', 'F-04']) {
    const product = SOURCE_COMPONENT_PRODUCTS.find((item) => item.sourceSku === sku)
    assert.ok(product, sku)
    assert.equal(product.category, 'fence')
  }

  const f03 = getSourceComponentProduct('ermis-fence-f03')
  assert.deepEqual(f03.parts.map((part) => part.dimensionsMm), [
    [900, 120, 120],
    [450, 120, 120],
    [900, 120, 30],
    [300, 100, 100],
    [140, 110, 110],
  ])

  const f04 = getSourceComponentProduct('ermis-fence-f04')
  assert.deepEqual(f04.parts.map((part) => part.sourceName), ['Столбик', 'Столбик'])
  assert.deepEqual(f04.parts.map((part) => part.dimensionsMm), [
    [300, 120, 120],
    [1100, 120, 70],
  ])
  assert.ok(f04.parts.every((part) => part.materialCodes.join(',') === 'K06,K03,K13'))
})

test('source component project recipes reuse existing managed component slots', () => {
  const tsk = createSourceComponentProject('ermis-tsk50')
  assert.equal(tsk.schemaVersion, 6)
  assert.equal(tsk.bench.enabled, true)
  assert.equal(tsk.bench.styleId, 'ermis-tsk50-bench')
  assert.equal(tsk.table.enabled, true)
  assert.equal(tsk.table.styleId, 'ermis-tsk50-table')

  const slab = createSourceComponentProject('ermis-grave-slab-1200x600')
  assert.equal(slab.flowerBed.styleId, 'ermis-grave-slab-1200x600')

  const paving = createSourceComponentProject('ermis-paving-600x400')
  assert.equal(paving.paving.styleId, 'ermis-paving-600x400')

  const lampada = createSourceComponentProject('ermis-lampada-300x150x150')
  assert.equal(lampada.vase.styleId, 'ermis-lampada-300x150x150')

  const f03 = createSourceComponentProject('ermis-fence-f03')
  assert.equal(f03.fence.enabled, true)
  assert.equal(f03.fence.styleId, 'ermis-fence-f03')
})


test('active source component can be recovered from the managed project state', () => {
  const tsk = createSourceComponentProject('ermis-tsk50')
  assert.equal(findSourceComponentProductId(tsk), 'ermis-tsk50')

  const f03 = createSourceComponentProject('ermis-fence-f03')
  assert.equal(findSourceComponentProductId(f03), 'ermis-fence-f03')

  const paving = createSourceComponentProject('ermis-paving-600x300')
  assert.equal(findSourceComponentProductId(paving), 'ermis-paving-600x300')
})
