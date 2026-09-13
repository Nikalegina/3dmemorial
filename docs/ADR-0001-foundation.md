# ADR-0001 — Web 3D foundation

Status: Accepted for Gate 0.

## Decision
Use React + TypeScript + React Three Fiber + Three.js with a modular, versioned configuration model. Runtime 3D assets are treated as controlled content, not source-code fixtures.

## Compatibility baseline
React is intentionally pinned to 19.2.7 for Gate 0 because current stable R3F 9.x peer constraints exclude React 19.3. Upgrade only after upstream compatibility is explicitly proven in CI and browser acceptance.

## Rendering
Gate 0 uses the proven WebGL path exposed through R3F. WebGPU is not made a release dependency yet; it can be evaluated after the editor and asset contracts stabilize.

## Data model
Persist project configuration, never a serialized live Three.js scene. Schema migrations will be explicit.

## Asset policy
No third-party model is accepted without source, license, checksum and redistribution review. Original client uploads are not production public assets.
