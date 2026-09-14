import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_FRAMES, PORTRAIT_MODES } from './catalog.ts'
import { BENCH_STYLES, BORDER_STYLES, FENCE_STYLES, FLOWER_BED_STYLES, PAVING_STYLES, TABLE_STYLES, VASE_STYLES } from './componentCatalog.ts'
import { findStandardGlassSteleSize, GLASS_CLARITY_OPTIONS, GLASS_MOUNT_OPTIONS, GLASS_UV_PRINT_OPTIONS } from './glassMemorial.ts'
import { getVisibleSteles, type MemorialProject } from './memorialProject.ts'
import { getSourceCatalogProfile, isSourceCatalogProfileId } from './sourceCatalogProfiles.ts'
import { getSourceStoneMaterial } from './sourceStoneMaterials.ts'

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

function shapeName(shapeId: MemorialProject['steles'][number]['monument']['shape']): string {
  if (isSourceCatalogProfileId(shapeId)) {
    return `Каталог № ${getSourceCatalogProfile(shapeId).sourceModel}`
  }
  return catalogName(MONUMENT_SHAPES, shapeId)
}

function surfaceName(stele: MemorialProject['steles'][number]): string {
  const code = stele.monument.sourceStoneCode
  if (!code) return catalogName(MATERIALS, stele.monument.surfaceId)
  const stone = getSourceStoneMaterial(code)
  return `${stone.code} · ${stone.name}`
}

export function buildProjectSpecification(project: MemorialProject): ProjectSpecification {
  const visibleSteles = getVisibleSteles(project)
  const multi = visibleSteles.length > 1
  const steleSections = visibleSteles.flatMap((stele, index): ProjectSpecSection[] => {
    const suffix = multi ? ` ${index + 1}` : ''
    const standardGlassSize = findStandardGlassSteleSize(stele.monument.widthM, stele.monument.heightM)
    const glassRows: ProjectSpecRow[] = stele.monument.material === 'glass'
      ? [
          { label: 'Конструкция стекла', value: 'Закалённый триплекс' },
          { label: 'Толщина стекла', value: stele.glass.thicknessMm === 12 ? '12 мм (6+6)' : '16 мм (8+8)' },
          { label: 'Вид стекла', value: GLASS_CLARITY_OPTIONS.find((item) => item.id === stele.glass.clarity)?.name ?? stele.glass.clarity },
          { label: 'Крепление', value: GLASS_MOUNT_OPTIONS.find((item) => item.id === stele.glass.mountType)?.name ?? stele.glass.mountType },
          { label: 'УФ-печать', value: GLASS_UV_PRINT_OPTIONS.find((item) => item.id === stele.glass.uvPrintSides)?.name ?? `${stele.glass.uvPrintSides} сторона` },
          { label: 'Минимальный отступ рисунка', value: `${stele.glass.printEdgeMarginMm} мм` },
          { label: 'Типоразмер стеклянной стелы', value: standardGlassSize ? `${standardGlassSize.widthMm} × ${standardGlassSize.heightMm} мм` : 'Индивидуальный' },
        ]
      : []

    return [
      {
        title: `Памятник${suffix}`,
        rows: [
          { label: 'Форма', value: shapeName(stele.monument.shape) },
          { label: 'Исполнение', value: constructionNames[stele.monument.material] ?? stele.monument.material },
          { label: 'Поверхность', value: surfaceName(stele) },
          {
            label: 'Размеры',
            value: `${stele.monument.widthM.toFixed(3)} × ${stele.monument.heightM.toFixed(3)} × ${stele.monument.depthM.toFixed(3)} м`,
          },
          ...(stele.monument.sourceStoneCode
            ? (() => {
                const stone = getSourceStoneMaterial(stele.monument.sourceStoneCode)
                return [
                  { label: 'Порода по каталогу', value: `${stone.code} · ${stone.name}` },
                  {
                    label: 'Источник характеристик',
                    value: stone.sourceAuthority === 'documented'
                      ? `Исходный каталог, стр. ${stone.sourcePage}`
                      : 'Код есть в таблицах размеров; свойства в разделе пород не приведены',
                  },
                ] satisfies ProjectSpecRow[]
              })()
            : []),
          ...glassRows,
        ],
      },
      {
        title: `Портрет и надпись${suffix}`,
        rows: [
          { label: 'Портрет', value: enabled(stele.portrait.enabled) },
          { label: 'Режим портрета', value: catalogName(PORTRAIT_MODES, stele.portrait.mode) },
          { label: 'Оформление портрета', value: catalogName(PORTRAIT_FRAMES, stele.portrait.frame) },
          { label: 'Размер портрета', value: `${Math.round(stele.portrait.size * 100)}%` },
          { label: 'Имя', value: stele.inscription.name || '—' },
          { label: 'Даты', value: stele.inscription.dates || '—' },
          { label: 'Эпитафия', value: stele.inscription.epitaph || '—' },
        ],
      },
    ]
  })

  const complexRows: ProjectSpecRow[] = [
    { label: 'Цоколь', value: project.plinth.enabled ? (project.plinth.materialId === 'gabbro' ? 'Чёрный габбро' : 'Серый гранит') : 'Нет' },
    { label: 'Цветник', value: project.flowerBed.enabled ? catalogName(FLOWER_BED_STYLES, project.flowerBed.styleId) : 'Нет' },
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
