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
  { id: 'rectangle', name: 'Прямоугольный', family: 'neutral', procedural: true, description: 'Строгая прямоугольная форма.' },
  { id: 'rounded-rectangle', name: 'Скруглённый прямоугольник', family: 'neutral', procedural: true, description: 'Прямоугольная стела с мягкими верхними углами.' },
  { id: 'arch', name: 'Арка', family: 'neutral', procedural: true, description: 'Классическая стела с полукруглым верхом.' },
  { id: 'dome', name: 'Купол', family: 'neutral', procedural: true, description: 'Высокий плавный купольный профиль.' },
  { id: 'slant', name: 'Скошенный', family: 'neutral', procedural: true, description: 'Современная асимметричная стела.' },
  { id: 'bevel-left', name: 'Скос влево', family: 'neutral', procedural: true, description: 'Геометрический левый скос.' },
  { id: 'bevel-right', name: 'Скос вправо', family: 'neutral', procedural: true, description: 'Геометрический правый скос.' },
  { id: 'wave', name: 'Волна', family: 'neutral', procedural: true, description: 'Плавный фигурный верх.' },
  { id: 'ogee', name: 'Фигурная классика', family: 'slavic', procedural: true, description: 'Симметричный профиль с мягкими S-образными плечами.' },
  { id: 'shield', name: 'Щит', family: 'neutral', procedural: true, description: 'Строгий профиль с центральным подъёмом.' },
  { id: 'book', name: 'Книга', family: 'slavic', procedural: true, description: 'Верхняя линия напоминает раскрытую книгу.' },
  { id: 'teardrop', name: 'Капля', family: 'neutral', procedural: true, description: 'Вытянутый плавный профиль с верхней точкой.' },
  { id: 'heart', name: 'Сердце', family: 'slavic', procedural: true, description: 'Симметричная форма сердца для памятных композиций.' },
  { id: 'muslim-arch', name: 'Мусульманская арка', family: 'muslim', procedural: true, description: 'Заострённая арочная форма без религиозного декора по умолчанию.' },
  { id: 'muslim-dome', name: 'Восточный купол', family: 'muslim', procedural: true, description: 'Выраженный стрельчатый купольный профиль.' },
] as const

export const MATERIALS: readonly MaterialDefinition[] = [
  { id: 'gabbro-polished', name: 'Габбро — полированный', kind: 'stone', color: '#111315', roughness: 0.16, metalness: 0.02, clearcoat: 0.55, clearcoatRoughness: 0.1 },
  { id: 'gabbro-matte', name: 'Габбро — матовый', kind: 'stone', color: '#1b1c1d', roughness: 0.64, metalness: 0.01, clearcoat: 0.04, clearcoatRoughness: 0.72 },
  { id: 'granite-grey', name: 'Гранит — серый', kind: 'stone', color: '#676866', roughness: 0.34, metalness: 0.01, clearcoat: 0.28, clearcoatRoughness: 0.18 },
  { id: 'granite-red', name: 'Гранит — красный', kind: 'stone', color: '#6e3532', roughness: 0.32, metalness: 0.01, clearcoat: 0.3, clearcoatRoughness: 0.18 },
  { id: 'granite-brown', name: 'Гранит — коричневый', kind: 'stone', color: '#514037', roughness: 0.36, metalness: 0.01, clearcoat: 0.26, clearcoatRoughness: 0.2 },
  { id: 'granite-green', name: 'Гранит — зелёный', kind: 'stone', color: '#31483d', roughness: 0.34, metalness: 0.01, clearcoat: 0.28, clearcoatRoughness: 0.18 },
  { id: 'glass-clear', name: 'Стекло — прозрачное', kind: 'glass', color: '#dbe8e7', roughness: 0.05, transmission: 0.96, thickness: 0.08, ior: 1.45 },
  { id: 'glass-frosted', name: 'Стекло — матовое', kind: 'glass', color: '#d7e2e1', roughness: 0.38, transmission: 0.76, thickness: 0.08, ior: 1.45 },
  { id: 'glass-smoke', name: 'Стекло — дымчатое', kind: 'glass', color: '#687277', roughness: 0.09, transmission: 0.82, thickness: 0.09, ior: 1.45 },
  { id: 'glass-bronze', name: 'Стекло — бронзовое', kind: 'glass', color: '#8a735c', roughness: 0.1, transmission: 0.8, thickness: 0.09, ior: 1.45 },
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
