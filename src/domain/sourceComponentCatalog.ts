export type SourceComponentMaterialCode =
  | 'K02'
  | 'K03'
  | 'K04'
  | 'K05'
  | 'K06'
  | 'K10'
  | 'K11'
  | 'K12'
  | 'K13'
  | 'K14'
  | 'KW'
  | 'KT'
  | 'KB'

export type SourceComponentCategory =
  | 'furniture-set'
  | 'grave-slab'
  | 'paving'
  | 'vase'
  | 'accessory'
  | 'fence'

export interface SourceComponentPart {
  sourceName: string
  dimensionsMm: readonly [number, number] | readonly [number, number, number]
  materialCodes: readonly SourceComponentMaterialCode[]
}

export interface SourceComponentProduct {
  id: string
  sourceSku: string | null
  sourcePage: 27 | 28 | 29 | 30
  category: SourceComponentCategory
  name: string
  parts: readonly SourceComponentPart[]
  visualNotes: string
}

const furnitureParts = [
  { sourceName: 'Столешница', dimensionsMm: [500, 500, 30], materialCodes: ['K06'] },
  { sourceName: 'Опора столешницы', dimensionsMm: [750, 150, 150], materialCodes: ['K06'] },
  { sourceName: 'Скамья', dimensionsMm: [800, 300, 30], materialCodes: ['K06'] },
  { sourceName: 'Опора скамьи', dimensionsMm: [420, 140, 140], materialCodes: ['K06'] },
] as const satisfies readonly SourceComponentPart[]

