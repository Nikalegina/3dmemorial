import { createDefaultProject, normalizeProject, type MemorialProject } from './memorialProject.ts'

export type ProjectPresetId = 'classic-granite' | 'modern-glass' | 'muslim-granite'

export interface ProjectPreset {
  id: ProjectPresetId
  name: string
  description: string
  create: () => MemorialProject
}

function withId(project: MemorialProject, presetId: ProjectPresetId): MemorialProject {
  return normalizeProject({ ...project, projectId: `PRESET-${presetId.toUpperCase()}` })
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
      project.monument.shape = 'rectangle'
      project.monument.material = 'glass'
      project.monument.surfaceId = 'glass-clear'
      project.portrait.mode = 'color'
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
      project.monument.shape = 'muslim-arch'
      project.monument.surfaceId = 'gabbro-matte'
      project.inscription.epitaph = ''
      return withId(project, 'muslim-granite')
    },
  },
] as const

export function getProjectPreset(id: ProjectPresetId): ProjectPreset {
  const preset = PROJECT_PRESETS.find((item) => item.id === id)
  if (!preset) throw new Error(`Unknown project preset: ${id}`)
  return preset
}
