# Gate 9 — family memorial layouts

## Goal
Expose the already-supported schema v4 `family` composition as a first-class editor workflow without introducing a new schema migration.

## Product scope
- explicit Single / Paired / Family layout selector;
- family mode automatically guarantees at least three independent steles;
- editor can add a fourth stele;
- editor can remove the selected extra stele while preserving a minimum family composition of three;
- all steles keep independent shape, material, portrait and inscription state;
- switching Family -> Single/Paired -> Family hides, but does not delete, the additional family subjects;
- one ready-to-edit `family-classic` preset;
- family preset uses a wider default plot and balanced three-stele proportions;
- existing camera, sharing, JSON import/export, PDF specification and quote handoff continue to consume the same schema v4 configuration.

## Limits
The schema remains capable of up to six steles, but the current customer-facing family editor is intentionally capped at four. This avoids an unmanageable side panel and excessive scene width before a more advanced spatial layout editor exists.

## Automated acceptance
- family layout guarantees three visible steles;
- stele IDs remain unique;
- add operation reaches, but does not exceed, the UI limit;
- remove operation cannot reduce a family composition below three;
- Family -> Single -> Family preserves hidden stele data;
- `family-classic` preset resolves through the existing catalog deep-link contract;
- Chromium smoke renders `family-classic` and asserts `data-visible-steles="3"`;
- family browser screenshot is stored as CI evidence.

## Non-goals
- free-positioning family steles;
- multi-row memorial layouts;
- more than four user-editable family steles in this gate;
- pricing/BOM;
- production CAD.
