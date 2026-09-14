# 3dmemorial

Memorial 3D Studio.

Independent web application for configuring and presenting complete memorial complexes.

## Current implemented scope

- parametric monument geometry;
- granite / glass / hybrid rendering;
- portrait preview in color, B&W and engraving simulation;
- editable memorial inscriptions;
- managed paving, border, fence, bench, table, vase, flower-bed and plinth variants;
- versioned project schema with migrations;
- local save, JSON export, PNG render export and privacy-safe share links;
- controlled asset registry and license validation;
- fail-closed production asset manifest/index pipeline for models, textures and fonts.

## Local development

```bash
npm install
npm run dev
```

Verification:

```bash
npm run test
npm run build
```

Dependency-free domain verification:

```bash
npm run test:domain
npm run validate:assets
npm run validate:production-assets
npm run check:asset-index
```

## Architecture boundaries

- Do not store production portraits in a public bucket.
- Do not commit large production GLB/KTX2/HDRI libraries to Git.
- Do not publish an asset without license provenance.
- Do not persist a raw Three.js scene; persist versioned configuration.
- Do not couple pricing to the editor until a canonical price/BOM authority exists.

See `docs/ROADMAP.md`, `docs/PRODUCTION-ASSET-PIPELINE.md` and the gate reports under `docs/`.
