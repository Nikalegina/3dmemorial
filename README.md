# КРЫМ МОНУМЕНТ — Memorial 3D Studio

Independent web application for configuring and presenting complete memorial complexes.

## Gate 0 scope

The first vertical slice proves the core technical contract:
- parametric monument geometry;
- granite / glass / hybrid rendering;
- user portrait preview in color or B&W;
- configurable memorial-site components;
- versioned project configuration;
- local save and project JSON export;
- desktop/mobile responsive shell.

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

A dependency-free domain smoke test can also run with the repository Node runtime:

```bash
npm run test:domain
```

## Architecture boundaries

- Do not store production portraits in a public bucket.
- Do not commit large production GLB/KTX2/HDRI libraries to Git.
- Do not publish an asset without license provenance.
- Do not persist a raw Three.js scene; persist versioned configuration.
- Do not couple pricing to the editor until a canonical price/BOM authority exists.

See `docs/ROADMAP.md` and `docs/ADR-0001-foundation.md`.
