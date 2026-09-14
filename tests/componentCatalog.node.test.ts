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
