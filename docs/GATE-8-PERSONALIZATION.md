# Gate 8 — personalization system

## Goal
Add customer-controlled portrait and inscription styling without external artwork dependencies and without breaking existing saved/shared projects.

## Schema
Project schema advances from v4 to v5.

Per-stele personalization:
- portrait frame: oval / rounded rectangle / rectangle;
- inscription font: classic / Roman / modern;
- memorial symbol: none / Orthodox cross / cross / crescent.

## Migration
- v1/v2/v3 migrations remain supported;
- v4 -> v5 adds neutral defaults:
  - portrait frame = oval;
  - inscription font = classic;
  - symbol = none;
- local storage advances to v5 while reading v4/v3/v2/v1 keys;
- share links and JSON import continue through the canonical parser.

## Rendering
- portrait image and neutral placeholder are clipped to the selected frame;
- selected frame has a material-aware outline;
- inscription canvas uses the chosen Cyrillic-capable font stack;
- symbols are generated procedurally at runtime with Canvas2D;
- no external SVG, bitmap or icon library is introduced.

## Safety / product boundary
- religious symbols are never added automatically by category;
- default symbol remains none;
- malformed personalization IDs normalize to neutral defaults;
- uploaded portrait bytes remain browser-local;
- symbols are visualization assets, not production engraving files.

## Acceptance
- schema migration tests v1-v5;
- independent personalization for paired steles;
- specification/PDF includes frame, font and symbol labels;
- invalid IDs normalize safely;
- existing geometry/asset/share/catalog tests remain green;
- TypeScript and Vite production build green;
- Chromium/WebGL smoke green.
