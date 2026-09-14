import assert from 'node:assert/strict'
import test from 'node:test'
import {
  INSCRIPTION_FONTS,
  MEMORIAL_SYMBOLS,
  PORTRAIT_FRAMES,
  getInscriptionFont,
  getMemorialSymbolName,
  getPortraitFrameName,
} from '../src/domain/personalizationCatalog.ts'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'

test('personalization catalogs have unique stable ids', () => {
  for (const catalog of [PORTRAIT_FRAMES, INSCRIPTION_FONTS, MEMORIAL_SYMBOLS]) {
    const ids = catalog.map((item) => item.id)
    assert.equal(new Set(ids).size, ids.length)
  }
})

test('default stele uses neutral personalization defaults', () => {
  const project = createDefaultProject()
  const stele = project.steles[0]
  assert.equal(stele.portrait.frame, 'oval')
  assert.equal(stele.inscription.fontId, 'classic')
  assert.equal(stele.inscription.symbolId, 'none')
})

test('paired steles preserve independent personalization', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].portrait.frame = 'oval'
  project.steles[0].inscription.fontId = 'classic'
  project.steles[0].inscription.symbolId = 'orthodox-cross'

  project.steles[1].portrait.frame = 'rounded-rect'
  project.steles[1].inscription.fontId = 'modern'
  project.steles[1].inscription.symbolId = 'crescent'

  assert.equal(project.steles[0].inscription.symbolId, 'orthodox-cross')
  assert.equal(project.steles[1].portrait.frame, 'rounded-rect')
  assert.equal(project.steles[1].inscription.fontId, 'modern')
  assert.equal(project.steles[1].inscription.symbolId, 'crescent')
})

test('personalization labels resolve for project specifications and UI', () => {
  assert.equal(getPortraitFrameName('rounded-rect'), 'Скруглённый прямоугольник')
  assert.equal(getInscriptionFont('modern').name, 'Современный')
  assert.equal(getMemorialSymbolName('crescent'), 'Полумесяц')
})
