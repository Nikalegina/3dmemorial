# Gate 5 — paired / family composition plan

## Goal
Add a structurally correct multi-stele model before introducing commercial lead integration.

## Phase 5A — schema + migration
1. Introduce schema v4 with `steles[]` and `layout`.
2. Migrate v3 single memorials into `steles[0]`.
3. Preserve v1/v2 migration coverage.
4. Add fail-closed validation and normalization for max supported stele count.

## Phase 5B — scene
1. Extract reusable `Stele` renderer.
2. Render single and paired compositions.
3. Compute managed X offsets from width + gap.
4. Keep base/plot/complex components at composition level.

## Phase 5C — editor
1. Layout selector: single / paired.
2. Explicit editor tabs: Person 1 / Person 2.
3. Independent shape, surface, portrait crop and inscription controls.
4. Paired presets: neutral, Slavic and Muslim.

## Phase 5D — output
1. Share URL includes v4 configuration.
2. JSON import/export migrates older projects.
3. PDF specification lists each stele/subject separately.
4. HD render captures whole composition.

## Risks
- regression in existing single-monument projects;
- UI density on mobile;
- total paired width exceeding plot/plinth;
- legacy share links;
- accidental coupling between subject-specific and composition-level controls.

## Non-goals
- 3+ stele family UI in this gate;
- arbitrary free transform;
- CAD/manufacturing output;
- pricing/BOM;
- backend portrait persistence.

## Acceptance gate
No merge into the foundation branch until all automated tests/builds are green and paired composition has visual browser acceptance.
