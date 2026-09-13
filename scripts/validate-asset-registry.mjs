import fs from 'node:fs'

const registry = JSON.parse(fs.readFileSync(new URL('../assets/registry.v1.json', import.meta.url), 'utf8'))
if (registry.schemaVersion !== 1 || !Array.isArray(registry.assets)) throw new Error('Invalid asset registry envelope')
const ids = new Set()
for (const asset of registry.assets) {
  for (const field of ['id', 'type', 'source', 'license', 'status']) {
    if (typeof asset[field] !== 'string' || asset[field].trim() === '') throw new Error(`Asset field ${field} is required`)
  }
  if (ids.has(asset.id)) throw new Error(`Duplicate asset id: ${asset.id}`)
  ids.add(asset.id)
  if (!['OWNED', 'CC0', 'CC-BY'].includes(asset.license)) throw new Error(`Disallowed license: ${asset.license}`)
  if (!['DRAFT', 'ACTIVE', 'ARCHIVED'].includes(asset.status)) throw new Error(`Invalid status: ${asset.status}`)
}
console.log(`asset-registry: PASS (${registry.assets.length} assets)`)
