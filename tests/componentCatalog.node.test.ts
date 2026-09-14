import assert from 'node:assert/strict'
import test from 'node:test'
import {
  BENCH_STYLES,
  BORDER_STYLES,
  FENCE_STYLES,
  FLOWER_BED_STYLES,
  PAVING_STYLES,
  TABLE_STYLES,
  VASE_STYLES,
} from '../src/domain/componentCatalog.ts'

const catalogs = [FLOWER_BED_STYLES, PAVING_STYLES, BORDER_STYLES, FENCE_STYLES, BENCH_STYLES, TABLE_STYLES, VASE_STYLES]

test('managed component catalogs expose unique ids', () => {
  for (const catalog of catalogs) {
    const ids = catalog.map((item) => item.id)
    assert.equal(new Set(ids).size, ids.length)
    assert.ok(ids.length >= 2)
  }
})


test('glass panel flowerbed is a managed catalog component', () => {
  const glassPanel = FLOWER_BED_STYLES.find((item) => item.id === 'glass-panel-granite-frame')
  assert.ok(glassPanel)
  assert.equal(glassPanel.kind, 'glass-panel')
})

test('source-backed managed styles point to existing source component ids', () => {
  const tskBench = BENCH_STYLES.find((item) => item.id === 'ermis-tsk50-bench')
  const tskTable = TABLE_STYLES.find((item) => item.id === 'ermis-tsk50-table')
  const slab = FLOWER_BED_STYLES.find((item) => item.id === 'ermis-grave-slab-1000x500')
  const paving = PAVING_STYLES.find((item) => item.id === 'ermis-paving-600x300')
  const fence = FENCE_STYLES.find((item) => item.id === 'ermis-fence-f03')
  const lampada = VASE_STYLES.find((item) => item.id === 'ermis-lampada-300x150x150')

  assert.ok(tskBench && 'sourceComponentId' in tskBench)
  assert.ok(tskTable && 'sourceComponentId' in tskTable)
  assert.ok(slab && slab.kind === 'grave-slab')
  assert.ok(paving && 'tileSizeM' in paving)
  assert.ok(fence && fence.kind === 'stone-f03')
  assert.ok(lampada && lampada.kind === 'lampada')
})
