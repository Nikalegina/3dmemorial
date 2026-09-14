import { normalizeProject, type MemorialProject } from './memorialProject.ts'

export const RFQ_SCHEMA_VERSION = 1 as const

export type ContactChannel = 'phone' | 'max' | 'vk' | 'telegram' | 'other'
export type RfqStartupSource = 'shared' | 'catalog' | 'local' | 'default'

export interface RfqDraft {
  name: string
  contact: string
  channel: ContactChannel
  comment: string
}

export interface RfqValidation {
  valid: boolean
  errors: Partial<Record<keyof RfqDraft, string>>
}

export interface RfqRequestV1 {
  schemaVersion: 1
  kind: 'MEMORIAL_QUOTE_REQUEST'
  status: 'LOCAL_DRAFT'
  generatedAt: string
  contact: {
    name: string | null
    value: string
    channel: ContactChannel
  }
  comment: string | null
  attribution: {
    sourceSku: string | null
    presetId: string | null
    startupSource: RfqStartupSource
  }
  project: MemorialProject
  shareUrl: string
  media: {
    localPortraitCount: number
    portraitFilesIncluded: false
    renderIncluded: false
  }
  commercial: {
    pricingIncluded: false
    requiresSpecialistCalculation: true
  }
}

const CONTACT_CHANNEL_NAMES: Record<ContactChannel, string> = {
  phone: 'Телефон',
  max: 'MAX',
  vk: 'VK',
  telegram: 'Telegram',
  other: 'Другой',
}

function cleanText(value: string, maxLength: number): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function normalizeRfqDraft(input: RfqDraft): RfqDraft {
  return {
    name: cleanText(input.name, 80),
    contact: cleanText(input.contact, 160),
    channel: ['phone', 'max', 'vk', 'telegram', 'other'].includes(input.channel)
      ? input.channel
      : 'other',
    comment: cleanText(input.comment, 600),
  }
}

export function validateRfqDraft(input: RfqDraft): RfqValidation {
  const draft = normalizeRfqDraft(input)
  const errors: RfqValidation['errors'] = {}

  if (draft.contact.length < 3) {
    errors.contact = 'Укажите телефон, ник или ссылку для связи.'
  }

  if (draft.name.length > 80) {
    errors.name = 'Имя слишком длинное.'
  }

  if (draft.comment.length > 600) {
    errors.comment = 'Комментарий слишком длинный.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

export function buildRfqRequest(args: {
  draft: RfqDraft
  project: MemorialProject
  shareUrl: string
  generatedAt: string
  sourceSku: string | null
  presetId: string | null
  startupSource: RfqStartupSource
  localPortraitCount: number
}): RfqRequestV1 {
  const validation = validateRfqDraft(args.draft)
  if (!validation.valid) {
    throw new Error('RFQ draft is invalid')
  }

  const draft = normalizeRfqDraft(args.draft)
  const generated = new Date(args.generatedAt)
  if (Number.isNaN(generated.getTime())) throw new Error('RFQ generatedAt is invalid')

  let safeShareUrl: string
  try {
    safeShareUrl = new URL(args.shareUrl).toString()
  } catch {
    throw new Error('RFQ shareUrl is invalid')
  }

  return {
    schemaVersion: RFQ_SCHEMA_VERSION,
    kind: 'MEMORIAL_QUOTE_REQUEST',
    status: 'LOCAL_DRAFT',
    generatedAt: generated.toISOString(),
    contact: {
      name: draft.name || null,
      value: draft.contact,
      channel: draft.channel,
    },
    comment: draft.comment || null,
    attribution: {
      sourceSku: args.sourceSku,
      presetId: args.presetId,
      startupSource: args.startupSource,
    },
    project: normalizeProject(args.project),
    shareUrl: safeShareUrl,
    media: {
      localPortraitCount: Math.max(0, Math.floor(args.localPortraitCount)),
      portraitFilesIncluded: false,
      renderIncluded: false,
    },
    commercial: {
      pricingIncluded: false,
      requiresSpecialistCalculation: true,
    },
  }
}

export function formatRfqSummary(request: RfqRequestV1): string {
  const visibleCount = request.project.layout.type === 'single'
    ? 1
    : request.project.layout.type === 'paired'
      ? Math.min(2, request.project.steles.length)
      : request.project.steles.length

  const lines = [
    'КРЫМ МОНУМЕНТ — заявка на расчёт',
    `Проект: ${request.project.projectId}`,
    `Композиция: ${request.project.layout.type === 'single' ? 'одиночная' : request.project.layout.type === 'paired' ? 'парная' : 'семейная'}`,
    `Памятников: ${visibleCount}`,
    `Связь: ${CONTACT_CHANNEL_NAMES[request.contact.channel]} — ${request.contact.value}`,
  ]

  if (request.contact.name) lines.push(`Имя: ${request.contact.name}`)
  if (request.attribution.sourceSku) lines.push(`Источник: ${request.attribution.sourceSku}`)
  if (request.comment) lines.push(`Комментарий: ${request.comment}`)

  lines.push(`3D-проект: ${request.shareUrl}`)
  lines.push('Стоимость требуется рассчитать специалисту.')

  if (request.media.localPortraitCount > 0) {
    lines.push('Фото загружены локально и в ссылку/пакет не включены.')
  }

  return lines.join('\n')
}
