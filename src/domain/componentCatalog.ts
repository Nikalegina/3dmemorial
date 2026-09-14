export const FLOWER_BED_STYLES = [
  { id: 'open-granite', name: 'Открытый гранитный', kind: 'soil' },
  { id: 'closed-granite', name: 'Закрытый гранитный', kind: 'soil' },
  {
    id: 'glass-panel-granite-frame',
    name: 'Стеклянная панель в гранитной рамке',
    kind: 'glass-panel',
  },
  {
    id: 'ermis-grave-slab-1000x500',
    name: 'Надгробная плита 1000 × 500',
    kind: 'grave-slab',
    sourceComponentId: 'ermis-grave-slab-1000x500',
    slabSizeM: [1, 0.5],
  },
  {
    id: 'ermis-grave-slab-1200x600',
    name: 'Надгробная плита 1200 × 600',
    kind: 'grave-slab',
    sourceComponentId: 'ermis-grave-slab-1200x600',
    slabSizeM: [1.2, 0.6],
  },
] as const

export const PAVING_STYLES = [
  { id: 'stone-grey', name: 'Серая плитка', color: '#85827b', roughness: 0.8 },
  { id: 'granite-dark', name: 'Тёмный гранит', color: '#343638', roughness: 0.34 },
  { id: 'gravel-light', name: 'Светлая отсыпка', color: '#b7ad98', roughness: 1 },
  {
    id: 'ermis-paving-600x400',
    name: 'Каталожная плитка 600 × 400',
    color: '#343638',
    roughness: 0.34,
    sourceComponentId: 'ermis-paving-600x400',
    tileSizeM: [0.6, 0.4],
  },
  {
    id: 'ermis-paving-600x300',
    name: 'Каталожная плитка 600 × 300',
    color: '#343638',
    roughness: 0.34,
    sourceComponentId: 'ermis-paving-600x300',
    tileSizeM: [0.6, 0.3],
  },
] as const

export const BORDER_STYLES = [
  { id: 'granite-dark', name: 'Гранитный бордюр', color: '#292b2d', roughness: 0.32 },
  { id: 'concrete-grey', name: 'Серый бордюр', color: '#777773', roughness: 0.82 },
] as const

export const FENCE_STYLES = [
  { id: 'classic-black', name: 'Классическая ограда', heightM: 0.5, color: '#242424', kind: 'metal' },
  { id: 'minimal-black', name: 'Минималистичная ограда', heightM: 0.38, color: '#1e1f20', kind: 'metal' },
  {
    id: 'ermis-fence-f01',
    name: 'Гранитная ограда F-01',
    heightM: 0.45,
    color: '#222426',
    kind: 'stone-f01',
    sourceComponentId: 'ermis-fence-f01',
  },
  {
    id: 'ermis-fence-f02',
    name: 'Гранитная ограда F-02',
    heightM: 0.45,
    color: '#222426',
    kind: 'stone-f02',
    sourceComponentId: 'ermis-fence-f02',
  },
  {
    id: 'ermis-fence-f03',
    name: 'Гранитная ограда F-03',
    heightM: 0.45,
    color: '#222426',
    kind: 'stone-f03',
    sourceComponentId: 'ermis-fence-f03',
  },
  {
    id: 'ermis-fence-f04',
    name: 'Гранитная ограда F-04',
    heightM: 0.3,
    color: '#222426',
    kind: 'stone-f04',
    sourceComponentId: 'ermis-fence-f04',
  },
] as const

export const BENCH_STYLES = [
  { id: 'wood-classic', name: 'Дерево + металл', seatColor: '#5e4632' },
  { id: 'granite-bench', name: 'Гранитная лавка', seatColor: '#343638' },
  {
    id: 'ermis-tsk50-bench',
    name: 'Лавка TSK50',
    seatColor: '#242628',
    sourceComponentId: 'ermis-tsk50',
    seatSizeM: [0.8, 0.03, 0.3],
    supportHeightM: 0.42,
    supportDiameterM: 0.14,
  },
  {
    id: 'ermis-tsr50-bench',
    name: 'Лавка TSR50',
    seatColor: '#242628',
    sourceComponentId: 'ermis-tsr50',
    seatSizeM: [0.8, 0.03, 0.3],
    supportHeightM: 0.42,
    supportDiameterM: 0.14,
  },
] as const

