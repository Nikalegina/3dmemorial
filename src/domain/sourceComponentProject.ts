import {
  createDefaultProject,
  type MemorialProject,
} from './memorialProject.ts'
import {
  getSourceComponentProduct,
  type SourceComponentProductId,
} from './sourceComponentCatalog.ts'

export function createSourceComponentProject(id: SourceComponentProductId): MemorialProject {
  const product = getSourceComponentProduct(id)
  const project = createDefaultProject()

  if (product.category === 'furniture-set') {
    project.bench.enabled = true
    project.table.enabled = true
    project.bench.styleId = id === 'ermis-tsk50' ? 'ermis-tsk50-bench' : 'ermis-tsr50-bench'
    project.table.styleId = id === 'ermis-tsk50' ? 'ermis-tsk50-table' : 'ermis-tsr50-table'
    return project
  }

  if (product.category === 'grave-slab') {
    project.flowerBed.enabled = true
    project.flowerBed.styleId = id
    return project
  }

  if (product.category === 'paving') {
    project.paving.enabled = true
    project.paving.styleId = id
    return project
  }

  if (product.category === 'vase' || product.category === 'accessory') {
    project.vase.enabled = true
    project.vase.styleId = id
    project.vase.placement = 'right'
    return project
  }

  project.fence.enabled = true
  project.fence.styleId = id
  project.fence.gateSide = 'front'
  return project
}
