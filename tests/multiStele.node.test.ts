import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createDefaultProject,
  getCompositionWidth,
  getSteleLayoutPositions,
  addFamilyStele,
  getVisibleSteles,
  MAX_FAMILY_EDITOR_STELES,
  MIN_FAMILY_EDITOR_STELES,
  removeFamilyStele,
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


test('family layout starts with three steles and supports a bounded fourth', () => {
  let project = withLayout(createDefaultProject(), 'family')
  assert.equal(project.layout.type, 'family')
  assert.equal(getVisibleSteles(project).length, MIN_FAMILY_EDITOR_STELES)

  project = addFamilyStele(project)
  assert.equal(getVisibleSteles(project).length, MAX_FAMILY_EDITOR_STELES)

  project = addFamilyStele(project)
  assert.equal(getVisibleSteles(project).length, MAX_FAMILY_EDITOR_STELES)
})

test('family removal is explicit and never drops below three steles', () => {
  let project = addFamilyStele(withLayout(createDefaultProject(), 'family'))
  const removedId = project.steles[1].id
  project = removeFamilyStele(project, removedId)
  assert.equal(project.steles.length, 3)
  assert.equal(project.steles.some((stele) => stele.id === removedId), false)

  const protectedId = project.steles[0].id
  project = removeFamilyStele(project, protectedId)
  assert.equal(project.steles.length, 3)
  assert.equal(project.steles.some((stele) => stele.id === protectedId), true)
})

test('family positions stay centered and preserve edge gaps across three monuments', () => {
  const project = withLayout(createDefaultProject(), 'family')
  project.layout.gapM = 0.12
  project.steles[0].monument.widthM = 0.5
  project.steles[1].monument.widthM = 0.6
  project.steles[2].monument.widthM = 0.55

  const positions = getSteleLayoutPositions(project)
  assert.equal(positions.length, 3)

  for (let index = 0; index < positions.length - 1; index += 1) {
    const right = positions[index].x + positions[index].stele.monument.widthM / 2
    const left = positions[index + 1].x - positions[index + 1].stele.monument.widthM / 2
    assert.ok(Math.abs((left - right) - 0.12) < 1e-9)
  }

  const leftEdge = positions[0].x - positions[0].stele.monument.widthM / 2
  const last = positions[positions.length - 1]
  const rightEdge = last.x + last.stele.monument.widthM / 2
  assert.ok(Math.abs(leftEdge + rightEdge) < 1e-9)
})
