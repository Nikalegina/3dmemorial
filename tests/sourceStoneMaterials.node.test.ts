import assert from 'node:assert/strict'
import test from 'node:test'
import { SOURCE_CATALOG_PROFILES, createSourceCatalogProject } from '../src/domain/sourceCatalogProfiles.ts'
import {
  SOURCE_STONE_CODES,
  SOURCE_STONE_MATERIALS,
  getSourceStoneMaterial,
  normalizeSourceStoneCode,
  resolveSourceStoneCodes,
} from '../src/domain/sourceStoneMaterials.ts'
import { parseProject, serializeProject } from '../src/domain/memorialProject.ts'

test('source stone registry contains documented catalog materials plus explicit unresolved codes', () => {
  assert.equal(SOURCE_STONE_CODES.length, 14)
  assert.equal(SOURCE_STONE_MATERIALS.length, 14)

  const documented = SOURCE_STONE_MATERIALS.filter((item) => item.sourceAuthority === 'documented')
  const unresolved = SOURCE_STONE_MATERIALS.filter((item) => item.sourceAuthority === 'unresolved')

  assert.equal(documented.length, 12)
  assert.deepEqual(unresolved.map((item) => item.code).sort(), ['G654', 'K08'])
})

test('K06 properties match the source catalog material page', () => {
  const k06 = getSourceStoneMaterial('K06')
  assert.equal(k06.name, 'BLACK GABBRO')
  assert.equal(k06.sourcePage, 4)
  assert.equal(k06.density, '2,80 г/см³')
  assert.equal(k06.compressiveStrength, '1600 кг/см²')
  assert.equal(k06.porosity, 'не более 1%')
  assert.equal(k06.waterAbsorption, 'не более 0,1%')
  assert.equal(k06.frostResistance, 'более 50 циклов')
  assert.equal(k06.durability, 'не менее 500 лет')
})

test('mixed Cyrillic and Latin K source codes canonicalize to stable ids', () => {
  assert.equal(normalizeSourceStoneCode('К06'), 'K06')
  assert.equal(normalizeSourceStoneCode('K06'), 'K06')
  assert.equal(normalizeSourceStoneCode('к13'), 'K13')
  assert.equal(normalizeSourceStoneCode('G654'), 'G654')
  assert.equal(normalizeSourceStoneCode('UNKNOWN'), null)
})

test('every non-empty stone code referenced by the 84 source profiles resolves in the registry', () => {
  for (const profile of SOURCE_CATALOG_PROFILES) {
    for (const variant of profile.variants) {
      const rawCodes = variant.materialCodes.filter((value) => value.trim().length > 0)
      const resolved = resolveSourceStoneCodes(rawCodes)
      assert.equal(
        resolved.length,
        new Set(rawCodes.map((value) => value.toUpperCase().replace(/^К/, 'K'))).size,
        `${profile.id}: ${rawCodes.join(', ')}`,
      )
    }
  }
})

test('source project factory initializes an allowed catalog stone and preserves it through JSON', () => {
  const project = createSourceCatalogProject('ermis-105', 0)
  const stele = project.steles[0]

  assert.equal(stele.monument.sourceStoneCode, 'K02')
  assert.equal(stele.monument.surfaceId, getSourceStoneMaterial('K02').renderSurfaceId)

  const restored = parseProject(serializeProject(project))
  assert.equal(restored.steles[0].monument.sourceStoneCode, 'K02')
})

test('unresolved source code remains explicit and uses a generic visual fallback without invented properties', () => {
  const k08 = getSourceStoneMaterial('K08')
  assert.equal(k08.sourceAuthority, 'unresolved')
  assert.equal(k08.sourcePage, null)
  assert.equal(k08.density, null)
  assert.equal(k08.compressiveStrength, null)
  assert.equal(k08.renderAuthority, 'generic-fallback')
})
