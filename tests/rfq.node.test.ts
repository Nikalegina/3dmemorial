import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject } from '../src/domain/memorialProject.ts'
import {
  buildRfqRequest,
  formatRfqSummary,
  normalizeRfqDraft,
  validateRfqDraft,
} from '../src/domain/rfq.ts'

test('RFQ requires a contact but not a name', () => {
  assert.equal(validateRfqDraft({ name: '', contact: '', channel: 'phone', comment: '' }).valid, false)
  assert.equal(validateRfqDraft({ name: '', contact: '+7 900 000-00-00', channel: 'phone', comment: '' }).valid, true)
})

test('RFQ normalizes whitespace and bounded text', () => {
  const normalized = normalizeRfqDraft({
    name: '  Иван   Иванов ',
    contact: '  @ivan  ',
    channel: 'telegram',
    comment: '  Нужен   монтаж под ключ  ',
  })
  assert.equal(normalized.name, 'Иван Иванов')
  assert.equal(normalized.contact, '@ivan')
  assert.equal(normalized.comment, 'Нужен монтаж под ключ')
})

test('RFQ preserves attribution and project while excluding portrait binaries and pricing', () => {
  const project = createDefaultProject()
  project.projectId = 'RFQ-TEST'
  const request = buildRfqRequest({
    draft: { name: 'Иван', contact: '+7 900 000-00-00', channel: 'phone', comment: 'Под ключ' },
    project,
    shareUrl: 'https://example.test/constructor?project=abc',
    generatedAt: '2026-09-14T01:00:00.000Z',
    sourceSku: 'KM-001',
    presetId: 'classic-granite',
    startupSource: 'catalog',
    localPortraitCount: 1,
  })

  assert.equal(request.schemaVersion, 1)
  assert.equal(request.project.schemaVersion, 5)
  assert.equal(request.attribution.sourceSku, 'KM-001')
  assert.equal(request.media.localPortraitCount, 1)
  assert.equal(request.media.portraitFilesIncluded, false)
  assert.equal(request.media.renderIncluded, false)
  assert.equal(request.commercial.pricingIncluded, false)
  assert.equal(request.commercial.requiresSpecialistCalculation, true)

  const serialized = JSON.stringify(request).toLowerCase()
  assert.equal(serialized.includes('blob:'), false)
  assert.equal(serialized.includes('data:image'), false)
})

test('RFQ summary is readable and states specialist calculation', () => {
  const project = createDefaultProject()
  const request = buildRfqRequest({
    draft: { name: 'Анна', contact: '@anna', channel: 'max', comment: '' },
    project,
    shareUrl: 'https://example.test/constructor?project=abc',
    generatedAt: '2026-09-14T01:00:00.000Z',
    sourceSku: null,
    presetId: null,
    startupSource: 'default',
    localPortraitCount: 0,
  })
  const summary = formatRfqSummary(request)
  assert.match(summary, /Анна/)
  assert.match(summary, /MAX/)
  assert.match(summary, /Стоимость требуется рассчитать специалисту/)
})

test('RFQ rejects malformed share URL and invalid generatedAt', () => {
  const project = createDefaultProject()
  const base = {
    draft: { name: '', contact: 'user', channel: 'other' as const, comment: '' },
    project,
    sourceSku: null,
    presetId: null,
    startupSource: 'default' as const,
    localPortraitCount: 0,
  }
  assert.throws(() => buildRfqRequest({ ...base, shareUrl: 'bad-url', generatedAt: '2026-09-14T01:00:00.000Z' }), /shareUrl/)
  assert.throws(() => buildRfqRequest({ ...base, shareUrl: 'https://example.test', generatedAt: 'bad-date' }), /generatedAt/)
})
