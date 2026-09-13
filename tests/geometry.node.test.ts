import assert from 'node:assert/strict'
import test from 'node:test'
import { MONUMENT_SHAPES } from '../src/domain/catalog.ts'
import { createSteleGeometry } from '../src/scene/geometry.ts'

test('all owned monument profiles generate finite non-degenerate geometry', () => {
  for (const shape of MONUMENT_SHAPES) {
    const geometry = createSteleGeometry(0.7, 1.3, 0.09, shape.id)
    try {
      const positions = geometry.getAttribute('position')
      assert.ok(positions.count > 0, `${shape.id}: no vertices`)

      for (let index = 0; index < positions.count; index += 1) {
        assert.ok(Number.isFinite(positions.getX(index)), `${shape.id}: non-finite X`)
        assert.ok(Number.isFinite(positions.getY(index)), `${shape.id}: non-finite Y`)
        assert.ok(Number.isFinite(positions.getZ(index)), `${shape.id}: non-finite Z`)
      }

      geometry.computeBoundingBox()
      const box = geometry.boundingBox
      assert.ok(box, `${shape.id}: missing bounding box`)
      assert.ok(box.max.x - box.min.x > 0.2, `${shape.id}: degenerate width`)
      assert.ok(box.max.y - box.min.y > 0.5, `${shape.id}: degenerate height`)
      assert.ok(box.max.z - box.min.z > 0.03, `${shape.id}: degenerate depth`)
    } finally {
      geometry.dispose()
    }
  }
})
