import { createDefaultProject, type MemorialProject } from './memorialProject.ts'
import { getCatalogProductFamily, isCatalogProductFamilyId, type CatalogProductFamilyId } from './catalogProducts.ts'
import { getProjectPreset, PROJECT_PRESETS, type ProjectPresetId } from './presets.ts'
import { readSharedProject } from './shareProject.ts'
import { createProjectFromSourceCatalogModel, findSourceCatalogModelBySku } from './sourceCatalog.ts'

export interface CatalogEntryContext {
  presetId: ProjectPresetId | null
  catalogProductId: CatalogProductFamilyId | null
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

function parseSourceSku(value: string | null): string | null {
  if (!value) return null
  const normalized = value.trim()
  return /^[\p{L}\p{N}._-]{1,80}$/u.test(normalized) ? normalized : null
}

export function readCatalogEntry(url: string): CatalogEntryContext {
  try {
    const parsed = new URL(url)
    return {
      presetId: parsePresetId(parsed.searchParams.get('preset')),
      catalogProductId: parseCatalogProductId(parsed.searchParams.get('catalog')),
      sourceSku: parseSourceSku(parsed.searchParams.get('sourceSku')),
    }
  } catch {
    return { presetId: null, catalogProductId: null, sourceSku: null }
  }
}

export function resolveStartupProject(url: string, storedProject: MemorialProject | null): StartupResolution {
  const context = readCatalogEntry(url)
  const shared = readSharedProject(url)
  if (shared) return { project: shared, context, source: 'shared' }

  if (context.catalogProductId) {
    return {
      project: getCatalogProductFamily(context.catalogProductId).create(),
      context,
      source: 'catalog',
    }
  }

  const sourceModel = findSourceCatalogModelBySku(context.sourceSku)
  if (sourceModel) {
    return {
      project: createProjectFromSourceCatalogModel(sourceModel.id),
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
