import {
  createDefaultProject,
  createDefaultStele,
  normalizeProject,
  withLayout,
  type MemorialProject,
} from './memorialProject.ts'

export type ProjectPresetId =
  | 'classic-granite'
  | 'modern-glass'
  | 'muslim-granite'
  | 'paired-classic'
  | 'paired-glass'
  | 'paired-muslim'
  | 'family-classic'
  | 'family-glass'
  | 'family-muslim'

export interface ProjectPreset {
  id: ProjectPresetId
  name: string
  description: string
  create: () => MemorialProject
}

function withId(project: MemorialProject, presetId: ProjectPresetId): MemorialProject {
  return normalizeProject({ ...project, projectId: `PRESET-${presetId.toUpperCase()}` })
}

function pairedBase(): MemorialProject {
  return withLayout(createDefaultProject(), 'paired')
}

function familyBase(): MemorialProject {
  const project = withLayout(createDefaultProject(), 'family')
  project.plot.widthM = 3
  project.layout.gapM = 0.12
  project.vase.placement = 'pair'
  return project
}

export const PROJECT_PRESETS: readonly ProjectPreset[] = [
  {
    id: 'classic-granite',
    name: 'Классический гранит',
    description: 'Арочная стела из полированного габбро с цветником и вазой.',
    create: () => withId(createDefaultProject(), 'classic-granite'),
  },
  {
    id: 'modern-glass',
    name: 'Современное стекло',
    description: 'Прямоугольная стеклянная стела с цветной фотопечатью.',
    create: () => {
      const project = createDefaultProject()
      const stele = project.steles[0]
      stele.monument.shape = 'rectangle'
      stele.monument.material = 'glass'
      stele.monument.surfaceId = 'glass-clear'
      stele.portrait.mode = 'color'
      project.flowerBed.enabled = false
      return withId(project, 'modern-glass')
    },
  },
  {
    id: 'muslim-granite',
    name: 'Мусульманский',
    description: 'Заострённая арка без религиозного декора по умолчанию.',
    create: () => {
      const project = createDefaultProject()
      const stele = project.steles[0]
      stele.monument.shape = 'muslim-arch'
      stele.monument.surfaceId = 'gabbro-matte'
      stele.inscription.epitaph = ''
      return withId(project, 'muslim-granite')
    },
  },
  {
    id: 'paired-classic',
    name: 'Парный классический',
    description: 'Две гранитные стелы на общем основании.',
    create: () => withId(pairedBase(), 'paired-classic'),
  },
  {
    id: 'paired-glass',
    name: 'Парный стеклянный',
    description: 'Две стеклянные стелы с независимыми цветными портретами.',
    create: () => {
      const project = pairedBase()
      for (const stele of project.steles.slice(0, 2)) {
        stele.monument.shape = 'rounded-rectangle'
        stele.monument.material = 'glass'
        stele.monument.surfaceId = 'glass-clear'
        stele.portrait.mode = 'color'
      }
      return withId(project, 'paired-glass')
    },
  },
  {
    id: 'paired-muslim',
    name: 'Парный мусульманский',
    description: 'Две стрельчатые гранитные стелы на общей композиции.',
    create: () => {
      const project = pairedBase()
      const secondary = project.steles[1] ?? createDefaultStele('secondary')
      project.steles[0].monument.shape = 'muslim-arch'
      secondary.monument.shape = 'muslim-dome'
      secondary.monument.heightM = 1.18
      if (project.steles.length < 2) project.steles.push(secondary)
      return withId(project, 'paired-muslim')
    },
  },
  {
    id: 'family-classic',
    name: 'Семейный классический',
    description: 'Три гранитные стелы на общей семейной композиции.',
    create: () => {
      const project = familyBase()
      const [left, center, right] = project.steles
      left.monument.shape = 'arch'
      left.monument.widthM = 0.54
      left.monument.heightM = 1.12
      center.monument.shape = 'dome'
      center.monument.widthM = 0.62
      center.monument.heightM = 1.32
      right.monument.shape = 'arch'
      right.monument.widthM = 0.54
      right.monument.heightM = 1.12
      return withId(project, 'family-classic')
    },
  },
  {
    id: 'family-glass',
    name: 'Семейный стеклянный',
    description: 'Три стеклянные стелы с независимыми портретами.',
    create: () => {
      const project = familyBase()
      for (const [index, stele] of project.steles.entries()) {
        stele.monument.shape = 'rounded-rectangle'
        stele.monument.material = 'glass'
        stele.monument.surfaceId = index === 1 ? 'glass-smoke' : 'glass-clear'
        stele.monument.widthM = index === 1 ? 0.62 : 0.54
        stele.monument.heightM = index === 1 ? 1.3 : 1.12
        stele.portrait.mode = 'color'
      }
      return withId(project, 'family-glass')
    },
  },
  {
    id: 'family-muslim',
    name: 'Семейный мусульманский',
    description: 'Три стрельчатые гранитные стелы без автоматического религиозного символа.',
    create: () => {
      const project = familyBase()
      for (const [index, stele] of project.steles.entries()) {
        stele.monument.shape = index === 1 ? 'muslim-dome' : 'muslim-arch'
        stele.monument.widthM = index === 1 ? 0.6 : 0.52
        stele.monument.heightM = index === 1 ? 1.3 : 1.12
        stele.inscription.symbolId = 'none'
      }
      return withId(project, 'family-muslim')
    },
  },
] as const

export function getProjectPreset(id: ProjectPresetId): ProjectPreset {
  const preset = PROJECT_PRESETS.find((item) => item.id === id)
  if (!preset) throw new Error(`Unknown project preset: ${id}`)
  return preset
}
