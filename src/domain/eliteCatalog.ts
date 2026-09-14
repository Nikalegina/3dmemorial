import type { SourceCatalogProfileId } from './sourceCatalogProfileTypes.ts'

export type EliteModelingStrategy = 'profile-extrusion' | 'procedural-compound' | 'glb-required'

export interface EliteCatalogVariant {
  heightMm: number
  widthMm: number
  depthMm: number
  materialCodes: readonly string[]
}

export interface EliteCatalogModel {
  id: `elite-${string}`
  sourceModel: string
  sourcePage: 25 | 26 | 27
  variants: readonly EliteCatalogVariant[]
  strategy: EliteModelingStrategy
  runtimeProfileId?: SourceCatalogProfileId
  rationale: string
}

const one = (
  sourceModel: string,
  sourcePage: 25 | 26 | 27,
  heightMm: number,
  widthMm: number,
  depthMm: number,
  materialCodes: readonly string[],
  strategy: EliteModelingStrategy,
  rationale: string,
  runtimeProfileId?: SourceCatalogProfileId,
): EliteCatalogModel => ({
  id: `elite-${sourceModel}`,
  sourceModel,
  sourcePage,
  variants: [{ heightMm, widthMm, depthMm, materialCodes }],
  strategy,
  runtimeProfileId,
  rationale,
})

export const ELITE_CATALOG_MODELS: readonly EliteCatalogModel[] = [
  one('1', 25, 1300, 1100, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Полнообъёмная фигура ангела, сердце и розы требуют скульптурного ассета.'),
  one('2', 25, 1300, 1050, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Фигура и птица выступают из плоскости стелы и требуют скульптурного ассета.'),
  one('3', 25, 1180, 1300, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Крупная фигура ангела и крыло являются объёмным декором.'),
  one('4', 25, 1630, 1180, 200, ['K06', 'K05', 'K10', 'K11'], 'procedural-compound', 'Открытая арка с двумя стойками и верхним архивольтом должна собираться из отдельных тел, а не сплошной экструзией.'),
  one('5', 25, 1300, 1100, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Фигура ангела, сердце и розы требуют скульптурного ассета.'),
  one('6', 25, 1300, 1100, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Боковая фигура и рельефный декор требуют скульптурного ассета.'),
  one('7', 25, 1200, 1100, 100, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Органическая форма дополнена выраженным цветочным рельефом.'),
  one('9', 25, 1080, 1300, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Ангел и крыло образуют отдельную объёмную часть изделия.'),
  one('10', 25, 1100, 1300, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Центральная фигура и цветочный рельеф требуют отдельной 3D-скульптуры.'),
  one('11', 26, 1300, 1000, 100, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Сердцевидная стела имеет объёмную птицу и декоративный верх.'),
  one('12', 26, 1600, 700, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Форма стелы проста, но розы и листья являются существенным рельефным элементом изделия.'),
  one('13', 26, 1000, 900, 100, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Сердце окружено розами и сложным декоративным основанием.'),
  one('14', 26, 1400, 1000, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Фигура ангела является доминирующей объёмной частью модели.'),
  one('16', 26, 1000, 1100, 100, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Дерево, ветви и листья требуют отдельной пространственной геометрии.'),
  one('17', 26, 1100, 1000, 100, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Сердце интегрировано с объёмным стволом и листьями.'),
  one('18', 26, 1300, 1000, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Фигура святого и крест являются отдельным скульптурным декором.'),
  one('19', 26, 1500, 700, 150, ['K06', 'K05', 'K10', 'K11'], 'profile-extrusion', 'Основной объём — цельная стела без обязательного скульптурного декора; допустима профильная реконструкция по рендеру.', 'ermis-elite-19'),
  one('21', 26, 1300, 900, 120, ['K06', 'K05', 'K10', 'K11'], 'glb-required', 'Фигура святого стоит на отдельном постаменте перед основной плитой.'),
  one('22', 27, 2000, 1200, 200, ['K13', 'K06'], 'procedural-compound', 'Открытая арка состоит из двух стоек, основания и криволинейного верхнего элемента.'),
  {
    id: 'elite-24',
    sourceModel: '24',
    sourcePage: 27,
    variants: [
      { heightMm: 2500, widthMm: 1200, depthMm: 300, materialCodes: ['K05', 'K06', 'K10', 'K11'] },
      { heightMm: 2500, widthMm: 1200, depthMm: 250, materialCodes: ['K13', 'K14'] },
    ],
    strategy: 'procedural-compound',
    rationale: 'Колонны, верхняя перемычка и православный крест требуют составной параметрической геометрии.',
  },
  one('25', 27, 1200, 1500, 250, ['K14'], 'procedural-compound', 'Основная плита заключена в портал из колонн, основания и верхней балки.'),
]

export const ELITE_CATALOG_MODEL_COUNT = ELITE_CATALOG_MODELS.length

export const ELITE_CATALOG_STRATEGY_COUNTS = {
  profileExtrusion: ELITE_CATALOG_MODELS.filter((item) => item.strategy === 'profile-extrusion').length,
  proceduralCompound: ELITE_CATALOG_MODELS.filter((item) => item.strategy === 'procedural-compound').length,
  glbRequired: ELITE_CATALOG_MODELS.filter((item) => item.strategy === 'glb-required').length,
} as const

export function getEliteCatalogModel(sourceModel: string): EliteCatalogModel | null {
  return ELITE_CATALOG_MODELS.find((item) => item.sourceModel === sourceModel) ?? null
}
