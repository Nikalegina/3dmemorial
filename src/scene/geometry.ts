import * as THREE from 'three'
import type { MonumentShape } from '../domain/memorialProject'

function buildProfile(width: number, height: number, shapeKind: MonumentShape): THREE.Shape {
  const shape = new THREE.Shape()
  const half = width / 2
  shape.moveTo(-half, 0)
  shape.lineTo(half, 0)

  switch (shapeKind) {
    case 'rectangle':
      shape.lineTo(half, height)
      shape.lineTo(-half, height)
      break
    case 'arch': {
      const radius = Math.min(width / 2, height * 0.32)
      const shoulderY = height - radius
      shape.lineTo(half, shoulderY)
      shape.absarc(0, shoulderY, radius, 0, Math.PI, false)
      shape.lineTo(-half, 0)
      break
    }
    case 'slant':
      shape.lineTo(half, height * 0.8)
      shape.lineTo(-half, height)
      break
    case 'wave':
      shape.lineTo(half, height * 0.76)
      shape.bezierCurveTo(width * 0.28, height * 0.72, width * 0.16, height, 0, height * 0.96)
      shape.bezierCurveTo(-width * 0.18, height * 0.9, -width * 0.3, height * 0.82, -half, height * 0.9)
      break
    case 'heart': {
      shape.lineTo(half, height * 0.7)
      shape.bezierCurveTo(half, height * 0.94, width * 0.2, height, 0, height * 0.82)
      shape.bezierCurveTo(-width * 0.2, height, -half, height * 0.94, -half, height * 0.7)
      break
    }
    case 'muslim-arch':
      shape.lineTo(half, height * 0.68)
      shape.quadraticCurveTo(width * 0.38, height * 0.87, 0, height)
      shape.quadraticCurveTo(-width * 0.38, height * 0.87, -half, height * 0.68)
      break
  }

  shape.lineTo(-half, 0)
  shape.closePath()
  return shape
}

export function createSteleGeometry(
  width: number,
  height: number,
  depth: number,
  shapeKind: MonumentShape,
): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(buildProfile(width, height, shapeKind), {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(0.012, depth * 0.12),
    bevelThickness: Math.min(0.008, depth * 0.08),
    curveSegments: 32,
  })
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()
  return geometry
}
