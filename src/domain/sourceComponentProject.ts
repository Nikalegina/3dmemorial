import {
  createDefaultProject,
  type MemorialProject,
} from './memorialProject.ts'
import {
  BENCH_STYLES,
  FENCE_STYLES,
  FLOWER_BED_STYLES,
  PAVING_STYLES,
  TABLE_STYLES,
  VASE_STYLES,
} from './componentCatalog.ts'
import type { SourceComponentProductId } from './sourceComponentCatalog.ts'

export function createSourceComponentProject(id: SourceComponentProductId): MemorialProject {
  const project = createDefaultProject()

  if (id === 'ermis-tsk50' || id === 'ermis-tsr50') {
    project.bench.enabled = true
    project.table.enabled = true
    project.bench.styleId = id === 'ermis-tsk50' ? 'ermis-tsk50-bench' : 'ermis-tsr50-bench'
    project.table.styleId = id === 'ermis-tsk50' ? 'ermis-tsk50-table' : 'ermis-tsr50-table'
    return project
  }

  if (id === 'ermis-grave-slab-1000x500' || id === 'ermis-grave-slab-1200x600') {
    project.flowerBed.enabled = true
    project.flowerBed.styleId = id
    return project
  }

  if (id === 'ermis-paving-600x400' || id === 'ermis-paving-600x300') {
    project.paving.enabled = true
    project.paving.styleId = id
    return project
  }

  if (
    id === 'ermis-vase-600x260x260'
    || id === 'ermis-vase-500x190x190'
    || id === 'ermis-vase-400x170x170'
    || id === 'ermis-vase-300x130x130'
    || id === 'ermis-vase-250x100x100'
    || id === 'ermis-vase-200x100x100'
    || id === 'ermis-lampada-300x150x150'
    || id === 'ermis-baluster-350x100x100'
    || id === 'ermis-baluster-300x100x100'
    || id === 'ermis-sphere-140x110x100'
    || id === 'ermis-sphere-140x90x90'
  ) {
    project.vase.enabled = true
    project.vase.styleId = id
    project.vase.placement = 'right'
    return project
  }

  if (
    id === 'ermis-fence-f01'
    || id === 'ermis-fence-f02'
    || id === 'ermis-fence-f03'
    || id === 'ermis-fence-f04'
  ) {
    project.fence.enabled = true
    project.fence.styleId = id
    project.fence.gateSide = 'front'
    return project
  }

  const exhaustive: never = id
  throw new Error(`Unsupported source component product: ${exhaustive}`)
}


export function findSourceComponentProductId(project: MemorialProject): SourceComponentProductId | null {
  const fence = FENCE_STYLES.find((item) => item.id === project.fence.styleId)
  if (project.fence.enabled && fence && 'sourceComponentId' in fence) return fence.sourceComponentId

  const table = TABLE_STYLES.find((item) => item.id === project.table.styleId)
  if (project.table.enabled && table && 'sourceComponentId' in table) return table.sourceComponentId

  const bench = BENCH_STYLES.find((item) => item.id === project.bench.styleId)
  if (project.bench.enabled && bench && 'sourceComponentId' in bench) return bench.sourceComponentId

  const flowerBed = FLOWER_BED_STYLES.find((item) => item.id === project.flowerBed.styleId)
  if (project.flowerBed.enabled && flowerBed && 'sourceComponentId' in flowerBed) return flowerBed.sourceComponentId

  const paving = PAVING_STYLES.find((item) => item.id === project.paving.styleId)
  if (project.paving.enabled && paving && 'sourceComponentId' in paving) return paving.sourceComponentId

  const vase = VASE_STYLES.find((item) => item.id === project.vase.styleId)
  if (project.vase.enabled && vase && 'sourceComponentId' in vase) return vase.sourceComponentId

  return null
}
