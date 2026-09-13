# Gate 1 report — asset and configuration control plane

## Implemented
- First-party procedural shape catalog expanded to 6 profiles.
- Asset Registry v1 with fail-closed license/status validation.
- Portrait preview modes: color, B&W, engraving simulation.
- Plot dimensions exposed in the editor.
- Compatibility diagnostics introduced for physical layout constraints.
- UI now consumes controlled shape/mode catalogs rather than hard-coded options.

## Asset policy
Runtime assets are not accepted into the product unless they have an explicit registry record and one of the currently approved licenses: OWNED, CC0, CC-BY.

## Verification
Run:

```bash
npm run test:domain
npm run validate:assets
```

Full dependency-backed build remains an external CI acceptance gate until package installation is available.
