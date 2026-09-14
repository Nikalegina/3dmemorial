import * as THREE from 'three'
import type { SourceCatalogProfileId } from '../domain/sourceCatalogProfileTypes.ts'

export const ELITE_COMPOUND_PROFILE_IDS = [
  'ermis-elite-4',
  'ermis-elite-22',
  'ermis-elite-24',
  'ermis-elite-25',
] as const satisfies readonly SourceCatalogProfileId[]

export type EliteCompoundProfileId = typeof ELITE_COMPOUND_PROFILE_IDS[number]

export function isEliteCompoundProfileId(value: string): value is EliteCompoundProfileId {
  return (ELITE_COMPOUND_PROFILE_IDS as readonly string[]).includes(value)
}

export interface OpenArchMetrics {
  outerRadius: number
  innerRadius: number
  ringThickness: number
  centerY: number
  postHeight: number
  postCenterY: number
  postX: number
  baseHeight: number
}

export function getOpenArchMetrics(width: number, height: number): OpenArchMetrics {
  const outerRadius = Math.min(width * 0.43, height * 0.3)
  const ringThickness = Math.min(width * 0.105, outerRadius * 0.3)
  const innerRadius = outerRadius - ringThickness
  const centerY = height - outerRadius - height * 0.02
  const baseHeight = height * 0.09
  const postHeight = Math.max(height * 0.36, centerY - baseHeight)
  const postCenterY = baseHeight + postHeight / 2
  const postX = outerRadius - ringThickness / 2
  return { outerRadius, innerRadius, ringThickness, centerY, postHeight, postCenterY, postX, baseHeight }
}

function extrude(shape: THREE.Shape, depth: number): THREE.ExtrudeGeometry {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: Math.min(0.012, depth * 0.08),
    bevelThickness: Math.min(0.008, depth * 0.06),
    curveSegments: 36,
  })
  geometry.translate(0, 0, -depth / 2)
  geometry.computeVertexNormals()
  return geometry
}

export function createEliteArchRingGeometry(width: number, height: number, depth: number): THREE.ExtrudeGeometry {
  const { outerRadius, innerRadius } = getOpenArchMetrics(width, height)
  const shape = new THREE.Shape()
  shape.moveTo(outerRadius, 0)
  shape.absarc(0, 0, outerRadius, 0, Math.PI, false)
  shape.lineTo(-innerRadius, 0)
  shape.absarc(0, 0, innerRadius, Math.PI, 0, true)
  shape.closePath()
  return extrude(shape, depth)
}

export type EliteHeaderStyle = 'orthodox' | 'framed'

export function createEliteHeaderGeometry(
  width: number,
  height: number,
  depth: number,
  style: EliteHeaderStyle,
): THREE.ExtrudeGeometry {
  const half = width / 2
  const shape = new THREE.Shape()
  shape.moveTo(-half, 0)
  shape.lineTo(half, 0)

  if (style === 'orthodox') {
    shape.lineTo(half, height * 0.56)
    shape.bezierCurveTo(width * 0.34, height * 0.58, width * 0.18, height * 0.9, 0, height)
    shape.bezierCurveTo(-width * 0.18, height * 0.9, -width * 0.34, height * 0.58, -half, height * 0.56)
  } else {
    shape.lineTo(half, height * 0.42)
    shape.quadraticCurveTo(width * 0.22, height * 0.78, 0, height)
    shape.quadraticCurveTo(-width * 0.22, height * 0.78, -half, height * 0.42)
  }

  shape.closePath()
  return extrude(shape, depth)
}

export function createElitePanelGeometry(width: number, height: number, depth: number): THREE.ExtrudeGeometry {
  const half = width / 2
  const shoulderY = height * 0.83
  const shape = new THREE.Shape()
  shape.moveTo(-half, 0)
  shape.lineTo(half, 0)
  shape.lineTo(half, shoulderY)
  shape.quadraticCurveTo(width * 0.25, height, 0, height)
  shape.quadraticCurveTo(-width * 0.25, height, -half, shoulderY)
  shape.closePath()
  return extrude(shape, depth)
}
