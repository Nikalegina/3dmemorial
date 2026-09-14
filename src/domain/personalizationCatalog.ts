import type { InscriptionFontId, MemorialSymbolId, PortraitFrameId } from './memorialProject.ts'

export const PORTRAIT_FRAMES: readonly { id: PortraitFrameId; name: string }[] = [
  { id: 'oval', name: 'Овал' },
  { id: 'rounded-rect', name: 'Скруглённый прямоугольник' },
  { id: 'rectangle', name: 'Прямоугольник' },
]

export const INSCRIPTION_FONTS: readonly {
  id: InscriptionFontId
  name: string
  cssFamily: string
}[] = [
  { id: 'classic', name: 'Классический', cssFamily: 'Georgia, "Times New Roman", serif' },
  { id: 'roman', name: 'Римский', cssFamily: '"Times New Roman", Times, serif' },
  { id: 'modern', name: 'Современный', cssFamily: 'Arial, "Helvetica Neue", sans-serif' },
]

export const MEMORIAL_SYMBOLS: readonly { id: MemorialSymbolId; name: string }[] = [
  { id: 'none', name: 'Без символа' },
  { id: 'orthodox-cross', name: 'Православный крест' },
  { id: 'latin-cross', name: 'Крест' },
  { id: 'crescent', name: 'Полумесяц' },
]

export function getInscriptionFont(id: InscriptionFontId) {
  return INSCRIPTION_FONTS.find((item) => item.id === id) ?? INSCRIPTION_FONTS[0]
}

export function getPortraitFrameName(id: PortraitFrameId): string {
  return PORTRAIT_FRAMES.find((item) => item.id === id)?.name ?? id
}

export function getMemorialSymbolName(id: MemorialSymbolId): string {
  return MEMORIAL_SYMBOLS.find((item) => item.id === id)?.name ?? id
}
