import assert from 'node:assert/strict'
import test from 'node:test'
import {
  SOURCE_CATALOG_PROFILE_COUNT,
  SOURCE_CATALOG_PROFILES,
  SOURCE_CATALOG_VARIANT_COUNT,
  createSourceCatalogProject,
  findSourceCatalogVariantIndex,
  getSourceCatalogProfile,
  getSourceCatalogProfileByModel,
  isSourceCatalogProfileId,
} from '../src/domain/sourceCatalogProfiles.ts'
import { createSteleGeometry } from '../src/scene/geometry.ts'

test('source catalog registry contains 105 managed profiles and 225 confirmed size variants', () => {
  assert.equal(SOURCE_CATALOG_PROFILE_COUNT, 105)
  assert.equal(SOURCE_CATALOG_VARIANT_COUNT, 225)

  const ids = SOURCE_CATALOG_PROFILES.map((profile) => profile.id)
  const categoryModels = SOURCE_CATALOG_PROFILES.map((profile) => `${profile.sourceCategory}:${profile.sourceModel}`)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(new Set(categoryModels).size, categoryModels.length)

  assert.equal(SOURCE_CATALOG_PROFILES.filter((profile) => profile.sourceCategory === 'figured').length, 84)
  assert.equal(SOURCE_CATALOG_PROFILES.filter((profile) => profile.sourceCategory === 'family').length, 21)
})

test('every source profile has bounded visual contour and category-specific source dimensions', () => {
  for (const profile of SOURCE_CATALOG_PROFILES) {
    assert.ok(profile.points.length >= 4, profile.id)
    assert.ok(profile.variants.length >= 1, profile.id)

    for (const [x, y] of profile.points) {
      assert.ok(Number.isFinite(x), profile.id)
      assert.ok(Number.isFinite(y), profile.id)
      assert.ok(x >= -0.501 && x <= 0.501, `${profile.id}: x=${x}`)
      assert.ok(y >= -0.001 && y <= 1.001, `${profile.id}: y=${y}`)
    }

    for (const variant of profile.variants) {
      if (profile.sourceCategory === 'figured') {
        assert.ok(profile.sourcePage >= 11 && profile.sourcePage <= 20, profile.id)
        assert.ok(variant.heightMm >= 800 && variant.heightMm <= 1500, profile.id)
        assert.ok(variant.widthMm >= 400 && variant.widthMm <= 700, profile.id)
        assert.ok(variant.depthMm >= 50 && variant.depthMm <= 100, profile.id)
      } else if (profile.sourceCategory === 'family') {
        assert.ok(profile.sourcePage >= 21 && profile.sourcePage <= 24, profile.id)
        assert.ok(variant.heightMm >= 400 && variant.heightMm <= 900, profile.id)
        assert.ok(variant.widthMm >= 820 && variant.widthMm <= 1200, profile.id)
        assert.ok(variant.depthMm >= 50 && variant.depthMm <= 70, profile.id)
      } else {
        assert.fail(`Unexpected source category in this gate: ${profile.sourceCategory}`)
      }

      assert.ok(variant.materialCodes.every((code) => typeof code === 'string' && code.length > 0), profile.id)
    }
  }
})

test('all 105 source profiles generate non-empty Three.js extruded geometry', () => {
  for (const profile of SOURCE_CATALOG_PROFILES) {
    const variant = profile.variants[0]
    assert.ok(variant, profile.id)

    const geometry = createSteleGeometry(
      variant.widthMm / 1000,
      variant.heightMm / 1000,
      variant.depthMm / 1000,
      profile.id,
    )

    try {
      const positions = geometry.getAttribute('position')
      assert.ok(positions && positions.count > 0, profile.id)
      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      assert.ok(box, profile.id)
      const width = box.max.x - box.min.x
      const height = box.max.y - box.min.y
      const depth = box.max.z - box.min.z
      assert.ok(width > 0.2, `${profile.id}: width=${width}`)
      assert.ok(height > 0.35, `${profile.id}: height=${height}`)
      assert.ok(depth > 0.03, `${profile.id}: depth=${depth}`)
    } finally {
      geometry.dispose()
    }
  }
})

test('source project factory keeps exact figured catalog dimensions and variant matching', () => {
  const profile = getSourceCatalogProfile('ermis-10')
  const project = createSourceCatalogProject('ermis-10', 2)
  const monument = project.steles[0].monument

  assert.equal(monument.shape, 'ermis-10')
  assert.equal(monument.heightM, 0.8)
  assert.equal(monument.widthM, 0.4)
  assert.equal(monument.depthM, 0.05)
  assert.equal(monument.sourceStoneCode, 'K06')
  assert.equal(findSourceCatalogVariantIndex(profile, monument), 2)
})

test('family source profile lookup is category-aware and reflects the actual source inventory', () => {
  const figured17 = getSourceCatalogProfileByModel('17', 'figured')
  const family17 = getSourceCatalogProfileByModel('17', 'family')

  assert.equal(figured17, null)
  assert.ok(family17)
  assert.equal(family17.id, 'ermis-family-17')
  assert.equal(family17.sourceCategory, 'family')
  assert.deepEqual(family17.variants[0], {
    heightMm: 900,
    widthMm: 1000,
    depthMm: 70,
    materialCodes: ['К06', 'К13', 'К02', 'К05', 'К10', 'К11'],
  })
})

test('family project factory keeps wide exact source dimensions and source material', () => {
  const profile = getSourceCatalogProfile('ermis-family-71')
  const project = createSourceCatalogProject('ermis-family-71', 0)
  const monument = project.steles[0].monument

  assert.equal(profile.sourceCategory, 'family')
  assert.equal(monument.shape, 'ermis-family-71')
  assert.equal(monument.heightM, 0.9)
  assert.equal(monument.widthM, 1.2)
  assert.equal(monument.depthM, 0.07)
  assert.equal(monument.sourceStoneCode, 'K06')
  assert.equal(findSourceCatalogVariantIndex(profile, monument), 0)
})

test('source catalog lookup resolves source model 105 and rejects unknown ids', () => {
  const model105 = getSourceCatalogProfileByModel('105', 'figured')
  assert.ok(model105)
  assert.equal(model105.id, 'ermis-105')
  assert.deepEqual(model105.variants[0], {
    heightMm: 900,
    widthMm: 400,
    depthMm: 70,
    materialCodes: ['К02', 'К06'],
  })
  assert.equal(isSourceCatalogProfileId('ermis-105'), true)
  assert.equal(isSourceCatalogProfileId('ermis-family-71'), true)
  assert.equal(isSourceCatalogProfileId('ermis-does-not-exist'), false)
})
