import type { MonumentShape, PortraitMode, SurfaceMaterialId } from './memorialProject'

export interface MonumentShapeDefinition {
  id: MonumentShape
  name: string
  family: 'neutral' | 'slavic' | 'muslim'
  procedural: true
  description: string
}

export interface MaterialDefinition {
  id: SurfaceMaterialId
  name: string
  kind: 'stone' | 'glass'
  color: string
  roughness: number
  metalness?: number
  clearcoat?: number
  clearcoatRoughness?: number
  transmission?: number
  thickness?: number
  ior?: number
}

export interface PortraitModeDefinition {
  id: PortraitMode
  name: string
  description: string
}

export const MONUMENT_SHAPES: readonly MonumentShapeDefinition[] = [
  { id: 'arch', name: 'Арка', family: 'neutral', procedural: true, description: 'Классическая стела с полукруглым верхом.' },
  { id: 'rectangle', name: 'Прямоугольный', family: 'neutral', procedural: true, description: 'Строгая прямоугольная форма.' },
  { id: 'slant', name: 'Скошенный', family: 'neutral', procedural: true, description: 'Современная асимметричная стела.' },
  { id: 'wave', name: 'Волна', family: 'neutral', procedural: true, description: 'Плавный фигурный верх.' },
  { id: 'heart', name: 'Сердце', family: 'slavic', procedural: true, description: 'Симметричная форма сердца для одиночных и парных композиций.' },
  { id: 'muslim-arch', name: 'Мусульманская арка', family: 'muslim', procedural: true, description: 'Заострённая арочная форма без религиозного декора по умолчанию.' },
] as const

export const MATERIALS: readonly MaterialDefinition[] = [
  { id: 'gabbro-polished', name: 'Габбро — полированный', kind: 'stone', color: '#111315', roughness: 0.16, metalness: 0.02, clearcoat: 0.55, clearcoatRoughness: 0.1 },
  { id: 'gabbro-matte', name: 'Габбро — матовый', kind: 'stone', color: '#1b1c1d', roughness: 0.64, metalness: 0.01, clearcoat: 0.04, clearcoatRoughness: 0.72 },
  { id: 'glass-clear', name: 'Стекло — прозрачное', kind: 'glass', color: '#dbe8e7', roughness: 0.05, transmission: 0.96, thickness: 0.08, ior: 1.45 },
  { id: 'glass-frosted', name: 'Стекло — матовое', kind: 'glass', color: '#d7e2e1', roughness: 0.38, transmission: 0.76, thickness: 0.08, ior: 1.45 },
] as const

export const PORTRAIT_MODES: readonly PortraitModeDefinition[] = [
  { id: 'color', name: 'Цветная печать', description: 'Основной режим для стеклянных памятников и фотопечати.' },
  { id: 'bw', name: 'Ч/Б визуализация', description: 'Нейтральное чёрно-белое представление портрета.' },
  { id: 'engraving', name: 'Имитация гравировки', description: 'Предварительная визуализация лазерной гравировки; не производственный файл.' },
] as const

export function getShapeDefinition(id: MonumentShape): MonumentShapeDefinition {
  const found = MONUMENT_SHAPES.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown monument shape: ${id}`)
  return found
}

export function getMaterialDefinition(id: SurfaceMaterialId): MaterialDefinition {
  const found = MATERIALS.find((item) => item.id === id)
  if (!found) throw new Error(`Unknown material: ${id}`)
  return found
}
