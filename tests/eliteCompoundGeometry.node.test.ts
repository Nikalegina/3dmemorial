import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ELITE_COMPOUND_PROFILE_IDS,
  createEliteArchRingGeometry,
  createEliteHeaderGeometry,
  createElitePanelGeometry,
  getOpenArchMetrics,
  isEliteCompoundProfileId,
} from '../src/scene/eliteCompoundGeometry.ts'

function assertGeometry(geometry: { getAttribute(name: string): any; computeBoundingBox(): void; boundingBox: any; dispose(): void }, label: string) {
  try {
    const positions = geometry.getAttribute('position')
    assert.ok(positions && positions.count > 0, label)
    geometry.computeBoundingBox()
    const box = geometry.boundingBox
    assert.ok(box, label)
    assert.ok(box.max.x - box.min.x > 0.05, `${label}: width`)
    assert.ok(box.max.y - box.min.y > 0.03, `${label}: height`)
    assert.ok(box.max.z - box.min.z > 0.03, `${label}: depth`)
  } finally {
    geometry.dispose()
  }
}

test('procedural elite runtime ids are explicit and bounded', () => {
  assert.deepEqual(ELITE_COMPOUND_PROFILE_IDS, [
    'ermis-elite-4',
    'ermis-elite-22',
    'ermis-elite-24',
    'ermis-elite-25',
  ])
  assert.equal(isEliteCompoundProfileId('ermis-elite-4'), true)
  assert.equal(isEliteCompoundProfileId('ermis-elite-19'), false)
})

test('open arch metrics preserve a real opening and stable posts', () => {
  for (const [width, height] of [[1.18, 1.63], [1.2, 2.0]] as const) {
    const metrics = getOpenArchMetrics(width, height)
    assert.ok(metrics.outerRadius > metrics.innerRadius)
    assert.ok(metrics.innerRadius > 0.2)
    assert.ok(metrics.ringThickness > 0.08)
    assert.ok(metrics.centerY < height)
    assert.ok(metrics.postHeight > height * 0.35)
    assert.ok(metrics.postX > metrics.innerRadius)
  }
})

test('elite arch, headers and central panel produce non-degenerate extruded geometry', () => {
  assertGeometry(createEliteArchRingGeometry(1.18, 1.63, 0.18), 'elite-4-arch')
  assertGeometry(createEliteArchRingGeometry(1.2, 2.0, 0.18), 'elite-22-arch')
  assertGeometry(createEliteHeaderGeometry(0.96, 0.26, 0.24, 'orthodox'), 'elite-24-header')
  assertGeometry(createEliteHeaderGeometry(1.36, 0.144, 0.2, 'framed'), 'elite-25-header')
  assertGeometry(createElitePanelGeometry(1.02, 0.792, 0.17), 'elite-25-panel')
})
