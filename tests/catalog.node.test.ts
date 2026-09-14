import assert from 'node:assert/strict'
import test from 'node:test'
import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_MODES, getMaterialDefinition, getShapeDefinition } from '../src/domain/catalog.ts'
import { validateProjectCompatibility } from '../src/domain/compatibility.ts'
import { createDefaultProject, normalizeProject, withLayout } from '../src/domain/memorialProject.ts'
import { PROJECT_PRESETS } from '../src/domain/presets.ts'

test('shape catalog has unique ids, fifteen owned profiles and expected families', () => {
  const ids = MONUMENT_SHAPES.map((item) => item.id)
  assert.equal(new Set(ids).size, ids.length)
  assert.equal(MONUMENT_SHAPES.length, 15)
  assert.ok(MONUMENT_SHAPES.some((item) => item.family === 'muslim'))
  assert.ok(MONUMENT_SHAPES.some((item) => item.family === 'slavic'))
  assert.equal(getShapeDefinition('arch').name, 'Арка')
  assert.equal(getShapeDefinition('book').name, 'Книга')
})

test('portrait modes include color, black-and-white and engraving preview', () => {
  assert.deepEqual(PORTRAIT_MODES.map((item) => item.id), ['color', 'bw', 'engraving'])
})

test('material catalog separates expanded stone and glass surfaces', () => {
  assert.ok(MATERIALS.filter((item) => item.kind === 'stone').length >= 6)
  assert.ok(MATERIALS.filter((item) => item.kind === 'glass').length >= 4)
  assert.equal(getMaterialDefinition('glass-clear').kind, 'glass')
  assert.equal(getMaterialDefinition('granite-red').kind, 'stone')
})

test('normalization preserves compatible colored granite and rejects glass on stone construction', () => {
  const project = createDefaultProject()
  project.steles[0].monument.surfaceId = 'granite-green'
  assert.equal(normalizeProject(project).steles[0].monument.surfaceId, 'granite-green')

  project.steles[0].monument.surfaceId = 'glass-smoke'
  assert.equal(normalizeProject(project).steles[0].monument.surfaceId, 'gabbro-polished')
})

test('presets create valid current-schema projects including paired variants', () => {
  for (const preset of PROJECT_PRESETS) {
    const project = preset.create()
    assert.equal(project.schemaVersion, 5)
  }
  assert.ok(PROJECT_PRESETS.some((preset) => preset.id === 'paired-classic' && preset.create().steles.length >= 2))
})

test('compatibility validation catches a composition that is too wide for its plot', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.plot.widthM = 1.2
  project.steles[0].monument.widthM = 0.65
  project.steles[1].monument.widthM = 0.65
  project.layout.gapM = 0.2
  const diagnostics = validateProjectCompatibility(project)
  assert.ok(diagnostics.some((item) => item.code === 'COMPOSITION_TOO_WIDE_FOR_PLOT' && item.severity === 'error'))
})

test('compatibility validation catches bench and table on the same side', () => {
  const project = createDefaultProject()
  project.bench.enabled = true
  project.table.enabled = true
  project.bench.side = 'right'
  project.table.side = 'right'
  const diagnostics = validateProjectCompatibility(project)
  assert.ok(diagnostics.some((item) => item.code === 'FURNITURE_SAME_SIDE'))
})
