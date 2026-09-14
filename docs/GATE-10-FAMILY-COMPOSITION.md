# Gate 10 — family composition editor

## Goal
Promote the reserved family layout into a supported customer-facing editor flow without another schema migration.

## Delivered
- family composition selector alongside single and paired;
- family layout starts with 3 independent steles;
- editor supports 3–4 steles;
- explicit add/remove controls;
- removal is blocked below 3 family steles;
- each stele keeps independent shape, material, surface, portrait, inscription and personalization;
- managed edge-to-edge gap applies across the full composition;
- family camera framing reuses total composition width;
- family switch raises the editable plot width to a practical minimum of 2.8 m while remaining user-editable.

## Presets
- family-classic;
- family-glass;
- family-muslim.

No religious symbol is auto-added by the Muslim preset; symbol remains `none`.

## Compatibility
Schema remains v5. Existing single/paired projects and links need no migration.

## Tests
- family starts with 3 steles;
- add is bounded to 4 in the family editor;
- remove never drops below 3;
- deleted stele is actually removed when above the minimum;
- multi-stele positions remain centered;
- every adjacent pair preserves the configured physical gap;
- catalog deep-link resolves family-glass;
- family presets remain current-schema projects.

## Browser acceptance
CI now renders and captures:
1. single default;
2. paired glass;
3. family glass.

The family scenario must prove:
- catalog startup;
- expected source SKU;
- WebGL renderer readiness;
- exactly 3 visible steles;
- RFQ form remains present and fail-closed without contact.

## Boundary
- UI maximum is 4 family steles for usability;
- canonical schema still permits up to 6 for future migration/import scenarios;
- no free-drag arbitrary placement;
- no pricing/BOM changes.
