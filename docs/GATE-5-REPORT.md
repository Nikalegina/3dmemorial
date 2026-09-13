# Gate 5 report — multi-stele composition

## Result
AUTOMATION_GREEN / VISUAL_ACCEPTANCE_PENDING / DRAFT / UNMERGED.

## Canonical branch
`memorial-3d-multi-stele`

## Accepted automated head
`a47493b6257b8cb757795ed08b6f6677c3f2a558`

## Delivered
- Project schema v4.
- Explicit v1/v2/v3 -> v4 migrations.
- `steles[]` composition model instead of one-off secondary fields.
- Single, paired and reserved family layout types.
- Managed edge-to-edge gap and centered stele placement.
- Reversible single <-> paired editing without deleting the secondary stele.
- Independent shape/material/surface per stele.
- Independent portrait crop/mode and browser-local portrait URL per stele.
- Independent name/dates/epitaph per stele.
- Shared composition base and shared memorial-complex environment.
- Camera framing responds to total composition width and max stele height.
- Paired classic, paired glass and paired Muslim presets.
- Share URL / JSON import-export support schema v4.
- PDF specification lists each visible stele independently.
- Composition-width diagnostics.
- Vase positioning uses full composition width.

## CI evidence
GitHub Actions run #14: SUCCESS.

Passed:
- dependency install;
- native Node domain tests;
- schema migration tests;
- paired layout geometry tests;
- share URL round-trip;
- PDF specification tests;
- procedural geometry validation;
- asset registry validation;
- test TypeScript check;
- production TypeScript build;
- Vite production build.

## Required before merge
- desktop visual acceptance;
- mobile responsive acceptance;
- physical iPhone Safari smoke acceptance;
- paired granite visual acceptance;
- paired glass visual acceptance with two independent portraits;
- share/import/export manual smoke;
- PDF visual review.

## Boundary
No pricing/BOM, persistent portrait backend, production CAD, or manufacturing claims are introduced.
