import type { SurfaceMaterialId } from './memorialProject.ts'

export const SOURCE_STONE_CODES = [
  'K02',
  'K03',
  'K04',
  'K05',
  'K06',
  'K08',
  'K10',
  'K11',
  'K12',
  'K13',
  'K14',
  'K15',
  'K16',
  'G654',
] as const

export type SourceStoneCode = typeof SOURCE_STONE_CODES[number]

export interface SourceStoneMaterial {
  code: SourceStoneCode
  name: string
  description: string
  sourcePage: number | null
  sourceAuthority: 'documented' | 'unresolved'
  density: string | null
  compressiveStrength: string | null
  porosity: string | null
  waterAbsorption: string | null
  frostResistance: string | null
  durability: string | null
  renderSurfaceId: SurfaceMaterialId
  renderAuthority: 'source-name-approximation' | 'generic-fallback'
}

export const SOURCE_STONE_MATERIALS: readonly SourceStoneMaterial[] = [
  {
    code: 'K02',
    name: 'ROYAL GREEN',
    description: 'Зелёный габбро. Среднезернистая однородная структура, преобладающий размер зёрен 4–7 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,75 г/см³',
    compressiveStrength: '1700 кг/см²',
    porosity: 'не более 2%',
    waterAbsorption: 'не более 0,1%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'granite-green',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K03',
    name: 'BELLA WHITE',
    description: 'Светло-серый гранит. Среднезернистая однородная структура, зёрна и сростки 3–8 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,67 г/см³',
    compressiveStrength: '1500 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%–0,2%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'granite-grey',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K04',
    name: 'MUD GREY',
    description: 'Тёмно-серый габбро. Среднезернистая, местами крупнозернистая структура, зёрна 5–12 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,80 г/см³',
    compressiveStrength: '1600 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'gabbro-matte',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K05',
    name: 'IMPERIAL RED',
    description: 'Красный гранит. Крупнозернистая однородная структура, зёрна и сростки 5–15 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,67 г/см³',
    compressiveStrength: '1500 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%–0,2%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 250–500 лет',
    renderSurfaceId: 'granite-red',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K06',
    name: 'BLACK GABBRO',
    description: 'Чёрный габбро. Мелкозернистая однородная структура, зёрна и сростки 0,5–1,5 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,80 г/см³',
    compressiveStrength: '1600 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'gabbro-polished',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K08',
    name: 'K08',
    description: 'Код встречается в размерных таблицах исходного каталога, но его свойства не приведены на страницах «Порода камня».',
    sourcePage: null,
    sourceAuthority: 'unresolved',
    density: null,
    compressiveStrength: null,
    porosity: null,
    waterAbsorption: null,
    frostResistance: null,
    durability: null,
    renderSurfaceId: 'gabbro-polished',
    renderAuthority: 'generic-fallback',
  },
  {
    code: 'K10',
    name: 'VISAGE BLUE',
    description: 'Голубой гранит-гнейс. Полнокристаллическая средне- и грубозернистая структура, зёрна и сростки 5–12 мм.',
    sourcePage: 4,
    sourceAuthority: 'documented',
    density: '2,70 г/см³',
    compressiveStrength: '1450 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%–0,15%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 250–500 лет',
    renderSurfaceId: 'granite-grey',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K11',
    name: 'INDIAN AURORA',
    description: 'Коричневый гранит-гнейс. Крупно- и среднезернистая неоднородная структура, зёрна и сростки 5–10 мм.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '2,67 г/см³',
    compressiveStrength: '1500 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%–0,2%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'granite-brown',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K12',
    name: 'TAN BRAWN',
    description: 'Коричневый гранит. Крупно- и среднезернистая неоднородная структура.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '2,75 г/см³',
    compressiveStrength: '200 МПа',
    porosity: 'не более 1,4%',
    waterAbsorption: 'не более 0,1%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'granite-brown',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K13',
    name: 'ГАББРО-ДИАБАЗ',
    description: 'Полнокристаллическая мелкозернистая, местами крупнозернистая структура; преобладающий размер зёрен 1–3 мм.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '3,07 г/см³',
    compressiveStrength: '1400 кг/см²',
    porosity: 'не более 1%',
    waterAbsorption: 'не более 0,1%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'gabbro-polished',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K14',
    name: 'ДЫМОВСКИЙ ГРАНИТ',
    description: 'Среднезернистая неоднородная структура.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '2,70 г/см³',
    compressiveStrength: '175 МПа',
    porosity: 'не более 1,7%',
    waterAbsorption: 'не более 0,14%',
    frostResistance: 'более 50 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'granite-brown',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K15',
    name: 'ГРАНАТОВЫЙ АМФИБОЛИТ',
    description: 'Пятнисто-полосчатая окраска с преобладанием чёрного цвета и мелкозернистая структура.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '2,8 г/см³',
    compressiveStrength: '302 МПа',
    porosity: '1%',
    waterAbsorption: '0,12%',
    frostResistance: '100 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'gabbro-polished',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'K16',
    name: 'КУПЕЦКИЙ ГАББРО-НОРИТ',
    description: 'Равномерно мелкозернистая структура; в рисунке присутствуют коричневый и чёрный цвета.',
    sourcePage: 5,
    sourceAuthority: 'documented',
    density: '3 г/см³',
    compressiveStrength: '232 МПа',
    porosity: 'не более 0,44%',
    waterAbsorption: '0,09%',
    frostResistance: '100 циклов',
    durability: 'не менее 500 лет',
    renderSurfaceId: 'gabbro-matte',
    renderAuthority: 'source-name-approximation',
  },
  {
    code: 'G654',
    name: 'G654',
    description: 'Код встречается в размерных таблицах исходного каталога, но его свойства не приведены на страницах «Порода камня».',
    sourcePage: null,
    sourceAuthority: 'unresolved',
    density: null,
    compressiveStrength: null,
    porosity: null,
    waterAbsorption: null,
    frostResistance: null,
    durability: null,
    renderSurfaceId: 'granite-grey',
    renderAuthority: 'generic-fallback',
  },
] as const

const SOURCE_STONE_MAP = new Map(SOURCE_STONE_MATERIALS.map((item) => [item.code, item] as const))

export function normalizeSourceStoneCode(value: unknown): SourceStoneCode | null {
  if (typeof value !== 'string') return null
  const normalized = value.trim().toUpperCase().replace(/^К/, 'K')
  return SOURCE_STONE_MAP.has(normalized as SourceStoneCode)
    ? normalized as SourceStoneCode
    : null
}

export function getSourceStoneMaterial(code: SourceStoneCode): SourceStoneMaterial {
  const material = SOURCE_STONE_MAP.get(code)
  if (!material) throw new Error(`Unknown source stone code: ${code}`)
  return material
}

export function resolveSourceStoneCodes(values: readonly string[]): SourceStoneCode[] {
  const result: SourceStoneCode[] = []
  for (const value of values) {
    const code = normalizeSourceStoneCode(value)
    if (code && !result.includes(code)) result.push(code)
  }
  return result
}
