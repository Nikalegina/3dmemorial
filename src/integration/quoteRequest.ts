import type { CatalogEntryContext, StartupSource } from '../domain/catalogEntry.ts'
import {
  normalizeProject,
  parseProject,
  type MemorialProject,
} from '../domain/memorialProject.ts'

export type QuoteContactChannel = 'PHONE' | 'VK' | 'MAX'

export interface QuoteContactInput {
  name?: string
  phone?: string
  messengerContact?: string
  preferredChannel: QuoteContactChannel
  consentToContact: boolean
  note?: string
}

export interface QuoteRequestPayload {
  schemaVersion: 1
  requestId: string
  createdAt: string
  source: {
    sourceSku: string | null
    entrySource: StartupSource
  }
  contact: {
    name: string | null
    phone: string | null
    messengerContact: string | null
    preferredChannel: QuoteContactChannel
    consentToContact: true
    note: string | null
  }
  project: MemorialProject
}

export interface QuoteRequestBuildOptions {
  now?: () => Date
  idFactory?: () => string
}

const REQUEST_ID = /^[A-Za-z0-9-]{16,80}$/
const SOURCE_SKU = /^[A-Za-z0-9._-]{1,80}$/
const ENTRY_SOURCES = new Set<StartupSource>(['shared', 'catalog', 'local', 'default'])
const CONTACT_CHANNELS = new Set<QuoteContactChannel>(['PHONE', 'VK', 'MAX'])

function text(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().replace(/\s+/g, ' ')
  return normalized ? normalized.slice(0, max) : null
}

function validatePhone(phone: string | null): void {
  if (!phone) return
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) {
    throw new Error('Phone must contain 10..15 digits')
  }
}

function validateMessenger(contact: string | null): void {
  if (!contact) return
  if (contact.length > 120) throw new Error('Messenger contact is too long')
}

export function validateQuoteRequestPayload(payload: QuoteRequestPayload): QuoteRequestPayload {
  if (!payload || payload.schemaVersion !== 1) throw new Error('Unsupported quote request schema')
  if (!REQUEST_ID.test(payload.requestId)) throw new Error('Invalid requestId')

  const createdAt = Date.parse(payload.createdAt)
  if (!Number.isFinite(createdAt)) throw new Error('Invalid createdAt')

  if (!ENTRY_SOURCES.has(payload.source.entrySource)) throw new Error('Invalid entrySource')
  if (payload.source.sourceSku !== null && !SOURCE_SKU.test(payload.source.sourceSku)) {
    throw new Error('Invalid sourceSku')
  }

  if (!CONTACT_CHANNELS.has(payload.contact.preferredChannel)) throw new Error('Invalid preferredChannel')
  if (payload.contact.consentToContact !== true) throw new Error('Contact consent is required')

  validatePhone(payload.contact.phone)
  validateMessenger(payload.contact.messengerContact)

  if (!payload.contact.phone && !payload.contact.messengerContact) {
    throw new Error('At least one contact method is required')
  }
  if (payload.contact.preferredChannel === 'PHONE' && !payload.contact.phone) {
    throw new Error('Phone is required for PHONE channel')
  }
  if ((payload.contact.preferredChannel === 'VK' || payload.contact.preferredChannel === 'MAX')
      && !payload.contact.messengerContact) {
    throw new Error('Messenger contact is required for messenger channel')
  }

  if (payload.contact.name !== null && payload.contact.name.length > 100) throw new Error('Name is too long')
  if (payload.contact.note !== null && payload.contact.note.length > 1000) throw new Error('Note is too long')

  const parsedProject = parseProject(JSON.stringify(payload.project))
  if (JSON.stringify(parsedProject) !== JSON.stringify(normalizeProject(payload.project))) {
    throw new Error('Project payload is not canonical')
  }

  return payload
}

export function buildQuoteRequestPayload(
  project: MemorialProject,
  sourceContext: CatalogEntryContext,
  entrySource: StartupSource,
  input: QuoteContactInput,
  options: QuoteRequestBuildOptions = {},
): QuoteRequestPayload {
  const now = options.now ?? (() => new Date())
  const idFactory = options.idFactory ?? (() => crypto.randomUUID())

  const name = text(input.name, 100)
  const phone = text(input.phone, 40)
  const messengerContact = text(input.messengerContact, 120)
  const note = text(input.note, 1000)

  const payload: QuoteRequestPayload = {
    schemaVersion: 1,
    requestId: idFactory(),
    createdAt: now().toISOString(),
    source: {
      sourceSku: sourceContext.sourceSku,
      entrySource,
    },
    contact: {
      name,
      phone,
      messengerContact,
      preferredChannel: input.preferredChannel,
      consentToContact: input.consentToContact as true,
      note,
    },
    project: normalizeProject(project),
  }

  return validateQuoteRequestPayload(payload)
}
