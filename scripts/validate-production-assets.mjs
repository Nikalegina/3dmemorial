import fs from 'node:fs'
import { validateProductionAssetManifest } from './lib/production-assets.mjs'

const manifest = JSON.parse(fs.readFileSync(new URL('../assets/production-manifest.v1.json', import.meta.url), 'utf8'))
validateProductionAssetManifest(manifest)
console.log(`production-assets: PASS (${manifest.assets.length} controlled records)`)
