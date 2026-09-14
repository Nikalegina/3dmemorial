import fs from 'node:fs'
import { buildProductionAssetIndex, stableJson } from './lib/production-assets.mjs'

const manifest = JSON.parse(fs.readFileSync(new URL('../assets/production-manifest.v1.json', import.meta.url), 'utf8'))
const actual = fs.readFileSync(new URL('../public/assets/index.v1.json', import.meta.url), 'utf8')
const expected = stableJson(buildProductionAssetIndex(manifest))

if (actual !== expected) {
  throw new Error('public/assets/index.v1.json is stale; regenerate from production manifest')
}

console.log('production-asset-index: PASS')
