import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_MODES } from './catalog.ts'
import { BENCH_STYLES, BORDER_STYLES, FENCE_STYLES, PAVING_STYLES, TABLE_STYLES, VASE_STYLES } from './componentCatalog.ts'
import type { MemorialProject } from './memorialProject.ts'

export interface ProjectSpecRow {
  label: string
  value: string
}

export interface ProjectSpecSection {
  title: string
  rows: ProjectSpecRow[]
}

export interface ProjectSpecification {
  title: string
  projectId: string
  sections: ProjectSpecSection[]
  disclaimer: string
}

const constructionNames: Record<MemorialProject['monument']['material'], string> = {
  gabbro: 'Гранит',
  glass: 'Стекло',
  hybrid: 'Гранит + стекло',
}

function catalogName<T extends readonly { id: string; name: string }[]>(catalog: T, id: string): string {
  return catalog.find((item) => item.id === id)?.name ?? id
}

function enabled(value: boolean): string {
  return value ? 'Да' : 'Нет'
}

export function buildProjectSpecification(project: MemorialProject): ProjectSpecification {
  const complexRows: ProjectSpecRow[] = [
    { label: 'Цоколь', value: project.plinth.enabled ? (project.plinth.materialId === 'gabbro' ? 'Чёрный габбро' : 'Серый гранит') : 'Нет' },
    { label: 'Цветник', value: project.flowerBed.enabled ? (project.flowerBed.styleId === 'open-granite' ? 'Открытый гранитный' : 'Закрытый гранитный') : 'Нет' },
    { label: 'Покрытие', value: project.paving.enabled ? catalogName(PAVING_STYLES, project.paving.styleId) : 'Нет' },
    { label: 'Бордюр', value: project.border.enabled ? catalogName(BORDER_STYLES, project.border.styleId) : 'Нет' },
    { label: 'Ограда', value: project.fence.enabled ? catalogName(FENCE_STYLES, project.fence.styleId) : 'Нет' },
    { label: 'Лавка', value: project.bench.enabled ? catalogName(BENCH_STYLES, project.bench.styleId) : 'Нет' },
    { label: 'Стол', value: project.table.enabled ? catalogName(TABLE_STYLES, project.table.styleId) : 'Нет' },
    { label: 'Ваза', value: project.vase.enabled ? catalogName(VASE_STYLES, project.vase.styleId) : 'Нет' },
  ]

  return {
    title: 'КРЫМ МОНУМЕНТ — спецификация 3D-проекта',
    projectId: project.projectId,
    sections: [
      {
        title: 'Участок',
        rows: [
          { label: 'Размер', value: `${project.plot.widthM.toFixed(2)} × ${project.plot.depthM.toFixed(2)} м` },
        ],
      },
      {
        title: 'Памятник',
        rows: [
          { label: 'Форма', value: catalogName(MONUMENT_SHAPES, project.monument.shape) },
          { label: 'Исполнение', value: constructionNames[project.monument.material] },
          { label: 'Поверхность', value: catalogName(MATERIALS, project.monument.surfaceId) },
          {
            label: 'Размеры',
            value: `${project.monument.widthM.toFixed(2)} × ${project.monument.heightM.toFixed(2)} × ${project.monument.depthM.toFixed(2)} м`,
          },
        ],
      },
      {
        title: 'Портрет и надпись',
        rows: [
          { label: 'Портрет', value: enabled(project.portrait.enabled) },
          { label: 'Режим портрета', value: catalogName(PORTRAIT_MODES, project.portrait.mode) },
          { label: 'Имя', value: project.inscription.name || '—' },
          { label: 'Даты', value: project.inscription.dates || '—' },
          { label: 'Эпитафия', value: project.inscription.epitaph || '—' },
        ],
      },
      {
        title: 'Мемориальный комплекс',
        rows: complexRows,
      },
    ],
    disclaimer: 'Предварительная визуализация. Финальный макет, размеры, материалы и стоимость подтверждаются специалистом.',
  }
}