export const SOURCE_COMPONENT_PRODUCTS = [
  {
    id: 'ermis-tsk50',
    sourceSku: 'TSK50',
    sourcePage: 27,
    category: 'furniture-set',
    name: 'Стол и лавка TSK50',
    parts: furnitureParts,
    visualNotes: 'Квадратная столешница и точёные каменные опоры.',
  },
  {
    id: 'ermis-tsr50',
    sourceSku: 'TSR50',
    sourcePage: 27,
    category: 'furniture-set',
    name: 'Стол и лавка TSR50',
    parts: furnitureParts,
    visualNotes: 'Круглая столешница и точёные каменные опоры.',
  },
  {
    id: 'ermis-grave-slab-1000x500',
    sourceSku: null,
    sourcePage: 28,
    category: 'grave-slab',
    name: 'Надгробная плита 1000 × 500',
    parts: [
      {
        sourceName: 'Надгробная плита',
        dimensionsMm: [1000, 500],
        materialCodes: ['K06', 'K13', 'K02', 'K05', 'K10', 'K11', 'K14'],
      },
    ],
    visualNotes: 'Источник задаёт только длину и ширину; толщина в каталоге не указана.',
  },
  {
    id: 'ermis-grave-slab-1200x600',
    sourceSku: null,
    sourcePage: 28,
    category: 'grave-slab',
    name: 'Надгробная плита 1200 × 600',
    parts: [
      {
        sourceName: 'Надгробная плита',
        dimensionsMm: [1200, 600],
        materialCodes: ['K06', 'K13', 'K05', 'K10', 'K11', 'K14'],
      },
    ],
    visualNotes: 'Источник задаёт только длину и ширину; толщина в каталоге не указана.',
  },
  {
    id: 'ermis-paving-600x400',
    sourceSku: null,
    sourcePage: 28,
    category: 'paving',
    name: 'Плитка 600 × 400',
    parts: [
      {
        sourceName: 'Плитка',
        dimensionsMm: [600, 400],
        materialCodes: ['K06', 'K13', 'K14'],
      },
    ],
    visualNotes: 'Каталожный формат плитки; толщина в источнике не указана.',
  },
  {
    id: 'ermis-paving-600x300',
    sourceSku: null,
    sourcePage: 28,
    category: 'paving',
    name: 'Плитка 600 × 300',
    parts: [
      {
        sourceName: 'Плитка',
        dimensionsMm: [600, 300],
        materialCodes: ['K06', 'K13', 'K02', 'K05', 'K03', 'K04', 'K14', 'K12', 'KW', 'KT', 'KB'],
      },
    ],
    visualNotes: 'Каталожный формат плитки; KW/KT/KB сохранены как исходные коды без придуманной расшифровки.',
  },
  {
    id: 'ermis-vase-600x260x260',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 600 × 260 × 260',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [600, 260, 260], materialCodes: ['K06'] }],
    visualNotes: 'Высокая точёная гранитная ваза.',
  },
  {
    id: 'ermis-vase-500x190x190',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 500 × 190 × 190',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [500, 190, 190], materialCodes: ['K06'] }],
    visualNotes: 'Точёная гранитная ваза.',
  },
  {
    id: 'ermis-vase-400x170x170',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 400 × 170 × 170',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [400, 170, 170], materialCodes: ['K06'] }],
    visualNotes: 'Точёная гранитная ваза.',
  },
  {
    id: 'ermis-vase-300x130x130',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 300 × 130 × 130',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [300, 130, 130], materialCodes: ['K06', 'K02', 'K05', 'K10', 'K11'] }],
    visualNotes: 'Точёная гранитная ваза.',
  },
  {
    id: 'ermis-vase-250x100x100',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 250 × 100 × 100',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [250, 100, 100], materialCodes: ['K06', 'K02', 'K05', 'K10', 'K11'] }],
    visualNotes: 'Точёная гранитная ваза.',
  },
  {
    id: 'ermis-vase-200x100x100',
    sourceSku: null,
    sourcePage: 28,
    category: 'vase',
    name: 'Ваза 200 × 100 × 100',
    parts: [{ sourceName: 'Ваза', dimensionsMm: [200, 100, 100], materialCodes: ['K06', 'K02', 'K05', 'K10', 'K11'] }],
    visualNotes: 'Точёная гранитная ваза.',
  },
  {
    id: 'ermis-lampada-300x150x150',
    sourceSku: null,
    sourcePage: 28,
    category: 'accessory',
    name: 'Лампада 300 × 150 × 150',
    parts: [{ sourceName: 'Лампада', dimensionsMm: [300, 150, 150], materialCodes: ['K06', 'K05'] }],
    visualNotes: 'Каменная лампада с открытыми окнами и верхней крышкой.',
  },
  {
    id: 'ermis-baluster-350x100x100',
    sourceSku: null,
    sourcePage: 28,
    category: 'accessory',
    name: 'Балясина 350 × 100 × 100',
    parts: [{ sourceName: 'Балясина', dimensionsMm: [350, 100, 100], materialCodes: ['K06'] }],
    visualNotes: 'Точёная гранитная балясина.',
  },
  {
    id: 'ermis-baluster-300x100x100',
    sourceSku: null,
    sourcePage: 28,
    category: 'accessory',
    name: 'Балясина 300 × 100 × 100',
    parts: [{ sourceName: 'Балясина', dimensionsMm: [300, 100, 100], materialCodes: ['K06'] }],
    visualNotes: 'Точёная гранитная балясина.',
  },
  {
    id: 'ermis-sphere-140x110x100',
    sourceSku: null,
    sourcePage: 28,
    category: 'accessory',
    name: 'Шар 140 × 110 × 100',
    parts: [{ sourceName: 'Шар', dimensionsMm: [140, 110, 100], materialCodes: ['K06'] }],
    visualNotes: 'Полированный каменный шар на малой подставке.',
  },
  {
    id: 'ermis-sphere-140x90x90',
    sourceSku: null,
    sourcePage: 28,
    category: 'accessory',
    name: 'Шар 140 × 90 × 90',
    parts: [{ sourceName: 'Шар', dimensionsMm: [140, 90, 90], materialCodes: ['K06'] }],
    visualNotes: 'Полированный каменный шар на малой подставке.',
  },
  {
    id: 'ermis-fence-f01',
    sourceSku: 'F-01',
    sourcePage: 29,
    category: 'fence',
    name: 'Гранитная ограда F-01',
    parts: [
      { sourceName: 'Столбик', dimensionsMm: [450, 120, 120], materialCodes: ['K06'] },
      { sourceName: 'Крыло', dimensionsMm: [600, 400, 70], materialCodes: ['K06'] },
      { sourceName: 'Шар на подставке', dimensionsMm: [140, 110, 110], materialCodes: ['K06'] },
    ],
    visualNotes: 'Сплошные каменные крылья с асимметричным фигурным верхом.',
  },
  {
    id: 'ermis-fence-f02',
    sourceSku: 'F-02',
    sourcePage: 29,
    category: 'fence',
    name: 'Гранитная ограда F-02',
    parts: [
      { sourceName: 'Столбик', dimensionsMm: [450, 120, 120], materialCodes: ['K06'] },
      { sourceName: 'Крыло', dimensionsMm: [600, 400, 70], materialCodes: ['K06'] },
      { sourceName: 'Шар на подставке', dimensionsMm: [140, 110, 110], materialCodes: ['K06'] },
    ],
    visualNotes: 'Сплошные каменные крылья с более плавным волнообразным верхом.',
  },
  {
    id: 'ermis-fence-f03',
    sourceSku: 'F-03',
    sourcePage: 30,
    category: 'fence',
    name: 'Гранитная ограда F-03',
    parts: [
      { sourceName: 'Парапет', dimensionsMm: [900, 120, 120], materialCodes: ['K06'] },
      { sourceName: 'Столбик', dimensionsMm: [450, 120, 120], materialCodes: ['K06'] },
      { sourceName: 'Соединительная балка', dimensionsMm: [900, 120, 30], materialCodes: ['K06'] },
      { sourceName: 'Балясина', dimensionsMm: [300, 100, 100], materialCodes: ['K06'] },
      { sourceName: 'Шар на подставке', dimensionsMm: [140, 110, 110], materialCodes: ['K06'] },
    ],
    visualNotes: 'Открытая каменная ограда: нижний парапет, верхняя балка и балясины между столбами.',
  },
  {
    id: 'ermis-fence-f04',
    sourceSku: 'F-04',
    sourcePage: 30,
    category: 'fence',
    name: 'Гранитная ограда F-04',
    parts: [
      { sourceName: 'Столбик', dimensionsMm: [300, 120, 120], materialCodes: ['K06', 'K03', 'K13'] },
      { sourceName: 'Столбик', dimensionsMm: [1100, 120, 70], materialCodes: ['K06', 'K03', 'K13'] },
    ],
    visualNotes: 'Источник обе позиции называет «Столбик»; визуально длинная деталь используется как горизонтальный элемент.',
  },
] as const satisfies readonly SourceComponentProduct[]

export type SourceComponentProductId = typeof SOURCE_COMPONENT_PRODUCTS[number]['id']

const PRODUCT_IDS = new Set<string>(SOURCE_COMPONENT_PRODUCTS.map((item) => item.id))

export const SOURCE_COMPONENT_PRODUCT_COUNT = SOURCE_COMPONENT_PRODUCTS.length

export function isSourceComponentProductId(value: string): value is SourceComponentProductId {
  return PRODUCT_IDS.has(value)
}

export function getSourceComponentProduct(id: SourceComponentProductId): SourceComponentProduct {
  const product = SOURCE_COMPONENT_PRODUCTS.find((item) => item.id === id)
  if (!product) throw new Error(`Unknown source component product: ${id}`)
  return product
}

export function formatSourcePartDimensions(part: SourceComponentPart): string {
  return part.dimensionsMm.join(' × ') + ' мм'
}
