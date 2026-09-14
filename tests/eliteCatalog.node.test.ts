import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ELITE_CATALOG_MODEL_COUNT,
  ELITE_CATALOG_MODELS,
  ELITE_CATALOG_STRATEGY_COUNTS,
  getEliteCatalogModel,
} from '../src/domain/eliteCatalog.ts'
import { getSourceCatalogProfile } from '../src/domain/sourceCatalogProfiles.ts'

test('elite source pages 25-27 contain 21 classified models with no duplicates', () => {
  assert.equal(ELITE_CATALOG_MODEL_COUNT, 21)
  assert.equal(new Set(ELITE_CATALOG_MODELS.map((item) => item.sourceModel)).size, 21)
  assert.deepEqual(ELITE_CATALOG_STRATEGY_COUNTS, {
    profileExtrusion: 1,
    proceduralCompound: 4,
    glbRequired: 16,
  })
})

test('every elite model preserves source page, dimensions and material codes', () => {
  for (const item of ELITE_CATALOG_MODELS) {
    assert.ok(item.sourcePage >= 25 && item.sourcePage <= 27, item.id)
    assert.ok(item.variants.length >= 1, item.id)
    assert.ok(item.rationale.length > 20, item.id)

    for (const variant of item.variants) {
      assert.ok(variant.heightMm > 0, item.id)
      assert.ok(variant.widthMm > 0, item.id)
      assert.ok(variant.depthMm > 0, item.id)
      assert.ok(variant.materialCodes.length > 0, item.id)
    }
  }
})

test('elite model 24 keeps both source-confirmed variants', () => {
  const model24 = getEliteCatalogModel('24')
  assert.ok(model24)
  assert.equal(model24.strategy, 'procedural-compound')
  assert.deepEqual(model24.variants, [
    { heightMm: 2500, widthMm: 1200, depthMm: 300, materialCodes: ['K05', 'K06', 'K10', 'K11'] },
    { heightMm: 2500, widthMm: 1200, depthMm: 250, materialCodes: ['K13', 'K14'] },
  ])
})

test('only elite model 19 is promoted to the profile renderer in this gate', () => {
  const runtime = ELITE_CATALOG_MODELS.filter((item) => item.runtimeProfileId)
  assert.equal(runtime.length, 1)
  assert.equal(runtime[0].sourceModel, '19')
  assert.equal(runtime[0].strategy, 'profile-extrusion')
  assert.equal(runtime[0].runtimeProfileId, 'ermis-elite-19')

  const profile = getSourceCatalogProfile('ermis-elite-19')
  assert.equal(profile.sourceCategory, 'elite')
  assert.equal(profile.sourcePage, 26)
  assert.equal(profile.variants[0].heightMm, 1500)
  assert.equal(profile.variants[0].widthMm, 700)
  assert.equal(profile.variants[0].depthMm, 150)
})

test('sculptural elite models never claim a profile runtime representation', () => {
  for (const item of ELITE_CATALOG_MODELS.filter((entry) => entry.strategy === 'glb-required')) {
    assert.equal(item.runtimeProfileId, undefined, item.id)
  }
})
