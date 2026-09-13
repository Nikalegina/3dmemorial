# Gate 4A — owned profile and surface breadth

## Goal
Move the editor away from demo-level choice without introducing third-party model licensing risk.

## Implemented
- Owned procedural stele profiles expanded from 6 to 15.
- Added rounded rectangle, dome, left/right bevel, ogee, shield, book, teardrop and second Muslim dome profile.
- Shape families remain neutral / Slavic / Muslim for future filtering and presets.
- Stone surfaces expanded to polished/matte gabbro plus grey, red, brown and green granite.
- Glass surfaces expanded to clear, frosted, smoke and bronze variants.
- Existing schema version remains valid because IDs are additive and current projects remain compatible.
- Asset Registry now records 15 internally-owned procedural stele profiles.

## Boundary
These are visualization materials, not claims about currently stocked physical stone. Commercial availability must later come from managed catalog data.

## Acceptance
- shape IDs unique and exactly 15;
- stone/glass material families tested;
- normalization preserves only construction-compatible surface IDs;
- asset registry validation and full GitHub CI required.
