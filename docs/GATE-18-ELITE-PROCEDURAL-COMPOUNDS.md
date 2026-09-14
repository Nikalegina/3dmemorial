# Gate 18 — Elite procedural compound monuments

Source authority: ERMIS catalog pages 25 and 27.

## Runtime scope

This gate makes the four previously classified procedural elite products directly editable and renderable:

| Model | Source page | Source size | Renderer |
| --- | ---: | --- | --- |
| №4 | 25 | 1630 × 1180 × 200 mm | open arch compound |
| №22 | 27 | 2000 × 1200 × 200 mm | open arch compound |
| №24 | 27 | 2500 × 1200 × 300 mm / 2500 × 1200 × 250 mm | columns + header + finial + Orthodox cross |
| №25 | 27 | 1200 × 1500 × 250 mm | framed central panel + columns + header |

The source registry therefore moves from 106/226 to 110 runtime source models / 231 confirmed size variants.

## Modeling boundary

These four products are not represented as one flat silhouette. Their visible runtime geometry is assembled from independent 3D parts:

- bases;
- posts/columns;
- capitals and column bases;
- arch rings or headers;
- model-specific architectural elements;
- central panel only where the source product actually has one.

The outer point lists stored in `sourceCatalogProfiles.elite.ts` are lookup/fallback envelopes only. They are not the displayed product geometry and not manufacturing CAD.

## Artwork behavior

Models №4, №22 and №24 are open architectural portals in the source catalog. The source project factory disables portrait and inscription on those products instead of drawing artwork on empty space.

Model №25 contains a central stone panel and retains portrait/inscription rendering.

## Source materials

Material restrictions remain source-backed per variant:

- №4: K06, K05, K10, K11;
- №22: K13, K06;
- №24 variant 1: K05, K06, K10, K11;
- №24 variant 2: K13, K14;
- №25: K14.

## Acceptance

Each model has a deep-link browser acceptance path and renderer evidence marker:

`data-elite-renderer="procedural-compound"`

This gate does not make the remaining 16 sculptural/relief elite models renderable. They remain fail-closed pending dedicated owned/licensed GLB assets.
