const HEX_64 = /^[a-f0-9]{64}$/
const SAFE_ID = /^[A-Z0-9][A-Z0-9_-]{2,63}$/
const SAFE_OBJECT_KEY = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/

const ALLOWED_KINDS = new Set(['MODEL_GLB', 'TEXTURE_WEBP', 'FONT_WOFF2'])
const ALLOWED_STATUS = new Set(['DRAFT', 'APPROVED', 'ARCHIVED'])
const ALLOWED_LICENSE = new Set(['OWNED', 'CC0', 'CC-BY', 'COMMERCIAL'])

const MIME_BY_KIND = {
  MODEL_GLB: 'model/gltf-binary',
  TEXTURE_WEBP: 'image/webp',
  FONT_WOFF2: 'font/woff2',
}

const EXTENSION_BY_KIND = {
  MODEL_GLB: '.glb',
  TEXTURE_WEBP: '.webp',
  FONT_WOFF2: '.woff2',
}

function requiredString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') throw new Error(`${label} is required`)
  return value
}

function validateObjectKey(key, asset, runtimeSha256) {
  requiredString(key, `${asset.id}.runtimeObjectKey`)
  if (!SAFE_OBJECT_KEY.test(key) || key.startsWith('/') || key.includes('..') || key.includes('//')) {
    throw new Error(`${asset.id}: unsafe runtimeObjectKey`)
  }
  if (key.includes('?') || key.includes('#')) throw new Error(`${asset.id}: runtimeObjectKey must not contain query/fragment`)

  const expectedExtension = EXTENSION_BY_KIND[asset.kind]
  if (!key.endsWith(expectedExtension)) {
    throw new Error(`${asset.id}: runtimeObjectKey extension must be ${expectedExtension}`)
  }

  const checksumPrefix = runtimeSha256.slice(0, 12)
  if (!key.includes(checksumPrefix)) {
    throw new Error(`${asset.id}: runtimeObjectKey must include runtime checksum prefix ${checksumPrefix}`)
  }
}

export function validateProductionAssetManifest(manifest) {
  if (!manifest || manifest.schemaVersion !== 1) throw new Error('Invalid production asset manifest schemaVersion')
  if (typeof manifest.runtimeBasePath !== 'string' || !manifest.runtimeBasePath.startsWith('/') || !manifest.runtimeBasePath.endsWith('/')) {
    throw new Error('runtimeBasePath must be an absolute path ending with /')
  }
  if (!manifest.budgets || typeof manifest.budgets !== 'object') throw new Error('budgets are required')
  if (!Array.isArray(manifest.assets)) throw new Error('assets must be an array')

  for (const kind of ALLOWED_KINDS) {
    const budget = manifest.budgets[kind]
    if (!Number.isInteger(budget) || budget <= 0) throw new Error(`Invalid budget for ${kind}`)
  }

  const versions = new Set()
  for (const asset of manifest.assets) {
    requiredString(asset.id, 'asset.id')
    if (!SAFE_ID.test(asset.id)) throw new Error(`${asset.id}: invalid asset id`)
    if (!Number.isInteger(asset.version) || asset.version < 1) throw new Error(`${asset.id}: version must be positive integer`)
    if (!ALLOWED_KINDS.has(asset.kind)) throw new Error(`${asset.id}: invalid kind`)
    if (!ALLOWED_STATUS.has(asset.status)) throw new Error(`${asset.id}: invalid status`)

    const versionKey = `${asset.id}@${asset.version}`
    if (versions.has(versionKey)) throw new Error(`Duplicate asset version: ${versionKey}`)
    versions.add(versionKey)

    if (!asset.rights || typeof asset.rights !== 'object') throw new Error(`${asset.id}: rights are required`)
    if (!ALLOWED_LICENSE.has(asset.rights.licenseClass)) throw new Error(`${asset.id}: invalid licenseClass`)
    if (typeof asset.rights.webRedistributionApproved !== 'boolean') {
      throw new Error(`${asset.id}: webRedistributionApproved must be boolean`)
    }
    if (typeof asset.rights.attributionRequired !== 'boolean') {
      throw new Error(`${asset.id}: attributionRequired must be boolean`)
    }
    if (asset.rights.attributionRequired) {
      requiredString(asset.rights.attributionText, `${asset.id}.rights.attributionText`)
    }
    if (asset.rights.licenseClass === 'CC-BY' && !asset.rights.attributionRequired) {
      throw new Error(`${asset.id}: CC-BY requires attribution`)
    }

    requiredString(asset.provenanceRef, `${asset.id}.provenanceRef`)
    if (!HEX_64.test(asset.sourceSha256 ?? '')) throw new Error(`${asset.id}: invalid sourceSha256`)

    if (asset.status !== 'APPROVED') continue

    if (!asset.rights.webRedistributionApproved) {
      throw new Error(`${asset.id}: APPROVED asset requires web redistribution rights`)
    }
    if (!HEX_64.test(asset.runtimeSha256 ?? '')) throw new Error(`${asset.id}: invalid runtimeSha256`)
    if (!Number.isInteger(asset.byteSize) || asset.byteSize <= 0) throw new Error(`${asset.id}: byteSize must be positive integer`)
    if (asset.byteSize > manifest.budgets[asset.kind]) {
      throw new Error(`${asset.id}: byteSize exceeds ${asset.kind} budget`)
    }

    const expectedMime = MIME_BY_KIND[asset.kind]
    if (asset.mimeType !== expectedMime) throw new Error(`${asset.id}: mimeType must be ${expectedMime}`)
    validateObjectKey(asset.runtimeObjectKey, asset, asset.runtimeSha256)
  }

  return manifest
}

export function buildProductionAssetIndex(manifest) {
  validateProductionAssetManifest(manifest)

  const assets = manifest.assets
    .filter((asset) => asset.status === 'APPROVED')
    .sort((a, b) => a.id.localeCompare(b.id) || a.version - b.version)
    .map((asset) => ({
      id: asset.id,
      version: asset.version,
      kind: asset.kind,
      runtimeObjectKey: asset.runtimeObjectKey,
      sha256: asset.runtimeSha256,
      byteSize: asset.byteSize,
      mimeType: asset.mimeType,
      attribution: asset.rights.attributionRequired ? asset.rights.attributionText : null,
    }))

  return {
    schemaVersion: 1,
    runtimeBasePath: manifest.runtimeBasePath,
    assets,
  }
}

export function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}
