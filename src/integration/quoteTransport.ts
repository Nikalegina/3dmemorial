import {
  validateQuoteRequestPayload,
  type QuoteRequestPayload,
} from './quoteRequest.ts'

export interface QuoteSubmitResponse {
  accepted: true
  requestId: string
  reference: string | null
}

export interface QuoteTransportOptions {
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

export function validateQuoteEndpoint(endpoint: string): string {
  if (typeof endpoint !== 'string' || !endpoint.startsWith('/') || endpoint.startsWith('//')) {
    throw new Error('Quote endpoint must be a same-origin relative path')
  }
  if (endpoint.includes('..') || endpoint.includes('#')) {
    throw new Error('Quote endpoint is unsafe')
  }
  return endpoint
}

export async function submitQuoteRequest(
  endpoint: string,
  payload: QuoteRequestPayload,
  options: QuoteTransportOptions = {},
): Promise<QuoteSubmitResponse> {
  const safeEndpoint = validateQuoteEndpoint(endpoint)
  validateQuoteRequestPayload(payload)

  const fetchImpl = options.fetchImpl ?? fetch
  const timeoutMs = Math.max(1000, Math.min(30000, options.timeoutMs ?? 12000))
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetchImpl(safeEndpoint, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': payload.requestId,
        'X-Quote-Request-Schema': '1',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Quote request failed with HTTP ${response.status}`)
    }

    const body = await response.json() as Partial<QuoteSubmitResponse>
    if (body.accepted !== true || body.requestId !== payload.requestId) {
      throw new Error('Quote endpoint returned invalid acknowledgement')
    }

    return {
      accepted: true,
      requestId: body.requestId,
      reference: typeof body.reference === 'string' && body.reference.trim() ? body.reference.trim() : null,
    }
  } finally {
    clearTimeout(timeoutId)
  }
}
