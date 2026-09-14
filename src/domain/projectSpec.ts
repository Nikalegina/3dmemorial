import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_MODES } from './catalog.ts'
import { BENCH_STYLES, BORDER_STYLES, FENCE_STYLES, PAVING_STYLES, TABLE_STYLES, VASE_STYLES } from './componentCatalog.ts'
import { getVisibleSteles, type MemorialProject } from './memorialProject.ts'
import { getInscriptionFont, getMemorialSymbolName, getPortraitFrameName } from './personalizationCatalog.ts'

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

const constructionNames: Record<string, string> = {
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
  const visibleSteles = getVisibleSteles(project)
  const multi = visibleSteles.length > 1
  const steleSections = visibleSteles.flatMap((stele, index): ProjectSpecSection[] => {
    const suffix = multi ? ` ${index + 1}` : ''
    return [
      {
        title: `Памятник${suffix}`,
        rows: [
          { label: 'Форма', value: catalogName(MONUMENT_SHAPES, stele.monument.shape) },
          { label: 'Исполнение', value: constructionNames[stele.monument.material] ?? stele.monument.material },
          { label: 'Поверхность', value: catalogName(MATERIALS, stele.monument.surfaceId) },
          {
            label: 'Размеры',
            value: `${stele.monument.widthM.toFixed(2)} × ${stele.monument.heightM.toFixed(2)} × ${stele.monument.depthM.toFixed(2)} м`,
          },
        ],
      },
      {
        title: `Портрет и надпись${suffix}`,
        rows: [
          { label: 'Портрет', value: enabled(stele.portrait.enabled) },
          { label: 'Режим портрета', value: catalogName(PORTRAIT_MODES, stele.portrait.mode) },
          { label: 'Форма портрета', value: getPortraitFrameName(stele.portrait.frame) },
          { label: 'Имя', value: stele.inscription.name || '—' },
          { label: 'Даты', value: stele.inscription.dates || '—' },
          { label: 'Эпитафия', value: stele.inscription.epitaph || '—' },
          { label: 'Шрифт', value: getInscriptionFont(stele.inscription.fontId).name },
          { label: 'Символ', value: getMemorialSymbolName(stele.inscription.symbolId) },
        ],
      },
    ]
  })

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
          { label: 'Композиция', value: project.layout.type === 'single' ? 'Одиночная' : project.layout.type === 'paired' ? 'Парная' : 'Семейная' },
        ],
      },
      ...steleSections,
      {
        title: 'Мемориальный комплекс',
        rows: complexRows,
      },
    ],
    disclaimer: 'Предварительная визуализация. Финальный макет, размеры, материалы и стоимость подтверждаются специалистом.',
  }
}
