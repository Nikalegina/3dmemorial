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
  project.plot.widthM = 3.2
  project.layout.gapM = 0.12
  project.steles[0].monument.widthM = 0.56
  project.steles[0].monument.heightM = 1.16
  project.steles[1].monument.widthM = 0.62
  project.steles[1].monument.heightM = 1.34
  project.steles[1].monument.shape = 'ogee'
  project.steles[2].monument.widthM = 0.56
  project.steles[2].monument.heightM = 1.16
  return normalizeProject(project)
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
      stele.portrait.frame = 'full'
      stele.portrait.size = 1.12
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
        stele.portrait.frame = 'rectangle'
        stele.portrait.size = 1
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
    name: 'Семейный комплекс',
    description: 'Три гранитные стелы на общей композиции с увеличенным участком.',
    create: () => withId(familyBase(), 'family-classic'),
  },
] as const

export function getProjectPreset(id: ProjectPresetId): ProjectPreset {
  const preset = PROJECT_PRESETS.find((item) => item.id === id)
  if (!preset) throw new Error(`Unknown project preset: ${id}`)
  return preset
}
