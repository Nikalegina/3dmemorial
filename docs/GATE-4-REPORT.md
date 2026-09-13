# Gate 4 report — render and project interchange

## Scope
Commercially useful client-side output without introducing pricing or backend persistence.

## Implemented
- HD export mode increases render DPR and shadow-map resolution only for capture.
- PNG export.
- JPEG export.
- Downloadable one-page PDF specification containing the current 3D render and structured project configuration.
- PDF text is rasterized through browser Canvas so Cyrillic does not depend on a bundled proprietary font.
- Import of versioned `.kmproject.json` files through the canonical parser/migration path.
- Project import is fail-closed for corrupt or unsupported schemas.
- Imported JSON intentionally contains no portrait binary.

## Explicit exclusions
- No price or cost fields in the specification.
- No server-side rendering.
- No portrait persistence.
- No production CAD output.
- No claim that the PDF is a manufacturing drawing.

## Acceptance
- Node domain tests cover project specification content and ensure no accidental price claims.
- GitHub CI must prove dependency install, tests, TypeScript and Vite build.
- Browser visual acceptance remains required for HD image capture and generated PDF layout.
