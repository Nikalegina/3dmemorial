# Gate 8 — quote handoff

## Goal
Close the commercial UX loop from configured memorial to the main website's quote form without adding a fake backend, invented prices or unsafe portrait transport.

## Scope
- conversion CTA: «Оставить заявку для расчёта»;
- typed REQUEST_QUOTE host envelope;
- catalog source SKU / preset attribution;
- normalized current project configuration;
- interactive project URL;
- same-window CustomEvent for same-page integration;
- parent-window postMessage for iframe integration;
- exact parent origin derived from document.referrer;
- standalone fallback copies the project URL;
- portrait binaries and contact data excluded.

## Non-goals
- direct CRM write;
- customer PII collection inside the 3D editor;
- persistent portrait upload;
- price calculation;
- messenger links before real VK/MAX destinations are supplied.

## Acceptance
- quote envelope tests PASS;
- invalid/non-HTTP referrer rejected;
- browser build/smoke PASS;
- customer UI shows the quote CTA;
- CTA never reports a successful CRM submission in standalone mode.
