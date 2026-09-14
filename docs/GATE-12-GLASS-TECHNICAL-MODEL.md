# Gate 12 — glass memorial technical product model

## Goal
Turn the glass-monument direction from a visual material option into a technically managed product configuration.

## Schema
Project schema evolves from v5 to v6.

Each stele now carries a persisted glass technical configuration:
- glass clarity: clear M1 / low-iron;
- total triplex thickness: 12 or 16 mm;
- mounting method: groove / manet / floor holder / clamp profile;
- UV print sides: one or two;
- artwork edge margin, minimum 10 mm.

The configuration remains stored even when the stele is temporarily switched to stone, allowing reversible editing.

## Critical geometry correction
Before this gate, a stele switched from granite to glass could retain a stone-like depth around 90 mm.

Now, when construction is glass:
- 12 mm technical configuration renders as 0.012 m physical depth;
- 16 mm renders as 0.016 m physical depth;
- normalization makes the technical glass configuration authoritative for scene thickness.

Switching back from glass to stone restores a sane 90 mm editing default rather than leaving a 12 mm stone slab.

## Managed standard sizes
The UI exposes published reference sizes:
400×800, 400×900, 450×900, 500×1000, 500×1100, 500×1200 and 600×1200 mm.

Custom dimensions remain possible.

## Glass UI
When a stele uses glass, the editor shows a dedicated technical section for:
- standard/custom size;
- triplex thickness;
- glass clarity;
- mounting method;
- UV print sides;
- artwork edge margin.

Generic stone thickness editing is hidden for glass.

## Rendering fidelity
- glass material optical thickness now follows the configured physical 12/16 mm panel thickness;
- portrait/inscription planes for glass are positioned just inside the front glass face instead of floating in front of the panel;
- stone rendering retains its existing front-face offset.

## Output
Share URL, JSON, PDF specification and quote handoff all carry schema v6 glass technical data.
PDF specifications include the glass construction fields but no supplier prices.

## Migration
- v1..v4 migrations receive the default glass technical configuration;
- v5 projects migrate to v6 and existing glass steles are corrected to a physical 12 mm depth by default;
- v6 local storage uses a new key with v5..v1 fallback.

## Acceptance
- source-backed glass catalog tests PASS;
- schema v1..v5 migrations PASS;
- glass depth authority test PASS;
- share round-trip preserves glass technical data;
- PDF exposes construction/thickness/mount/print/margin/standard size;
- production build PASS;
- modern-glass Chromium scenario displays technical controls and reaches WebGL-ready state;
- modern-glass screenshot is reviewed for physically thin glass geometry.

## Boundaries
- no supplier prices;
- no automatic manufacturing drawing;
- no drilling-hole coordinates;
- no foundation engineering;
- no guarantee/lifetime claims imported from the reference source.
