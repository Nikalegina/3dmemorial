# Gate 2 report — editor, portrait and render slice

## Implemented
- Project schema v2 with explicit migration from v1.
- Surface material selection separated from monument construction mode.
- Controlled granite/glass material definitions consumed by the scene.
- Procedural studio environment for stronger glass and polished-granite reflections without third-party HDRI assets.
- Portrait crop controls: zoom and X/Y offsets.
- Client-side portrait validation: JPG/PNG/WebP, maximum 12 MB.
- Editable name, dates and epitaph rendered directly on the monument preview.
- Camera presets: perspective, front, top and detail.
- Three ready-to-edit memorial presets.
- PNG export of the current 3D render.

## Privacy boundary
Uploaded portraits remain browser-local in this gate. No portrait upload endpoint, public object URL, database persistence or analytics payload has been introduced.

## Acceptance
- dependency-free domain tests must pass;
- asset registry validation must pass;
- GitHub CI must prove TypeScript/build/test compatibility;
- visual acceptance is still required for glass, portrait crop, text layout and all camera presets.

## CI bootstrap remediation
The first PR run failed in `actions/setup-node` because `cache: npm` requires a dependency lockfile. Gate 2 removes the cache option until a committed lockfile is available. This is a CI bootstrap correction, not a product-code relaxation.
