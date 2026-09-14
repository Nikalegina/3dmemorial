import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject } from '../src/domain/memorialProject.ts'
import {
  buildQuoteRequestPayload,
  validateQuoteRequestPayload,
} from '../src/integration/quoteRequest.ts'
import {
  submitQuoteRequest,
  validateQuoteEndpoint,
} from '../src/integration/quoteTransport.ts'

const fixedId = 'quote-request-0000000001'
const fixedDate = new Date('2026-09-14T00:00:00.000Z')

function build(overrides = {}) {
  return buildQuoteRequestPayload(
    createDefaultProject(),
    { presetId: null, sourceSku: 'KM-001' },
    'catalog',
    {
      name: ' Иван Иванов ',
      phone: '+7 (999) 123-45-67',
      preferredChannel: 'PHONE',
      consentToContact: true,
      note: ' Нужна консультация ',
      ...overrides,
    },
    {
      idFactory: () => fixedId,
      now: () => fixedDate,
    },
  )
}

test('quote request builder emits canonical minimal CRM/BFF payload without portrait binary', () => {
  const payload = build()
  assert.equal(payload.schemaVersion, 1)
  assert.equal(payload.requestId, fixedId)
  assert.equal(payload.createdAt, fixedDate.toISOString())
  assert.equal(payload.source.sourceSku, 'KM-001')
  assert.equal(payload.contact.name, 'Иван Иванов')
  assert.equal(payload.contact.phone, '+7 (999) 123-45-67')
  assert.equal(payload.contact.note, 'Нужна консультация')
  assert.equal(payload.project.schemaVersion, 5)

  const serialized = JSON.stringify(payload).toLowerCase()
  assert.equal(serialized.includes('blob:'), false)
  assert.equal(serialized.includes('data:image'), false)
  assert.equal(serialized.includes('portraiturl'), false)
})

test('quote request requires explicit consent and the contact route selected by preferred channel', () => {
  assert.throws(() => build({ consentToContact: false }), /Contact consent is required/)
  assert.throws(() => build({ phone: '', messengerContact: '' }), /Phone is required for PHONE channel/)
  assert.throws(() => build({ phone: '123' }), /10\.\.15 digits/)
})

test('messenger preferred channels require messenger contact', () => {
  assert.throws(
    () => build({ phone: '', preferredChannel: 'MAX', messengerContact: '' }),
    /Messenger contact is required/,
  )

  const payload = build({
    phone: '',
    preferredChannel: 'MAX',
    messengerContact: '@client-max',
  })
  assert.equal(payload.contact.preferredChannel, 'MAX')
  assert.equal(payload.contact.messengerContact, '@client-max')
})

test('source SKU is validated again at contract boundary', () => {
  const payload = build()
  payload.source.sourceSku = '<script>'
  assert.throws(() => validateQuoteRequestPayload(payload), /Invalid sourceSku/)
})

test('transport accepts only same-origin relative BFF endpoints', () => {
  assert.equal(validateQuoteEndpoint('/api/quote-requests'), '/api/quote-requests')
  assert.throws(() => validateQuoteEndpoint('https://crm.example.test/api'), /same-origin relative path/)
  assert.throws(() => validateQuoteEndpoint('//crm.example.test/api'), /same-origin relative path/)
  assert.throws(() => validateQuoteEndpoint('/api/../secret'), /unsafe/)
})

test('transport sends idempotency key and validates acknowledgement', async () => {
  const payload = build()
  let capturedUrl = ''
  let capturedInit: RequestInit | undefined

  const fetchImpl: typeof fetch = async (input, init) => {
    capturedUrl = String(input)
    capturedInit = init
    return new Response(JSON.stringify({
      accepted: true,
      requestId: payload.requestId,
      reference: 'CRM-42',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const result = await submitQuoteRequest('/api/quote-requests', payload, { fetchImpl, timeoutMs: 2000 })
  assert.equal(capturedUrl, '/api/quote-requests')
  assert.equal(new Headers(capturedInit?.headers).get('Idempotency-Key'), payload.requestId)
  assert.equal(new Headers(capturedInit?.headers).get('X-Quote-Request-Schema'), '1')
  assert.equal(capturedInit?.credentials, 'same-origin')
  assert.equal(result.reference, 'CRM-42')
})

test('transport rejects non-success HTTP and mismatched acknowledgement', async () => {
  const payload = build()

  await assert.rejects(
    submitQuoteRequest('/api/quote-requests', payload, {
      fetchImpl: async () => new Response('fail', { status: 500 }),
    }),
    /HTTP 500/,
  )

  await assert.rejects(
    submitQuoteRequest('/api/quote-requests', payload, {
      fetchImpl: async () => new Response(JSON.stringify({
        accepted: true,
        requestId: 'another-request-id',
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }),
    }),
    /invalid acknowledgement/,
  )
})
