# Gate 10 — portrait layouts and glass photo printing

## Goal
Make portrait presentation a saved, shareable part of the memorial project, with a dedicated high-impact color-photo mode for glass monuments.

## Schema
Project schema evolves from v4 to v5.

New portrait fields:
- `frame`: `oval | rectangle | full`;
- `size`: managed portrait-zone scale, clamped to 0.60..1.35.

Existing fields remain:
- `mode`: color / black-and-white / engraving preview;
- `zoom`: crop zoom inside the portrait source image;
- `offsetX`, `offsetY`: crop position.

This keeps physical portrait-zone sizing separate from source-photo cropping.

## Migration
- v1/v2/v3 projects migrate to v5 with `rectangle` and size 1, preserving the historical rectangular visual area.
- v4 multi-stele projects migrate each stele independently to `rectangle` and size 1.
- v5 default projects use `oval` at size 1.
- old shared URLs and imported JSON continue to parse through the canonical project parser.
- local storage writes to the v5 key and reads v4/v3/v2/v1 as legacy fallback.

## UI
Portrait controls:
- mode;
- presentation: Oval / Rectangle / Large photo print;
- portrait-zone size;
- source-photo zoom;
- horizontal crop;
- vertical crop.

For glass + color mode, the editor explicitly states that this is a preliminary visualization and final image preparation is performed by a specialist.

## Rendering
- Oval and Rectangle apply an alpha mask to both uploaded photos and placeholders.
- Large photo print uses a larger unmasked image region.
- physical portrait-zone size is independent from photo crop zoom.
- `modern-glass` preset defaults to color + Large photo print at 112%.
- paired glass keeps independent rectangular portraits for each subject.

## Output
- share URL / JSON persist frame + size;
- PDF specification includes portrait presentation and size;
- quote handoff carries schema v5 configuration but still excludes portrait bytes.

## Acceptance
- v1..v4 migration tests PASS;
- schema v5 round-trip PASS;
- portrait frame catalog test PASS;
- share round-trip preserves `full` and custom size;
- PDF specification exposes frame + size;
- host bridge reports project schema v5;
- TypeScript/Vite build PASS;
- Chromium `modern-glass` deep-link reaches WebGL-ready state and exposes «Крупная фотопечать»;
- screenshot `modern-glass.png` is retained for visual review.

## Privacy / production boundary
- uploaded portrait binaries remain browser-local;
- no CRM image upload is introduced;
- no manufacturing print file is generated;
- no claim of final color accuracy is made.
