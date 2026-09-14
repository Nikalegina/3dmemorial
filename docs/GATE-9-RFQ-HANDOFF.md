# Gate 9 — RFQ handoff

## Goal
Close the commercial editor flow from configured memorial to a structured quote-request handoff without inventing pricing, CRM endpoints, legal entities or public portrait storage.

## User flow
1. Configure memorial.
2. Open "Получить расчёт".
3. Select preferred contact channel.
4. Enter phone / nickname / link and optional name/comment.
5. Prepare a local quote-request package or copy a readable summary.

## RFQ contract
Schema: `RFQ_SCHEMA_VERSION = 1`.

Request contains:
- project schema/configuration snapshot;
- interactive share URL;
- catalog attribution: `sourceSku`, preset, startup source;
- client-entered contact details;
- optional comment;
- count of locally loaded portraits.

Request explicitly states:
- portrait files are not included;
- render is not included;
- pricing is not included;
- specialist calculation is required.

## Privacy boundary
- contact form state is not written to localStorage;
- contact details are not placed in the public/shareable project URL;
- portrait object URLs or image bytes are not included;
- no network submission is implemented in this gate;
- no analytics payload containing contact data is introduced.

## Commercial boundary
- no price or estimate is generated in the browser;
- no "request sent" claim is shown;
- no CRM/provider is assumed;
- no legal consent text is invented before the business privacy/legal layer is approved.

## Integration next step
A later gate may connect the validated RFQ envelope to an approved first-party endpoint/CRM. That gate must define authentication, abuse/rate controls, retention, privacy/legal text, upload handling and operational ownership.

## Acceptance
- contact required; name optional;
- attribution preserved;
- project schema v5 preserved;
- no portrait binaries/data URLs/blob URLs in RFQ;
- pricing flags remain false;
- human-readable summary generated;
- full existing tests/build/WebGL browser smoke remain green;
- browser smoke proves RFQ CTA exists and starts invalid until contact is supplied.
