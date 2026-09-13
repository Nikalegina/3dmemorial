import assert from 'node:assert/strict'
import test from 'node:test'
import { createDefaultProject } from '../src/domain/memorialProject.ts'
import { buildProjectSpecification } from '../src/domain/projectSpec.ts'

test('project specification exposes monument and complex without prices', () => {
  const project = createDefaultProject()
  project.projectId = 'TEST-PROJECT'
  project.fence.enabled = true
  project.fence.styleId = 'minimal-black'

  const spec = buildProjectSpecification(project)
  assert.equal(spec.projectId, 'TEST-PROJECT')
  assert.ok(spec.sections.some((section) => section.title === 'Памятник'))
  assert.ok(spec.sections.some((section) => section.rows.some((row) => row.value === 'Минималистичная ограда')))

  const serialized = JSON.stringify(spec).toLowerCase()
  assert.equal(serialized.includes('цена'), false)
  assert.equal(serialized.includes('стоимость:'), false)
})

test('project specification keeps inscription placeholders explicit', () => {
  const project = createDefaultProject()
  project.inscription.epitaph = ''
  const spec = buildProjectSpecification(project)
  const inscription = spec.sections.find((section) => section.title === 'Портрет и надпись')
  assert.equal(inscription?.rows.find((row) => row.label === 'Эпитафия')?.value, '—')
})
