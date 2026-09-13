import { createDefaultProject, type MemorialProject } from './memorialProject.ts'
import { getProjectPreset, PROJECT_PRESETS, type ProjectPresetId } from './presets.ts'
import { readSharedProject } from './shareProject.ts'

export interface CatalogEntryContext {
  presetId: ProjectPresetId | null
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

function parseSourceSku(value: string | null): string | null {
  if (!value) return null
  const normalized = value.trim()
  return /^[A-Za-z0-9._-]{1,80}$/.test(normalized) ? normalized : null
}

export function readCatalogEntry(url: string): CatalogEntryContext {
  try {
    const parsed = new URL(url)
    return {
      presetId: parsePresetId(parsed.searchParams.get('preset')),
      sourceSku: parseSourceSku(parsed.searchParams.get('sourceSku')),
    }
  } catch {
    return { presetId: null, sourceSku: null }
  }
}

export function resolveStartupProject(url: string, storedProject: MemorialProject | null): StartupResolution {
  const context = readCatalogEntry(url)
  const shared = readSharedProject(url)
  if (shared) return { project: shared, context, source: 'shared' }

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
