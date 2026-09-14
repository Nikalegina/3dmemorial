import assert from 'node:assert/strict'
import test from 'node:test'
import {
  findStandardGlassSteleSize,
  GLASS_FLOWERBED_PANEL_STANDARD_SIZES,
  GLASS_MOUNT_OPTIONS,
  GLASS_PORTRAIT_STANDARD_SIZES,
  GLASS_PRINT_EDGE_MARGIN_MIN_MM,
  GLASS_STELE_STANDARD_SIZES,
  createDefaultGlassSteleConfig,
  glassThicknessMeters,
  normalizeGlassSteleConfig,
} from '../src/domain/glassMemorial.ts'

test('glass stele technical catalog exposes source-backed standard sizes and mounting methods', () => {
  assert.deepEqual(
    GLASS_STELE_STANDARD_SIZES.map((item) => item.id),
    ['400x800', '400x900', '450x900', '500x1000', '500x1100', '500x1200', '600x1200'],
  )
  assert.deepEqual(
    GLASS_MOUNT_OPTIONS.map((item) => item.id),
    ['groove', 'manet', 'floor-holder', 'clamp-profile'],
  )
})

test('glass technical defaults are conservative and production-safe', () => {
  const config = createDefaultGlassSteleConfig()
  assert.equal(config.thicknessMm, 12)
  assert.equal(config.mountType, 'groove')
  assert.equal(config.uvPrintSides, 1)
  assert.equal(config.printEdgeMarginMm, GLASS_PRINT_EDGE_MARGIN_MIN_MM)
  assert.equal(glassThicknessMeters(config), 0.012)
})

test('glass technical normalization enforces supported thickness and minimum print margin', () => {
  const normalized = normalizeGlassSteleConfig({
    thicknessMm: 16,
    clarity: 'low-iron',
    mountType: 'manet',
    uvPrintSides: 2,
    printEdgeMarginMm: 2,
  })

  assert.equal(normalized.thicknessMm, 16)
  assert.equal(normalized.clarity, 'low-iron')
  assert.equal(normalized.mountType, 'manet')
  assert.equal(normalized.uvPrintSides, 2)
  assert.equal(normalized.printEdgeMarginMm, 10)
})

test('standard glass stele size can be derived from project dimensions', () => {
  assert.equal(findStandardGlassSteleSize(0.5, 1)?.id, '500x1000')
  assert.equal(findStandardGlassSteleSize(0.55, 1.05), null)
})

test('portrait and flowerbed reference catalogs preserve documented production sizes', () => {
  assert.ok(GLASS_PORTRAIT_STANDARD_SIZES.some((item) => item.id === '240x300' && item.thicknessMm === 8))
  assert.ok(GLASS_PORTRAIT_STANDARD_SIZES.some((item) => item.id === '400x600' && item.tempered === true))
  assert.ok(GLASS_FLOWERBED_PANEL_STANDARD_SIZES.some((item) => item.id === '1050x550-12'))
  assert.ok(GLASS_FLOWERBED_PANEL_STANDARD_SIZES.some((item) => item.id === '1270x700-16'))
})
