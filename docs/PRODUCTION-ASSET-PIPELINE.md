# Production Asset Pipeline v1

## Objective

Provide a fail-closed control plane for production GLB models, WebP textures and WOFF2 fonts without committing commercial source binaries or credentials to Git.

## Repository boundary

This repository is public. Therefore:

- raw/source commercial models MUST NOT be committed;
- purchased font files MUST NOT be committed unless their redistribution license explicitly permits it;
- object-storage credentials MUST NOT be committed;
- private source files belong in controlled source storage;
- browser runtime derivatives are assumed extractable once delivered to a client, even when a CDN or signed URL is used.

Signed URLs are access control, not DRM.

## Flow

1. **Source intake outside Git**
   - obtain owned/licensed source;
   - retain invoice/license/provenance evidence;
   - calculate source SHA-256.

2. **Offline optimization**
   - remove unused geometry/materials;
   - normalize scale/origin;
   - generate mobile-appropriate geometry/texture derivative;
   - convert textures to WebP where appropriate;
   - use WOFF2 only when web-embedding rights are proven.

3. **Runtime checksum**
   - calculate SHA-256 of the exact optimized runtime derivative.

4. **Manifest record**
   - add a record to `assets/production-manifest.v1.json`;
   - keep status `DRAFT` until rights and runtime evidence are complete.

5. **Approval**
   - `APPROVED` requires:
     - provenance reference;
     - source checksum;
     - runtime checksum;
     - immutable object key containing runtime checksum prefix;
     - exact MIME type;
     - byte-size budget compliance;
     - explicit web redistribution approval;
     - attribution text where required.

6. **Runtime publication**
   - upload derivative to object storage/CDN using the exact manifest object key;
   - never overwrite an immutable object key with different bytes.

7. **Public index**
   - `public/assets/index.v1.json` is generated from APPROVED records only;
   - private provenance and rights metadata are not exposed in the runtime index.

## Performance budgets

Current fail-closed mobile budgets:

- GLB model: 12 MiB;
- WebP texture: 4 MiB;
- WOFF2 font: 768 KB.

Changing these budgets is a product/performance decision and must be explicit.

## License policy

Allowed control-plane license classes:

- OWNED;
- CC0;
- CC-BY;
- COMMERCIAL.

An APPROVED runtime asset must additionally have `webRedistributionApproved=true`.

CC-BY requires explicit attribution metadata.

## Runtime limitation

Any model, texture or font delivered to a web browser can be copied by a sufficiently motivated user. The pipeline protects provenance, integrity and deployment control; it does not make client-side assets secret.

## Commands

```bash
npm run validate:production-assets
npm run check:asset-index
```

Both commands run as part of `npm test`.
