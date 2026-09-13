# Gate 3B report — managed memorial-complex components

## Decision
Move site-improvement elements from boolean visibility flags toward controlled product entities with explicit variants and placement rules.

## Implemented
- Project schema v3.
- Explicit migration paths from schema v1 and v2 to v3.
- Managed catalogs for paving, border, fence, bench, table and vase families.
- Border added as a first-class memorial-complex component.
- Fence style and gate-side selection.
- Bench and table style plus left/right placement.
- Vase style and left/right/pair placement.
- Flower-bed open/closed variants and plinth material selection.
- Scene rendering now consumes managed component attributes rather than only enabled/disabled flags.
- Compatibility diagnostics detect conflicting furniture placement and tight vase pairs.
- Asset Registry includes the internal procedural component families.

## Product boundary
This gate intentionally uses deterministic controlled positions rather than unrestricted drag-and-drop. The next interaction layer may add snapping/anchors, but it must preserve physical constraints and configuration validity.

## Migration safety
Previously generated schema v1/v2 local projects and share links are accepted and migrated to schema v3 with conservative default variants. Unknown schema versions remain fail-closed.