export const TABLE_STYLES = [
  { id: 'round-granite', name: 'Круглый гранитный', shape: 'round' },
  { id: 'square-granite', name: 'Квадратный гранитный', shape: 'square' },
  {
    id: 'ermis-tsk50-table',
    name: 'Стол TSK50',
    shape: 'square',
    sourceComponentId: 'ermis-tsk50',
    topSizeM: [0.5, 0.5, 0.03],
    supportHeightM: 0.75,
    supportDiameterM: 0.15,
  },
  {
    id: 'ermis-tsr50-table',
    name: 'Стол TSR50',
    shape: 'round',
    sourceComponentId: 'ermis-tsr50',
    topSizeM: [0.5, 0.5, 0.03],
    supportHeightM: 0.75,
    supportDiameterM: 0.15,
  },
] as const

export const VASE_STYLES = [
  { id: 'classic-vase', name: 'Классическая ваза', heightM: 0.34, kind: 'vase' },
  { id: 'tall-vase', name: 'Высокая ваза', heightM: 0.44, kind: 'vase' },
  { id: 'ermis-vase-600x260x260', name: 'Ваза 600 × 260 × 260', heightM: 0.6, kind: 'vase', diameterM: 0.26, sourceComponentId: 'ermis-vase-600x260x260' },
  { id: 'ermis-vase-500x190x190', name: 'Ваза 500 × 190 × 190', heightM: 0.5, kind: 'vase', diameterM: 0.19, sourceComponentId: 'ermis-vase-500x190x190' },
  { id: 'ermis-vase-400x170x170', name: 'Ваза 400 × 170 × 170', heightM: 0.4, kind: 'vase', diameterM: 0.17, sourceComponentId: 'ermis-vase-400x170x170' },
  { id: 'ermis-vase-300x130x130', name: 'Ваза 300 × 130 × 130', heightM: 0.3, kind: 'vase', diameterM: 0.13, sourceComponentId: 'ermis-vase-300x130x130' },
  { id: 'ermis-vase-250x100x100', name: 'Ваза 250 × 100 × 100', heightM: 0.25, kind: 'vase', diameterM: 0.1, sourceComponentId: 'ermis-vase-250x100x100' },
  { id: 'ermis-vase-200x100x100', name: 'Ваза 200 × 100 × 100', heightM: 0.2, kind: 'vase', diameterM: 0.1, sourceComponentId: 'ermis-vase-200x100x100' },
  { id: 'ermis-lampada-300x150x150', name: 'Лампада 300 × 150 × 150', heightM: 0.3, kind: 'lampada', diameterM: 0.15, sourceComponentId: 'ermis-lampada-300x150x150' },
  { id: 'ermis-baluster-350x100x100', name: 'Балясина 350 × 100 × 100', heightM: 0.35, kind: 'baluster', diameterM: 0.1, sourceComponentId: 'ermis-baluster-350x100x100' },
  { id: 'ermis-baluster-300x100x100', name: 'Балясина 300 × 100 × 100', heightM: 0.3, kind: 'baluster', diameterM: 0.1, sourceComponentId: 'ermis-baluster-300x100x100' },
  { id: 'ermis-sphere-140x110x100', name: 'Шар 140 × 110 × 100', heightM: 0.14, kind: 'sphere', diameterM: 0.11, baseDepthM: 0.1, sourceComponentId: 'ermis-sphere-140x110x100' },
  { id: 'ermis-sphere-140x90x90', name: 'Шар 140 × 90 × 90', heightM: 0.14, kind: 'sphere', diameterM: 0.09, baseDepthM: 0.09, sourceComponentId: 'ermis-sphere-140x90x90' },
] as const

export type FlowerBedStyleId = typeof FLOWER_BED_STYLES[number]['id']
export type PavingStyleId = typeof PAVING_STYLES[number]['id']
export type BorderStyleId = typeof BORDER_STYLES[number]['id']
export type FenceStyleId = typeof FENCE_STYLES[number]['id']
export type BenchStyleId = typeof BENCH_STYLES[number]['id']
export type TableStyleId = typeof TABLE_STYLES[number]['id']
export type VaseStyleId = typeof VASE_STYLES[number]['id']
export type FurnitureSide = 'left' | 'right'
export type VasePlacement = 'left' | 'right' | 'pair'
export type GateSide = 'front' | 'left' | 'right'
