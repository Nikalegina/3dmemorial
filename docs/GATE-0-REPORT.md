# Gate 0 report — technical vertical slice

## Result
INTEGRATED IN GITHUB / DRAFT PR #1 / UNMERGED.

## Delivered
- React/TypeScript/Vite application shell.
- Three.js through React Three Fiber.
- Parametric arch/rectangle stele geometry.
- Granite, glass, and granite+glass modes.
- Local portrait upload with color and B&W preview processing.
- Plot, plinth, flower bed, paving, fence, bench, table, and vase scene elements.
- Versioned project schema (`schemaVersion = 1`).
- Local project persistence and JSON project export.
- Asset license manifest policy.
- GitHub Actions CI definition.
- Responsive editor shell.

## Verification performed in the current environment
- Domain smoke tests: PASS (4/4).
- Repository file/tree review: PASS.
- Local npm package installation / production build was blocked by environment DNS (`EAI_AGAIN registry.npmjs.org`).
- First GitHub CI run reached `setup-node` but failed before install because cache configuration required a lockfile. Gate 2 removes that bootstrap cache dependency so the next run can reach install/test/build.

## Acceptance gate before merge to main
The first GitHub PR must prove:
1. Dependency install PASS (`npm ci` once lockfile exists; bootstrap fallback is `npm install`).
2. `npm run test` PASS.
3. `npm run build` PASS.
4. Desktop browser visual acceptance.
5. Android browser smoke acceptance.
6. Physical iPhone Safari smoke acceptance.
7. Portrait upload works without persistent public upload.
8. Glass mode has no obvious z-fighting or broken transparency.

## Explicit non-goals of Gate 0
- No production asset library.
- No server persistence or share URL.
- No pricing/BOM.
- No CRM integration.
- No server-side render.
- No AR.
