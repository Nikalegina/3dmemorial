import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildProductionAssetIndex,
  validateProductionAssetManifest,
} from '../scripts/lib/production-assets.mjs'

const shaA = 'a'.repeat(64)
const shaB = 'b'.repeat(64)

function baseManifest(assets = []) {
  return {
    schemaVersion: 1,
    runtimeBasePath: '/assets/runtime/',
    budgets: {
      MODEL_GLB: 12 * 1024 * 1024,
      TEXTURE_WEBP: 4 * 1024 * 1024,
      FONT_WOFF2: 768000,
    },
    assets,
  }
}

function approvedModel(overrides = {}) {
  return {
    id: 'MODEL-TEST-001',
    version: 1,
    kind: 'MODEL_GLB',
    status: 'APPROVED',
    provenanceRef: 'internal://owned/model-test-001',
    sourceSha256: shaA,
    runtimeSha256: shaB,
    runtimeObjectKey: `models/model-test-001/v1/model-test-001-${shaB.slice(0, 12)}.glb`,
    byteSize: 1024,
    mimeType: 'model/gltf-binary',
    rights: {
      licenseClass: 'OWNED',
      webRedistributionApproved: true,
      attributionRequired: false,
    },
    ...overrides,
  }
}

test('canonical empty production manifest is valid and builds deterministic empty index', () => {
  const manifest = baseManifest()
  assert.doesNotThrow(() => validateProductionAssetManifest(manifest))
  assert.deepEqual(buildProductionAssetIndex(manifest), {
    schemaVersion: 1,
    runtimeBasePath: '/assets/runtime/',
    assets: [],
  })
})

test('approved owned GLB produces a public runtime record without private provenance metadata', () => {
  const index = buildProductionAssetIndex(baseManifest([approvedModel()]))
  assert.equal(index.assets.length, 1)
  assert.equal(index.assets[0].id, 'MODEL-TEST-001')
  assert.equal(index.assets[0].sha256, shaB)
  assert.equal('provenanceRef' in index.assets[0], false)
  assert.equal('rights' in index.assets[0], false)
})

test('approved commercial asset without web redistribution rights is rejected', () => {
  const asset = approvedModel({
    rights: {
      licenseClass: 'COMMERCIAL',
      webRedistributionApproved: false,
      attributionRequired: false,
    },
  })
  assert.throws(
    () => validateProductionAssetManifest(baseManifest([asset])),
    /web redistribution rights/,
  )
})

test('unsafe or mutable runtime object keys are rejected', () => {
  assert.throws(
    () => validateProductionAssetManifest(baseManifest([approvedModel({ runtimeObjectKey: '../model.glb' })])),
    /unsafe runtimeObjectKey/,
  )

  assert.throws(
    () => validateProductionAssetManifest(baseManifest([approvedModel({ runtimeObjectKey: 'models/model.glb' })])),
    /checksum prefix/,
  )
})

test('CC-BY requires explicit attribution text', () => {
  const asset = approvedModel({
    rights: {
      licenseClass: 'CC-BY',
      webRedistributionApproved: true,
      attributionRequired: false,
    },
  })
  assert.throws(() => validateProductionAssetManifest(baseManifest([asset])), /CC-BY requires attribution/)
})

test('runtime files exceeding mobile delivery budget are rejected', () => {
  const asset = approvedModel({ byteSize: 20 * 1024 * 1024 })
  assert.throws(() => validateProductionAssetManifest(baseManifest([asset])), /exceeds MODEL_GLB budget/)
})
