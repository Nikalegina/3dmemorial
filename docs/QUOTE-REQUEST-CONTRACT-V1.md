# Quote Request Contract v1

## Objective

Connect a configured 3D memorial project to a calculation request without coupling the browser directly to a specific CRM.

Target architecture:

```text
3D constructor
    |
    | POST /api/quote-requests
    | Idempotency-Key: <requestId>
    v
same-origin BFF / application API
    |
    | server-side credentials
    v
CRM / lead system
```

## Security decision

The browser MUST NOT call the CRM directly.

Reasons:

- CRM API secrets cannot be safely stored in Vite/browser configuration;
- browser network traffic is observable by the user;
- CRM-specific schemas would tightly couple the editor to one provider;
- server-side rate limiting, audit, retries and deduplication are required.

The browser transport therefore accepts only a **same-origin relative endpoint**.

## Request

```json
{
  "schemaVersion": 1,
  "requestId": "quote-request-0000000001",
  "createdAt": "2026-09-14T00:00:00.000Z",
  "source": {
    "sourceSku": "KM-001",
    "entrySource": "catalog"
  },
  "contact": {
    "name": "Иван Иванов",
    "phone": "+7 999 123-45-67",
    "messengerContact": null,
    "preferredChannel": "PHONE",
    "consentToContact": true,
    "note": "Нужна консультация"
  },
  "project": {
    "schemaVersion": 5
  }
}
```

The real `project` field contains the canonical full MemorialProject configuration.

Portrait image binaries/object URLs are intentionally excluded.

## Contact rules

Preferred channels in v1:

- `PHONE`
- `VK`
- `MAX`

At least one contact route is mandatory.

`consentToContact=true` is mandatory before submission.

This contract does not invent a privacy-policy version or legal-company metadata. Those must be supplied by the main site/legal layer when authoritative values exist.

## Idempotency

`requestId` is both:

- part of the request body;
- the value of the `Idempotency-Key` HTTP header.

The BFF must treat retries with the same request ID as the same logical lead.

Recommended BFF behavior:

1. begin request;
2. atomically reserve `requestId`;
3. validate payload;
4. persist canonical inbound request;
5. map to CRM;
6. submit/retry server-side;
7. store CRM reference;
8. return the same acknowledgement for future retries.

## Response

Success:

```json
{
  "accepted": true,
  "requestId": "quote-request-0000000001",
  "reference": "CRM-42"
}
```

`reference` may be null when the BFF accepts the lead asynchronously.

## BFF responsibilities

The BFF/main-site backend owns:

- authentication/authorization where applicable;
- rate limiting / abuse control;
- request-size limits;
- consent evidence and legal metadata;
- CRM credentials;
- CRM-specific field mapping;
- durable idempotency;
- retry/backoff;
- operational audit;
- PII retention/deletion policy;
- observability with PII-safe logs.

## Data minimization

The constructor sends only:

- contact fields explicitly entered by the user;
- source SKU/startup source;
- canonical project configuration.

Do not add browser fingerprinting, full user-agent telemetry, hidden location data or portrait binaries to this contract without a separate decision.

## Next integration step

Once the authoritative main-site/BFF endpoint and CRM mapping are known:

1. configure the relative endpoint;
2. add the visible quote-request UI;
3. submit through `submitQuoteRequest`;
4. add server integration tests;
5. add end-to-end acceptance from constructor to CRM reference.

Until then, no fake CRM endpoint or credentials should be committed.
