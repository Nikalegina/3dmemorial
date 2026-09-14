import { createDefaultProject, normalizeProject, type MemorialProject } from './memorialProject.ts'
import { SOURCE_CATALOG_RAW_PART_1 } from './sourceCatalogProfiles.part1.ts'
import { SOURCE_CATALOG_RAW_PART_2 } from './sourceCatalogProfiles.part2.ts'
import { SOURCE_CATALOG_RAW_FAMILY } from './sourceCatalogProfiles.family.ts'
import { getSourceStoneMaterial, resolveSourceStoneCodes } from './sourceStoneMaterials.ts'
import type {
  SourceCatalogCategory,
  SourceCatalogProfile,
  SourceCatalogProfileId,
  SourceCatalogRawProfileTuple,
  SourceCatalogVariant,
} from './sourceCatalogProfileTypes.ts'

const RAW_SOURCE_CATALOG = [
  ...SOURCE_CATALOG_RAW_PART_1,
  ...SOURCE_CATALOG_RAW_PART_2,
  ...SOURCE_CATALOG_RAW_FAMILY,
] as const satisfies readonly SourceCatalogRawProfileTuple[]

function sourceCategoryFor(id: SourceCatalogProfileId): SourceCatalogCategory {
  if (id.startsWith('ermis-family-')) return 'family'
  if (id.startsWith('ermis-elite-')) return 'elite'
  if (id.startsWith('ermis-combined-')) return 'combined'
  return 'figured'
}

function toProfile(raw: SourceCatalogRawProfileTuple): SourceCatalogProfile {
  const [id, sourceModel, sourcePage, variants, points] = raw
  return {
    id,
    sourceModel,
    sourceCategory: sourceCategoryFor(id),
    sourcePage,
    variants: variants.map(([heightMm, widthMm, depthMm, materialCodes]): SourceCatalogVariant => ({
      heightMm,
      widthMm,
      depthMm,
      materialCodes,
    })),
    points,
  }
}

export const SOURCE_CATALOG_PROFILES: readonly SourceCatalogProfile[] = RAW_SOURCE_CATALOG.map(toProfile)

const PROFILE_MAP = new Map(SOURCE_CATALOG_PROFILES.map((item) => [item.id, item] as const))

export function isSourceCatalogProfileId(value: string): value is SourceCatalogProfileId {
  return PROFILE_MAP.has(value as SourceCatalogProfileId)
}

export function getSourceCatalogProfile(id: SourceCatalogProfileId): SourceCatalogProfile {
  const profile = PROFILE_MAP.get(id)
  if (!profile) throw new Error(`Unknown source catalog profile: ${id}`)
  return profile
}

export function getSourceCatalogProfileByModel(
  sourceModel: string,
  sourceCategory?: SourceCatalogCategory,
): SourceCatalogProfile | null {
  return SOURCE_CATALOG_PROFILES.find((item) =>
    item.sourceModel === sourceModel
    && (!sourceCategory || item.sourceCategory === sourceCategory)
  ) ?? null
}

export function createSourceCatalogProject(
  id: SourceCatalogProfileId,
  variantIndex = 0,
): MemorialProject {
  const profile = getSourceCatalogProfile(id)
  const variant = profile.variants[variantIndex] ?? profile.variants[0]
  if (!variant) throw new Error(`Source catalog profile has no variants: ${id}`)

  const project = createDefaultProject()
  project.projectId = `CATALOG-${id.toUpperCase()}-V${variantIndex + 1}`
  project.steles[0].monument.shape = id
  project.steles[0].monument.material = 'gabbro'
  const sourceStoneCode = resolveSourceStoneCodes(variant.materialCodes)[0]
  project.steles[0].monument.sourceStoneCode = sourceStoneCode
  project.steles[0].monument.surfaceId = sourceStoneCode
    ? getSourceStoneMaterial(sourceStoneCode).renderSurfaceId
    : 'gabbro-polished'
  project.steles[0].monument.heightM = variant.heightMm / 1000
  project.steles[0].monument.widthM = variant.widthMm / 1000
  project.steles[0].monument.depthM = variant.depthMm / 1000
  project.steles[0].portrait.mode = 'bw'
  project.steles[0].portrait.frame = 'oval'
  project.plinth.enabled = true
  project.flowerBed.enabled = true
  project.flowerBed.styleId = 'open-granite'

  return normalizeProject(project)
}

export const SOURCE_CATALOG_PROFILE_COUNT = SOURCE_CATALOG_PROFILES.length
export const SOURCE_CATALOG_VARIANT_COUNT = SOURCE_CATALOG_PROFILES.reduce(
  (sum, profile) => sum + profile.variants.length,
  0,
)


export function findSourceCatalogVariantIndex(
  profile: SourceCatalogProfile,
  dimensions: { widthM: number; heightM: number; depthM: number },
): number {
  const widthMm = Math.round(dimensions.widthM * 1000)
  const heightMm = Math.round(dimensions.heightM * 1000)
  const depthMm = Math.round(dimensions.depthM * 1000)
  return profile.variants.findIndex((variant) =>
    variant.widthMm === widthMm
    && variant.heightMm === heightMm
    && variant.depthMm === depthMm
  )
}
