export const PAVING_STYLES = [
  { id: 'stone-grey', name: 'Серая плитка', color: '#85827b', roughness: 0.8 },
  { id: 'granite-dark', name: 'Тёмный гранит', color: '#343638', roughness: 0.34 },
  { id: 'gravel-light', name: 'Светлая отсыпка', color: '#b7ad98', roughness: 1 },
] as const

export const BORDER_STYLES = [
  { id: 'granite-dark', name: 'Гранитный бордюр', color: '#292b2d', roughness: 0.32 },
  { id: 'concrete-grey', name: 'Серый бордюр', color: '#777773', roughness: 0.82 },
] as const

export const FENCE_STYLES = [
  { id: 'classic-black', name: 'Классическая ограда', heightM: 0.5, color: '#242424' },
  { id: 'minimal-black', name: 'Минималистичная ограда', heightM: 0.38, color: '#1e1f20' },
] as const

export const BENCH_STYLES = [
  { id: 'wood-classic', name: 'Дерево + металл', seatColor: '#5e4632' },
  { id: 'granite-bench', name: 'Гранитная лавка', seatColor: '#343638' },
] as const

export const TABLE_STYLES = [
  { id: 'round-granite', name: 'Круглый гранитный', shape: 'round' },
  { id: 'square-granite', name: 'Квадратный гранитный', shape: 'square' },
] as const

export const VASE_STYLES = [
  { id: 'classic-vase', name: 'Классическая ваза', heightM: 0.38 },
  { id: 'tall-vase', name: 'Высокая ваза', heightM: 0.5 },
] as const

export type PavingStyleId = typeof PAVING_STYLES[number]['id']
export type BorderStyleId = typeof BORDER_STYLES[number]['id']
export type FenceStyleId = typeof FENCE_STYLES[number]['id']
export type BenchStyleId = typeof BENCH_STYLES[number]['id']
export type TableStyleId = typeof TABLE_STYLES[number]['id']
export type VaseStyleId = typeof VASE_STYLES[number]['id']
export type FurnitureSide = 'left' | 'right'
export type VasePlacement = 'left' | 'right' | 'pair'
export type GateSide = 'front' | 'left' | 'right'
