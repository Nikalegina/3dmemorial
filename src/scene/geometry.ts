import * as THREE from 'three'
import type { MonumentShape } from '../domain/memorialProject'
import { getSourceCatalogProfile, isSourceCatalogProfileId } from '../domain/sourceCatalogProfiles.ts'

function buildProfile(width: number, height: number, shapeKind: MonumentShape): THREE.Shape {
  const shape = new THREE.Shape()

  if (isSourceCatalogProfileId(shapeKind)) {
    const profile = getSourceCatalogProfile(shapeKind)
    const [first, ...rest] = profile.points
    if (!first || rest.length < 2) throw new Error(`Source catalog profile is invalid: ${shapeKind}`)

    shape.moveTo(first[0] * width, first[1] * height)
    for (const [x, y] of rest) shape.lineTo(x * width, y * height)
    shape.closePath()
    return shape
  }

  const half = width / 2
  shape.moveTo(-half, 0)
  shape.lineTo(half, 0)

  switch (shapeKind) {
    case 'rectangle':
      shape.lineTo(half, height)
      shape.lineTo(-half, height)
      break

    case 'rounded-rectangle': {
      const r = Math.min(width * 0.14, height * 0.12)
      shape.lineTo(half, height - r)
      shape.quadraticCurveTo(half, height, half - r, height)
      shape.lineTo(-half + r, height)
      shape.quadraticCurveTo(-half, height, -half, height - r)
      break
    }

    case 'arch': {
      const radius = Math.min(width / 2, height * 0.32)
      const shoulderY = height - radius
      shape.lineTo(half, shoulderY)
      shape.absarc(0, shoulderY, radius, 0, Math.PI, false)
      shape.lineTo(-half, 0)
      break
    }

    case 'dome':
      shape.lineTo(half, height * 0.68)
      shape.bezierCurveTo(half, height * 0.86, width * 0.28, height, 0, height)
      shape.bezierCurveTo(-width * 0.28, height, -half, height * 0.86, -half, height * 0.68)
      break

    case 'slant':
      shape.lineTo(half, height * 0.8)
      shape.lineTo(-half, height)
      break

    case 'bevel-left':
      shape.lineTo(half, height)
      shape.lineTo(-half * 0.35, height)
      shape.lineTo(-half, height * 0.78)
      break

    case 'bevel-right':
      shape.lineTo(half, height * 0.78)
      shape.lineTo(half * 0.35, height)
      shape.lineTo(-half, height)
      break

    case 'wave':
      shape.lineTo(half, height * 0.76)
      shape.bezierCurveTo(width * 0.28, height * 0.72, width * 0.16, height, 0, height * 0.96)
      shape.bezierCurveTo(-width * 0.18, height * 0.9, -width * 0.3, height * 0.82, -half, height * 0.9)
      break

    case 'ogee':
      shape.lineTo(half, height * 0.72)
      shape.bezierCurveTo(width * 0.4, height * 0.82, width * 0.22, height * 0.78, width * 0.12, height * 0.94)
      shape.bezierCurveTo(width * 0.06, height, -width * 0.06, height, -width * 0.12, height * 0.94)
      shape.bezierCurveTo(-width * 0.22, height * 0.78, -width * 0.4, height * 0.82, -half, height * 0.72)
      break

    case 'shield':
      shape.lineTo(half, height * 0.76)
      shape.lineTo(width * 0.16, height * 0.9)
      shape.lineTo(0, height)
      shape.lineTo(-width * 0.16, height * 0.9)
      shape.lineTo(-half, height * 0.76)
      break

    case 'book':
      shape.lineTo(half, height * 0.86)
      shape.quadraticCurveTo(width * 0.24, height, 0, height * 0.9)
      shape.quadraticCurveTo(-width * 0.24, height, -half, height * 0.86)
      break

    case 'teardrop':
      shape.lineTo(half, height * 0.6)
      shape.bezierCurveTo(half * 0.95, height * 0.82, width * 0.18, height * 0.94, 0, height)
      shape.bezierCurveTo(-width * 0.18, height * 0.94, -half * 0.95, height * 0.82, -half, height * 0.6)
      break

    case 'heart':
      shape.lineTo(half, height * 0.7)
      shape.bezierCurveTo(half, height * 0.94, width * 0.2, height, 0, height * 0.82)
      shape.bezierCurveTo(-width * 0.2, height, -half, height * 0.94, -half, height * 0.7)
      break

    case 'muslim-arch':
      shape.lineTo(half, height * 0.68)
      shape.quadraticCurveTo(width * 0.38, height * 0.87, 0, height)
      shape.quadraticCurveTo(-width * 0.38, height * 0.87, -half, height * 0.68)
      break

    case 'muslim-dome':
      shape.lineTo(half, height * 0.66)
      shape.bezierCurveTo(width * 0.38, height * 0.8, width * 0.18, height * 0.88, 0, height)
      shape.bezierCurveTo(-width * 0.18, height * 0.88, -width * 0.38, height * 0.8, -half, height * 0.66)
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
