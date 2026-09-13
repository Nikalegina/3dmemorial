import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createDefaultProject,
  getCompositionWidth,
  getSteleLayoutPositions,
  getVisibleSteles,
  withLayout,
} from '../src/domain/memorialProject.ts'

test('paired layout creates two independently addressable steles', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  assert.equal(getVisibleSteles(project).length, 2)
  assert.notEqual(project.steles[0].id, project.steles[1].id)

  project.steles[0].inscription.name = 'ПЕРВЫЙ'
  project.steles[1].inscription.name = 'ВТОРОЙ'
  assert.equal(project.steles[0].inscription.name, 'ПЕРВЫЙ')
  assert.equal(project.steles[1].inscription.name, 'ВТОРОЙ')
})

test('paired positions preserve the configured edge-to-edge gap and center the composition', () => {
  const project = withLayout(createDefaultProject(), 'paired')
  project.steles[0].monument.widthM = 0.7
  project.steles[1].monument.widthM = 0.6
  project.layout.gapM = 0.2

  const positions = getSteleLayoutPositions(project)
  assert.equal(positions.length, 2)

  const rightEdgeFirst = positions[0].x + positions[0].stele.monument.widthM / 2
  const leftEdgeSecond = positions[1].x - positions[1].stele.monument.widthM / 2
  assert.ok(Math.abs((leftEdgeSecond - rightEdgeFirst) - 0.2) < 1e-9)

  const left = positions[0].x - positions[0].stele.monument.widthM / 2
  const right = positions[1].x + positions[1].stele.monument.widthM / 2
  assert.ok(Math.abs(left + right) < 1e-9)
  assert.ok(Math.abs(getCompositionWidth(project) - 1.5) < 1e-9)
})

test('switching back to single preserves the secondary stele for reversible editing', () => {
  let project = withLayout(createDefaultProject(), 'paired')
  project.steles[1].inscription.name = 'НЕ ТЕРЯТЬ'
  project = withLayout(project, 'single')

  assert.equal(getVisibleSteles(project).length, 1)
  assert.equal(project.steles.length, 2)
  assert.equal(project.steles[1].inscription.name, 'НЕ ТЕРЯТЬ')

  project = withLayout(project, 'paired')
  assert.equal(getVisibleSteles(project)[1].inscription.name, 'НЕ ТЕРЯТЬ')
})
