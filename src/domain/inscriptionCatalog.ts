import type {
  InscriptionSymbolId,
  InscriptionTypographyId,
} from './memorialProject.ts'

export interface InscriptionTypographyDefinition {
  id: InscriptionTypographyId
  name: string
  description: string
  fontFamily: string
  nameWeight: number
  datesWeight: number
  epitaphStyle: 'normal' | 'italic'
  bundledFont: false
}

export interface InscriptionSymbolDefinition {
  id: InscriptionSymbolId
  name: string
  family: 'neutral' | 'christian' | 'muslim' | 'floral'
  procedural: true
  description: string
}

export const INSCRIPTION_TYPOGRAPHY: readonly InscriptionTypographyDefinition[] = [
  {
    id: 'classic-serif',
    name: 'Классическая',
    description: 'Спокойная антиква для традиционных композиций.',
    fontFamily: 'Georgia, "Times New Roman", serif',
    nameWeight: 600,
    datesWeight: 500,
    epitaphStyle: 'italic',
    bundledFont: false,
  },
  {
    id: 'traditional-serif',
    name: 'Традиционная',
    description: 'Более строгая контрастная антиква.',
    fontFamily: '"Times New Roman", Times, serif',
    nameWeight: 700,
    datesWeight: 500,
    epitaphStyle: 'italic',
    bundledFont: false,
  },
  {
    id: 'clean-sans',
    name: 'Современная',
    description: 'Нейтральный гротеск для стекла и минималистичных памятников.',
    fontFamily: 'Arial, Helvetica, sans-serif',
    nameWeight: 600,
    datesWeight: 500,
    epitaphStyle: 'normal',
    bundledFont: false,
  },
  {
    id: 'humanist-sans',
    name: 'Мягкая современная',
    description: 'Гуманистический гротеск с более мягкой пластикой.',
    fontFamily: '"Trebuchet MS", Arial, sans-serif',
    nameWeight: 600,
    datesWeight: 500,
    epitaphStyle: 'italic',
    bundledFont: false,
  },
] as const

export const INSCRIPTION_SYMBOLS: readonly InscriptionSymbolDefinition[] = [
  {
    id: 'none',
    name: 'Без символа',
    family: 'neutral',
    procedural: true,
    description: 'Только текстовая композиция.',
  },
  {
    id: 'orthodox-cross',
    name: 'Православный крест',
    family: 'christian',
    procedural: true,
    description: 'Процедурная восьмиконечная композиция для предварительной визуализации.',
  },
  {
    id: 'latin-cross',
    name: 'Латинский крест',
    family: 'christian',
    procedural: true,
    description: 'Лаконичный крест для предварительной визуализации.',
  },
  {
    id: 'crescent-star',
    name: 'Полумесяц и звезда',
    family: 'muslim',
    procedural: true,
    description: 'Нейтральная исламская символика для предварительной визуализации.',
  },
  {
    id: 'rose',
    name: 'Роза',
    family: 'floral',
    procedural: true,
    description: 'Нейтральный цветочный знак.',
  },
  {
    id: 'laurel',
    name: 'Ветвь',
    family: 'floral',
    procedural: true,
    description: 'Лаконичный растительный декоративный элемент.',
  },
] as const

export function getInscriptionTypography(id: InscriptionTypographyId): InscriptionTypographyDefinition {
  return INSCRIPTION_TYPOGRAPHY.find((item) => item.id === id) ?? INSCRIPTION_TYPOGRAPHY[0]
}

export function getInscriptionSymbol(id: InscriptionSymbolId): InscriptionSymbolDefinition {
  return INSCRIPTION_SYMBOLS.find((item) => item.id === id) ?? INSCRIPTION_SYMBOLS[0]
}
