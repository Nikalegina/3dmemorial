# Gate 19 — Source Catalog Components

Status: IMPLEMENTATION / DRAFT PR / NO MERGE

Base accepted Gate 18:

`a98665dba5f5103d856d16509b1b7d8d0ececa11`

Source authority:

- ERMIS memorial catalog, page 27 — TSK50 / TSR50 tables and benches.
- ERMIS memorial catalog, page 28 — grave slabs, paving formats, vases and accessories.
- ERMIS memorial catalog, pages 29–30 — granite fences F-01, F-02, F-03 and F-04.

## Product boundary

Gate 19 extends the existing managed environment component model. It does **not** create a second project schema and does not change `schemaVersion = 6`.

Existing managed slots are reused:

- `bench` / `table` for TSK50 / TSR50;
- `flowerBed` for source-backed grave slabs;
- `paving` for source-backed tile formats;
- `vase` for vases and decorative accessories;
- `fence` for F-01…F-04.

Deep links use:

`?component=<source-component-id>`

The source component ID and source SKU (where the source actually provides one) are preserved in startup attribution and quote handoff.

## Source-data rules

1. Source dimensions are copied without silent normalization.
2. A SKU is stored only when the source page provides a SKU.
3. Missing slab/tile thickness is **not invented as source data**.
4. `KW`, `KT`, and `KB` are retained as unresolved source material codes; no invented stone-name mapping is introduced.
5. F-04 source rows are both retained under the source name `Столбик`; the renderer may use the long element horizontally, but the authority record is not renamed.

## Runtime rendering

Source-backed components use procedural Three.js geometry.

- TSK50 / TSR50 use exact top/seat/support envelopes from page 27.
- Source vases and balusters use lathed procedural bodies constrained by the source height/width envelope.
- F-01 / F-02 use solid wing modules with distinct bounded top profiles.
- F-03 uses exact parapet/post/beam/baluster module envelopes.
- F-04 uses exact post and long-element envelopes.
- Grave slabs and paving use exact catalog length/width.

Where the source omits thickness, the renderer uses a small **visual-only** thickness. That render thickness is not serialized, not shown as a catalog dimension, and not represented as production authority.

## Acceptance

Required before acceptance:

- domain tests PASS;
- TypeScript test check PASS;
- production build PASS;
- existing browser smoke PASS;
- source-component deep-link smoke PASS;
- screenshots visually reviewed against source pages 27–30;
- PR remains OPEN / DRAFT / UNMERGED until explicit acceptance.
