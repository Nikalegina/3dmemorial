import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getInscriptionSymbol,
  getInscriptionTypography,
  INSCRIPTION_SYMBOLS,
  INSCRIPTION_TYPOGRAPHY,
} from '../src/domain/inscriptionCatalog.ts'

test('typography catalog uses unique system-font profiles without bundled font binaries', () => {
  const ids = INSCRIPTION_TYPOGRAPHY.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(INSCRIPTION_TYPOGRAPHY.length, 4)
  assert.ok(INSCRIPTION_TYPOGRAPHY.every((item) => item.bundledFont === false))
  assert.equal(getInscriptionTypography('classic-serif').name, 'Классическая')
})

test('symbol catalog is unique, procedural and neutral by default', () => {
  const ids = INSCRIPTION_SYMBOLS.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(INSCRIPTION_SYMBOLS[0].id, 'none')
  assert.ok(INSCRIPTION_SYMBOLS.every((item) => item.procedural))
  assert.equal(getInscriptionSymbol('crescent-star').family, 'muslim')
  assert.equal(getInscriptionSymbol('orthodox-cross').family, 'christian')
})
