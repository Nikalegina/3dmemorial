# ADR-0002 — Multi-stele composition model

Status: PROPOSED / Gate 5 planning baseline.

## Problem
The current project schema has one top-level monument, portrait and inscription. That is sufficient for an individual memorial but does not scale cleanly to paired and family compositions.

Adding one-off fields such as `secondaryMonument`, `secondaryPortrait` and `secondaryInscription` would solve the immediate paired case but create structural debt and make 3+ subject family memorials another rewrite.

## Decision
Evolve the project model to a versioned array of stele/subject compositions.

Target structure:

```ts
interface MemorialStele {
  id: string
  offsetX: number
  monument: {
    shape
    material
    surfaceId
    widthM
    heightM
    depthM
  }
  portrait: {
    enabled
    mode
    offsetX
    offsetY
    zoom
  }
  inscription: {
    enabled
    name
    dates
    epitaph
  }
}

interface MemorialProjectV4 {
  schemaVersion: 4
  layout: {
    type: 'single' | 'paired' | 'family'
    gapM: number
  }
  steles: MemorialStele[]
  // existing managed plot/complex fields
}
```

## Migration
V3 -> V4:
- current monument + portrait + inscription becomes `steles[0]`;
- default layout becomes `single`;
- no user data is discarded;
- existing shared links and imported JSON remain readable through explicit migration.

V1/V2 continue to migrate through the same canonical parser to the current schema.

## Constraints
- MVP editor supports 1 or 2 steles.
- Schema may represent more steles later, but UI must not expose unsupported family counts.
- Every stele keeps independent shape, material, portrait and inscription.
- Pair spacing is managed by layout rules, not arbitrary free-drag.
- Shared base/plinth/flower-bed remains a composition-level concern.
- No manufacturing/BOM claim is derived from visual layout.

## Rollback
The gate is developed on a stacked feature branch based on the green foundation head. PR #2 is not modified by this work. If Gate 5 fails acceptance, the stacked branch can be discarded without reverting the foundation.

## Acceptance
- V3 -> V4 migration round-trips without data loss.
- Single layouts render identically within reasonable visual tolerance.
- Paired layout renders two independent stele geometries.
- Portrait and inscription state remain independent for each stele.
- compatibility diagnostics reject impossible combined width for the plot/base.
- share/import/export support V4.
- Node tests, geometry tests, asset validation, TypeScript and production build are green.
