# Memorial 3D Studio — host integration contract

## Purpose
The 3D editor does not own customer contact collection or CRM writes. It hands the configured project to the main website, which can open its existing quote/contact flow.

This keeps:
- project configuration inside the 3D domain;
- personal contact data inside the main site's controlled form;
- uploaded portrait binaries browser-local until a separate secure upload contract is implemented.

## Quote request event

Channel:

`MEMORIAL3D`

Type:

`REQUEST_QUOTE`

Version:

`1`

Example envelope:

```ts
{
  channel: 'MEMORIAL3D',
  type: 'REQUEST_QUOTE',
  version: 1,
  projectSchemaVersion: 4,
  project: { /* normalized MemorialProject */ },
  projectUrl: 'https://.../constructor?project=...',
  source: {
    startupSource: 'catalog',
    presetId: 'paired-glass',
    sourceSku: 'KM-PAIR-001'
  },
  privacy: {
    includesPortraitBinary: false,
    includesContactData: false
  }
}
```

## Delivery modes

### Embedded iframe
The editor posts the envelope to `window.parent`.

Security rule: the target origin is derived from `document.referrer`. The editor does not use `postMessage(..., '*')`.

The host must still validate:
- `event.origin`;
- `event.data.channel === 'MEMORIAL3D'`;
- `event.data.type === 'REQUEST_QUOTE'`;
- supported event and project schema versions.

Example:

```js
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://YOUR-CONSTRUCTOR-ORIGIN') return
  const message = event.data
  if (message?.channel !== 'MEMORIAL3D' || message?.type !== 'REQUEST_QUOTE') return

  openQuoteForm({
    source: 'memorial-3d',
    sourceSku: message.source.sourceSku,
    projectUrl: message.projectUrl,
    project: message.project,
  })
})
```

### Same-page integration
The editor also dispatches a same-window CustomEvent:

`memorial3d:request-quote`

The normalized envelope is available in `event.detail`.

### Standalone preview
If no parent host is available, the application copies the interactive project URL so the project can still be handed to a manager manually. It does not pretend that a CRM submission occurred.

## Portrait privacy
The envelope intentionally excludes:
- File objects;
- Blob URLs;
- image base64;
- uploaded portrait bytes.

A later secure portrait-upload gate must use a separate authenticated/signed-upload contract.

## Pricing
No calculated price is included until a canonical pricing/BOM authority exists.
