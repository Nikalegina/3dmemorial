import { createDefaultProject, type MemorialProject } from './memorialProject.ts'
import { getCatalogProductFamily, isCatalogProductFamilyId, type CatalogProductFamilyId } from './catalogProducts.ts'
import { createSourceCatalogProject, getSourceCatalogProfile, isSourceCatalogProfileId } from './sourceCatalogProfiles.ts'
import type { SourceCatalogProfileId } from './sourceCatalogProfileTypes.ts'
import {
  getSourceComponentProduct,
  isSourceComponentProductId,
  type SourceComponentProductId,
} from './sourceComponentCatalog.ts'
import { createSourceComponentProject } from './sourceComponentProject.ts'
import { getProjectPreset, PROJECT_PRESETS, type ProjectPresetId } from './presets.ts'
import { readSharedProject } from './shareProject.ts'

export interface CatalogEntryContext {
  presetId: ProjectPresetId | null
  catalogProductId: CatalogProductFamilyId | null
  sourceProfileId: SourceCatalogProfileId | null
  sourceVariantIndex: number | null
  sourceComponentId: SourceComponentProductId | null
  sourceSku: string | null
}

export type StartupSource = 'shared' | 'catalog' | 'local' | 'default'

export interface StartupResolution {
  project: MemorialProject
  context: CatalogEntryContext
  source: StartupSource
}

const PRESET_IDS = new Set(PROJECT_PRESETS.map((preset) => preset.id))

function parsePresetId(value: string | null): ProjectPresetId | null {
  if (!value || !PRESET_IDS.has(value as ProjectPresetId)) return null
  return value as ProjectPresetId
}

function parseCatalogProductId(value: string | null): CatalogProductFamilyId | null {
  if (!value || !isCatalogProductFamilyId(value)) return null
  return value
}

function parseSourceProfileId(value: string | null): SourceCatalogProfileId | null {
  if (!value || !isSourceCatalogProfileId(value)) return null
  return value
}

function parseSourceComponentId(value: string | null): SourceComponentProductId | null {
  if (!value || !isSourceComponentProductId(value)) return null
  return value
}

function parseSourceVariantIndex(
  value: string | null,
  profileId: SourceCatalogProfileId | null,
): number | null {
  if (!value || !profileId || !/^\d+$/.test(value)) return null
  const index = Number(value)
  return index >= 0 && index < getSourceCatalogProfile(profileId).variants.length ? index : null
}

function parseSourceSku(value: string | null): string | null {
  if (!value) return null
  const normalized = value.trim()
  return /^[\p{L}\p{N}._-]{1,80}$/u.test(normalized) ? normalized : null
}

export function readCatalogEntry(url: string): CatalogEntryContext {
  try {
    const parsed = new URL(url)
    const sourceProfileId = parseSourceProfileId(parsed.searchParams.get('profile'))
    const sourceComponentId = parseSourceComponentId(parsed.searchParams.get('component'))
    const explicitSourceSku = parseSourceSku(parsed.searchParams.get('sourceSku'))
    const componentSourceSku = sourceComponentId
      ? getSourceComponentProduct(sourceComponentId).sourceSku
      : null

    return {
      presetId: parsePresetId(parsed.searchParams.get('preset')),
      catalogProductId: parseCatalogProductId(parsed.searchParams.get('catalog')),
      sourceProfileId,
      sourceVariantIndex: parseSourceVariantIndex(parsed.searchParams.get('variant'), sourceProfileId),
      sourceComponentId,
      sourceSku: explicitSourceSku ?? componentSourceSku,
    }
  } catch {
    return {
      presetId: null,
      catalogProductId: null,
      sourceProfileId: null,
      sourceVariantIndex: null,
      sourceComponentId: null,
      sourceSku: null,
    }
  }
}

export function resolveStartupProject(url: string, storedProject: MemorialProject | null): StartupResolution {
  const context = readCatalogEntry(url)
  const shared = readSharedProject(url)
  if (shared) return { project: shared, context, source: 'shared' }

  if (context.sourceProfileId) {
    return {
      project: createSourceCatalogProject(context.sourceProfileId, context.sourceVariantIndex ?? 0),
      context,
      source: 'catalog',
    }
  }

  if (context.sourceComponentId) {
    return {
      project: createSourceComponentProject(context.sourceComponentId),
      context,
      source: 'catalog',
    }
  }

  if (context.catalogProductId) {
    return {
      project: getCatalogProductFamily(context.catalogProductId).create(),
      context,
      source: 'catalog',
    }
  }

  if (context.presetId) {
    return {
      project: getProjectPreset(context.presetId).create(),
      context,
      source: 'catalog',
    }
  }

  if (storedProject) return { project: storedProject, context, source: 'local' }
  return { project: createDefaultProject(), context, source: 'default' }
}
