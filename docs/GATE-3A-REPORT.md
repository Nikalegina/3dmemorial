# Gate 3A report — stateless sharing

## Decision
Introduce shareable interactive project links before a persistence backend. The current project configuration is encoded into a URL query parameter and restored on open.

## Why this gate is stateless
- It immediately enables the commercial workflow "отправить проект родственникам".
- It avoids premature backend/cloud-storage coupling.
- It keeps uploaded portrait files browser-local until a separate secure upload/storage architecture is implemented.

## Privacy boundary
The share URL contains configuration data only. The portrait binary/object URL is never serialized into the link. The configuration is base64url-encoded for transport, not encrypted; anyone who receives the URL can read the shared project. The UI states this explicitly. When a local portrait exists, the UI also tells the user that the photo will not be transferred.

## Limitations
- No durable server-side project ID yet.
- No cross-device portrait transfer yet.
- No collaboration/comments yet.
- URL size remains suitable only while configuration stays compact; backend persistence becomes the target once projects include richer scene state or media references.
