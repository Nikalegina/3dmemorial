import type { CatalogEntryContext, StartupSource } from '../domain/catalogEntry.ts'
import { normalizeProject, type MemorialProject } from '../domain/memorialProject.ts'

export const HOST_BRIDGE_CHANNEL = 'MEMORIAL3D'
export const HOST_BRIDGE_VERSION = 1 as const
export const QUOTE_EVENT_NAME = 'memorial3d:request-quote'

export interface QuoteRequestEnvelope {
  channel: typeof HOST_BRIDGE_CHANNEL
  type: 'REQUEST_QUOTE'
  version: typeof HOST_BRIDGE_VERSION
  projectSchemaVersion: MemorialProject['schemaVersion']
  project: MemorialProject
  projectUrl: string
  source: {
    startupSource: StartupSource
    presetId: CatalogEntryContext['presetId']
    catalogProductId: CatalogEntryContext['catalogProductId']
    sourceSku: CatalogEntryContext['sourceSku']
    projectCatalogModelId: string | null
  }
  privacy: {
    includesPortraitBinary: false
    includesContactData: false
  }
}

export interface PublishQuoteResult {
  localEventDispatched: boolean
  parentPosted: boolean
  targetOrigin: string | null
}

export function resolveParentOrigin(referrer: string): string | null {
  if (!referrer) return null
  try {
    const parsed = new URL(referrer)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    return parsed.origin
  } catch {
    return null
  }
}

export function createQuoteRequestEnvelope(
  project: MemorialProject,
  projectUrl: string,
  startupSource: StartupSource,
  context: CatalogEntryContext,
): QuoteRequestEnvelope {
  return {
    channel: HOST_BRIDGE_CHANNEL,
    type: 'REQUEST_QUOTE',
    version: HOST_BRIDGE_VERSION,
    projectSchemaVersion: project.schemaVersion,
    project: normalizeProject(project),
    projectUrl,
    source: {
      startupSource,
      presetId: context.presetId,
      catalogProductId: context.catalogProductId,
      sourceSku: context.sourceSku,
      projectCatalogModelId: project.catalogSource?.modelId ?? null,
    },
    privacy: {
      includesPortraitBinary: false,
      includesContactData: false,
    },
  }
}

export function publishQuoteRequest(envelope: QuoteRequestEnvelope): PublishQuoteResult {
  if (typeof window === 'undefined') {
    return { localEventDispatched: false, parentPosted: false, targetOrigin: null }
  }

  window.dispatchEvent(new CustomEvent<QuoteRequestEnvelope>(QUOTE_EVENT_NAME, { detail: envelope }))

  let parentPosted = false
  let targetOrigin: string | null = null
  if (window.parent !== window) {
    targetOrigin = resolveParentOrigin(document.referrer)
    if (targetOrigin) {
      window.parent.postMessage(envelope, targetOrigin)
      parentPosted = true
    }
  }

  return {
    localEventDispatched: true,
    parentPosted,
    targetOrigin,
  }
}
