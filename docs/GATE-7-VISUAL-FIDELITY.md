# Gate 7 — visual fidelity

## Goal
Raise the WebGL result from functional prototype quality toward a customer-facing memorial visualizer without introducing third-party 3D assets.

## Changes
- Deterministic first-party procedural stone texture generation for all stone surfaces.
- Polished stone receives stronger environment response while matte surfaces retain higher roughness.
- Glass material uses full transmission, clearcoat, attenuation and stronger environment reflections.
- Stele edge highlighting improves silhouette readability, especially for transparent glass.
- Empty portrait areas now render a neutral non-person placeholder rather than a visually blank slab.
- Portrait preview occupies a slightly larger, clearer zone.
- Memorial inscriptions use larger Cyrillic typography and higher contrast.
- Default vase proportions reduced and geometry changed from a plain cylinder to a lathed vase profile.
- Flower-bed width scales with total composition width.
- Paving styles gain procedural joint lines instead of a completely flat slab.
- Lighting gains warm key, cool fill/rim and hemisphere contribution for more legible glass and polished granite.

## Asset boundary
All new visual detail is generated procedurally at runtime and is owned application code. No external bitmap, HDRI or GLB asset is added.

## Acceptance
- Existing domain/schema/asset tests remain green.
- Production TypeScript/Vite build remains green.
- Chromium browser smoke remains green.
- New single and paired-glass screenshots must be visually reviewed against Gate 6.
- Glass must preserve visible silhouette/edges without appearing opaque.
- Stone texture must not introduce NaN/black-texture failures.
- Portrait placeholders must clearly read as placeholders, not actual completed memorial portraits.
