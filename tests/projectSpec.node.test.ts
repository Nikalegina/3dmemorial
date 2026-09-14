import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'
import { buildProjectSpecification } from '../src/domain/projectSpec.ts'

test('single project specification exposes monument, inscription design and complex without prices', () => {
  const project = createDefaultProject()
  project.projectId = 'TEST-PROJECT'
  project.fence.enabled = true
  project.fence.styleId = 'minimal-black'
  project.steles[0].inscription.typographyId = 'clean-sans'
  project.steles[0].inscription.symbolId = 'laurel'
  project.steles[0].inscription.symbolPlacement = 'bottom'

  const spec = buildProjectSpecification(project)
  assert.equal(spec.projectId, 'TEST-PROJECT')
  assert.ok(spec.sections.some((section) => section.title === 'Памятник'))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.value === 'Минималистичная ограда')))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.label === 'Стиль текста' && row.value === 'Современная')))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.label === 'Символ' && row.value === 'Ветвь')))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.label === 'Положение символа' && row.value === 'Под текстом')))

  const serialized = JSON.stringify(spec).toLowerCase()
  assert.equal(serialized.includes('цена'), false)
  assert.equal(serialized.includes('стоимость:'), false)
})

test('paired project specification lists both memorial subjects independently', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].inscription.name = 'ПЕРВЫЙ'
  project.steles[1].inscription.name = 'ВТОРОЙ'
  project.steles[1].inscription.symbolId = 'crescent-star'
  const spec = buildProjectSpecification(project)

  assert.ok(spec.sections.some((section) => section.title === 'Памятник 1'))
  assert.ok(spec.sections.some((section) => section.title === 'Памятник 2'))
  assert.ok(spec.sections.some((section) => section.title === 'Портрет и надпись 1' && section.rows.some((row) => row.value === 'ПЕРВЫЙ')))
  assert.ok(spec.sections.some((section) => section.title === 'Портрет и надпись 2' && section.rows.some((row) => row.value === 'ВТОРОЙ')))
  assert.ok(spec.sections.some((section) => section.title === 'Портрет и надпись 2' && section.rows.some((row) => row.value === 'Полумесяц и звезда')))
})

test('project specification keeps inscription placeholders explicit', () => {
  const project = createDefaultProject()
  project.steles[0].inscription.epitaph = ''
  const spec = buildProjectSpecification(project)
  const inscription = spec.sections.find((section) => section.title === 'Портрет и надпись')
  assert.equal(inscription?.rows.find((row) => row.label === 'Эпитафия')?.value, '—')
})
