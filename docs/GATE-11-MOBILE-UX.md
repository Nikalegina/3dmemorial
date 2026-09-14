# Gate 11 — mobile UX and responsive editor

## Goal
Make the Memorial 3D Studio usable as a customer-facing configurator on a phone without changing project schema or product data.

## Mobile behavior
At widths <= 900px:
- the 3D viewport becomes a sticky top scene while the editor scrolls beneath it;
- scene height uses safe viewport units and is bounded to avoid consuming the whole screen;
- a fixed safe-area quote bar keeps the commercial CTA reachable from any editor depth;
- ready-made presets become a horizontal scroll/snap rail;
- camera controls use a compact four-button row;
- multi-stele subject tabs become horizontally scrollable;
- panel padding and section rhythm are reduced;
- important buttons retain touch-friendly minimum heights;
- bottom content reserves space for the fixed quote bar.

At very narrow widths:
- fields can collapse to one column;
- camera and layout controls reduce density;
- the quote bar simplifies its secondary copy.

## Accessibility / touch
- buttons use touch-action manipulation;
- the WebGL canvas owns touch gestures explicitly;
- interactive controls keep minimum touch heights around 40–44 px;
- the quick quote control is labelled and stays above the browser safe area.

## Desktop boundary
Desktop layout remains the existing two-column studio with a sticky full-height viewport and 380 px editor panel.

## Acceptance
- existing Gate 10 tests PASS unchanged;
- production build PASS;
- desktop Chromium scenarios remain green;
- a real Chromium 390x844 modern-glass scenario reaches WebGL-ready state;
- mobile DOM contains the quick quote control;
- `mobile-390x844.png` is retained for visual review;
- no horizontal page overflow or obvious CTA/scene overlap in visual evidence.

## Non-goals
- native mobile application;
- device-specific iOS browser automation;
- gesture redesign beyond current OrbitControls;
- project schema changes.
