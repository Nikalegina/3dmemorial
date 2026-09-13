import assert from 'node:assert/strict'
import test from 'node:test'
import { MONUMENT_SHAPES, PORTRAIT_MODES, getShapeDefinition } from '../src/domain/catalog.ts'
import { validateProjectCompatibility } from '../src/domain/compatibility.ts'
import { createDefaultProject } from '../src/domain/memorialProject.ts'

test('shape catalog has unique ids and expected first-party families', () => {
  const ids = MONUMENT_SHAPES.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.ok(MONUMENT_SHAPES.some((item) => item.family === 'muslim'))
  assert.ok(MONUMENT_SHAPES.some((item) => item.family === 'slavic'))
  assert.equal(getShapeDefinition('arch').name, 'Арка')
})

test('portrait modes include color, black-and-white and engraving preview', () => {
  assert.deepEqual(PORTRAIT_MODES.map((item) => item.id), ['color', 'bw', 'engraving'])
})

test('compatibility validation catches a monument that is too wide for its plot', () => {
  const project = createDefaultProject()
  project.plot.widthM = 1.2
  project.monument.widthM = 1.1
  const diagnostics = validateProjectCompatibility(project)
  assert.ok(diagnostics.some((item) => item.code === 'MONUMENT_TOO_WIDE_FOR_PLOT' && item.severity === 'error'))
})
