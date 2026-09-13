import assert from 'node:assert/strict'
import test from 'node:test'
import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_MODES, getMaterialDefinition, getShapeDefinition } from '../src/domain/catalog.ts'
import { validateProjectCompatibility } from '../src/domain/compatibility.ts'
import { createDefaultProject } from '../src/domain/memorialProject.ts'
import { PROJECT_PRESETS } from '../src/domain/presets.ts'

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

test('material catalog separates stone and glass surfaces', () => {
  assert.ok(MATERIALS.some((item) => item.kind === 'stone'))
  assert.ok(MATERIALS.some((item) => item.kind === 'glass'))
  assert.equal(getMaterialDefinition('glass-clear').kind, 'glass')
})

test('presets create valid current-schema projects', () => {
  for (const preset of PROJECT_PRESETS) {
    const project = preset.create()
    assert.equal(project.schemaVersion, 2)
  }
})

test('compatibility validation catches a monument that is too wide for its plot', () => {
  const project = createDefaultProject()
  project.plot.widthM = 1.2
  project.monument.widthM = 1.1
  const diagnostics = validateProjectCompatibility(project)
  assert.ok(diagnostics.some((item) => item.code === 'MONUMENT_TOO_WIDE_FOR_PLOT' && item.severity === 'error'))
})
