import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createProjectFromSourceCatalogModel,
  findSourceCatalogModelBySku,
  getSourceCatalogModel,
  getSourceStone,
  SOURCE_CATALOG_COUNTS,
  SOURCE_CATALOG_MODELS,
} from '../src/domain/sourceCatalog.ts'
import { SOURCE_CATALOG_PROFILE_COUNT, getSourceCatalogProfile } from '../src/domain/sourceCatalogProfiles.ts'

test('canonical source catalog contains exactly 150 source models', () => {
  assert.deepEqual(SOURCE_CATALOG_COUNTS, {
    total: 150,
    combined: 22,
    single: 85,
    family: 22,
    elite: 21,
    catalogProfiles: 127,
  })
  assert.equal(SOURCE_CATALOG_PROFILE_COUNT, 127)
  assert.equal(new Set(SOURCE_CATALOG_MODELS.map((model) => model.id)).size, 150)
})

test('every catalog-profile model resolves source-derived polygon data', () => {
  for (const model of SOURCE_CATALOG_MODELS.filter((item) => item.geometryMode === 'catalog-profile')) {
    assert.ok(model.profileId)
    const profile = getSourceCatalogProfile(model.profileId)
    assert.ok(profile)
    assert.ok(profile.length >= 24)
    assert.ok(profile.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)))
  }
})

test('model 20 preserves source dimensions in HEIGHT × WIDTH × DEPTH order', () => {
  const model = getSourceCatalogModel('ERMIS-SINGLE-20')
  assert.equal(model.sourcePage, 12)
  assert.deepEqual(model.variants[0], {
    heightMm: 1100,
    widthMm: 600,
    depthMm: 70,
    stoneCodes: ['К06', 'К02', 'К05', 'К10', 'К11'],
  })

  const project = createProjectFromSourceCatalogModel(model.id)
  assert.equal(project.catalogSource?.modelId, 'ERMIS-SINGLE-20')
  assert.equal(project.catalogSource?.geometryMode, 'catalog-profile')
  assert.equal(project.steles[0].monument.heightM, 1.1)
  assert.equal(project.steles[0].monument.widthM, 0.6)
  assert.equal(project.steles[0].monument.depthM, 0.07)
  assert.equal(project.steles[0].monument.profileId, 'ermis-single-20')
  assert.equal(project.steles[0].monument.stoneCode, 'К06')
})

test('elite model 25 keeps exact source variants but is marked mesh-required', () => {
  const model = getSourceCatalogModel('ERMIS-ELITE-25')
  assert.equal(model.sourcePage, 27)
  assert.equal(model.geometryMode, 'mesh-required')
  assert.deepEqual(model.variants, [
    { heightMm: 2500, widthMm: 1200, depthMm: 300, stoneCodes: ['К05', 'К06', 'К10', 'К11'] },
    { heightMm: 2500, widthMm: 1200, depthMm: 250, stoneCodes: ['К13', 'К14'] },
  ])

  const project = createProjectFromSourceCatalogModel(model.id, 1, 'К14')
  assert.equal(project.catalogSource?.geometryMode, 'mesh-required')
  assert.equal(project.catalogSource?.variantIndex, 1)
  assert.equal(project.steles[0].monument.heightM, 2.5)
  assert.equal(project.steles[0].monument.widthM, 1.2)
  assert.equal(project.steles[0].monument.depthM, 0.25)
  assert.equal(project.steles[0].monument.profileId, null)
  assert.equal(project.steles[0].monument.stoneCode, 'К14')
})

test('generic rectangle does not invent a source size', () => {
  const model = getSourceCatalogModel('ERMIS-SINGLE-RECT')
  assert.equal(model.geometryMode, 'procedural')
  assert.equal(model.variants.length, 0)
  assert.match(model.sourceNote ?? '', /Размеры и цвет уточняйте/)
  const project = createProjectFromSourceCatalogModel(model.id)
  assert.equal(project.catalogSource?.variantIndex, null)
  assert.equal(project.steles[0].monument.shape, 'rectangle')
  assert.equal(project.steles[0].monument.profileId, null)
  assert.equal(project.steles[0].monument.stoneCode, null)
})

test('source model lookup is canonical and stone metadata remains fail-closed', () => {
  assert.equal(findSourceCatalogModelBySku('ermis-single-42е')?.id, 'ERMIS-SINGLE-42E')
  assert.equal(findSourceCatalogModelBySku('not-a-model'), null)
  assert.equal(getSourceStone('К06')?.name, 'BLACK GABBRO')
  assert.equal(getSourceStone('К08')?.sourceStatus, 'unresolved')
  assert.equal(getSourceStone('G654')?.densityGcm3, null)
})
