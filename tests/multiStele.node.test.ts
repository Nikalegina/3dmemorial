import assert from 'node:assert/strict'
import test from 'node:test'
import {
  addFamilyStele,
  createDefaultProject,
  FAMILY_UI_MAX_STELES,
  getCompositionWidth,
  getSteleLayoutPositions,
  getVisibleSteles,
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


test('family layout guarantees three visible steles without changing schema version', () => {
  const project = withLayout(createDefaultProject(), 'family')
  assert.equal(project.schemaVersion, 4)
  assert.equal(project.layout.type, 'family')
  assert.equal(getVisibleSteles(project).length, 3)
  assert.equal(new Set(project.steles.map((stele) => stele.id)).size, project.steles.length)
})

test('family editor can add a fourth stele and will not exceed the UI limit', () => {
  let project = withLayout(createDefaultProject(), 'family')
  project = addFamilyStele(project)
  assert.equal(getVisibleSteles(project).length, FAMILY_UI_MAX_STELES)

  const again = addFamilyStele(project)
  assert.equal(getVisibleSteles(again).length, FAMILY_UI_MAX_STELES)
})

test('family editor removes selected extra stele but preserves minimum family size', () => {
  let project = addFamilyStele(withLayout(createDefaultProject(), 'family'))
  const removedId = project.steles[1].id
  project = removeFamilyStele(project, removedId)

  assert.equal(getVisibleSteles(project).length, 3)
  assert.equal(project.steles.some((stele) => stele.id === removedId), false)

  const protectedProject = removeFamilyStele(project, project.steles[0].id)
  assert.equal(getVisibleSteles(protectedProject).length, 3)
  assert.deepEqual(protectedProject, project)
})

test('family to single and back preserves hidden family subjects', () => {
  let project = withLayout(createDefaultProject(), 'family')
  project.steles[2].inscription.name = 'ТРЕТИЙ НЕ ТЕРЯТЬ'
  project = withLayout(project, 'single')
  assert.equal(getVisibleSteles(project).length, 1)
  assert.ok(project.steles.length >= 3)

  project = withLayout(project, 'family')
  assert.equal(getVisibleSteles(project)[2].inscription.name, 'ТРЕТИЙ НЕ ТЕРЯТЬ')
})
