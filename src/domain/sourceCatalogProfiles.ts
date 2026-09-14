import { SOURCE_PROFILE_CHUNK_1 } from './sourceCatalogProfiles.chunk1.ts'
import { SOURCE_PROFILE_CHUNK_2 } from './sourceCatalogProfiles.chunk2.ts'
import { SOURCE_PROFILE_CHUNK_3 } from './sourceCatalogProfiles.chunk3.ts'
import { SOURCE_PROFILE_CHUNK_4 } from './sourceCatalogProfiles.chunk4.ts'
import { SOURCE_PROFILE_CHUNK_5 } from './sourceCatalogProfiles.chunk5.ts'
import { SOURCE_PROFILE_CHUNK_6 } from './sourceCatalogProfiles.chunk6.ts'
import { SOURCE_PROFILE_CHUNK_7 } from './sourceCatalogProfiles.chunk7.ts'

export interface SourceCatalogProfilePoint {
  x: number
  y: number
}

const ENCODED_SOURCE_PROFILES: Record<string, string> = {
  ...SOURCE_PROFILE_CHUNK_1,
  ...SOURCE_PROFILE_CHUNK_2,
  ...SOURCE_PROFILE_CHUNK_3,
  ...SOURCE_PROFILE_CHUNK_4,
  ...SOURCE_PROFILE_CHUNK_5,
  ...SOURCE_PROFILE_CHUNK_6,
  ...SOURCE_PROFILE_CHUNK_7,
}

function decodeProfile(encoded: string): readonly SourceCatalogProfilePoint[] {
  const binary = atob(encoded)
  const count = binary.charCodeAt(0)
  const raw: SourceCatalogProfilePoint[] = []
  for (let index = 0; index < count; index += 1) {
    const offset = 1 + index * 4
    const xi = (binary.charCodeAt(offset) << 8) | binary.charCodeAt(offset + 1)
    const yi = (binary.charCodeAt(offset + 2) << 8) | binary.charCodeAt(offset + 3)
    raw.push({
      x: (xi / 65535) * 1.2 - 0.6,
      y: yi / 65535,
    })
  }

  const minX = Math.min(...raw.map((point) => point.x))
  const maxX = Math.max(...raw.map((point) => point.x))
  const minY = Math.min(...raw.map((point) => point.y))
  const maxY = Math.max(...raw.map((point) => point.y))
  const width = Math.max(0.000001, maxX - minX)
  const height = Math.max(0.000001, maxY - minY)
  const centerX = (minX + maxX) / 2

  // Source dimensions define the physical bounding box. Normalize traced catalog
  // silhouettes to exactly [-0.5..0.5] × [0..1] before applying WIDTH/HEIGHT.
  return raw.map((point) => ({
    x: (point.x - centerX) / width,
    y: (point.y - minY) / height,
  }))
}

export function hasSourceCatalogProfile(profileId: string | null | undefined): boolean {
  return Boolean(profileId && Object.prototype.hasOwnProperty.call(ENCODED_SOURCE_PROFILES, profileId))
}

export function getSourceCatalogProfile(
  profileId: string | null | undefined,
): readonly SourceCatalogProfilePoint[] | null {
  if (!profileId) return null
  const encoded = ENCODED_SOURCE_PROFILES[profileId]
  return encoded ? decodeProfile(encoded) : null
}

export const SOURCE_CATALOG_PROFILE_COUNT = Object.keys(ENCODED_SOURCE_PROFILES).length
