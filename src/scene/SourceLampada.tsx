import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

function LampadaStoneMaterial() {
  return (
    <meshPhysicalMaterial
      color="#111315"
      roughness={0.16}
      metalness={0.02}
      clearcoat={0.55}
      clearcoatRoughness={0.1}
      envMapIntensity={1.15}
    />
  )
}

function useLampadaFrameGeometry(width: number, height: number, depth: number) {
  const geometry = useMemo(() => {
    const baseHeight = height * 0.15
    const crossHeight = height * 0.15
    const bodyTop = height - crossHeight
    const outerRadius = width / 2
    const outerSpringY = bodyTop - outerRadius
    const innerRadius = width * 0.245
    const innerSpringY = outerSpringY
    const innerBottom = baseHeight + height * 0.04

    const shape = new THREE.Shape()
    shape.moveTo(-outerRadius, baseHeight)
    shape.lineTo(-outerRadius, outerSpringY)
    shape.absarc(0, outerSpringY, outerRadius, Math.PI, 0, true)
    shape.lineTo(outerRadius, baseHeight)
    shape.closePath()

    const opening = new THREE.Path()
    opening.moveTo(-innerRadius, innerBottom)
    opening.lineTo(-innerRadius, innerSpringY)
    opening.absarc(0, innerSpringY, innerRadius, Math.PI, 0, true)
    opening.lineTo(innerRadius, innerBottom)
    opening.closePath()
    shape.holes.push(opening)

    const result = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      curveSegments: 24,
    })
    result.translate(0, 0, -depth / 2)
    result.computeVertexNormals()
    return result
  }, [depth, height, width])

  useEffect(() => () => geometry.dispose(), [geometry])
  return geometry
}

export function SourceLampada({
  position,
  widthM,
  heightM,
  depthM,
  sourceComponentId,
}: {
  position: [number, number, number]
  widthM: number
  heightM: number
  depthM: number
  sourceComponentId: string
}) {
  const geometry = useLampadaFrameGeometry(widthM, heightM, depthM)
  const baseHeight = heightM * 0.15
  const crossHeight = heightM * 0.15
  const bodyTop = heightM - crossHeight
  const openingBottom = baseHeight + heightM * 0.04
  const openingHeight = bodyTop - openingBottom
  const centralPillarWidth = widthM * 0.12
  const glowWidth = widthM * 0.19

  return (
    <group position={position} data-source-component={sourceComponentId}>
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[widthM, baseHeight, depthM]} />
        <LampadaStoneMaterial />
      </mesh>

      <mesh geometry={geometry} castShadow receiveShadow>
        <LampadaStoneMaterial />
      </mesh>

      <mesh position={[0, openingBottom + openingHeight * 0.5, -depthM * 0.28]}>
        <boxGeometry args={[glowWidth * 2.35, openingHeight * 0.72, depthM * 0.12]} />
        <meshStandardMaterial
          color="#d58a43"
          emissive="#8d4319"
          emissiveIntensity={0.8}
          roughness={0.45}
        />
      </mesh>

      <mesh
        position={[0, openingBottom + openingHeight * 0.42, depthM * 0.02]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[centralPillarWidth, openingHeight * 0.72, depthM]} />
        <LampadaStoneMaterial />
      </mesh>

      <mesh
        position={[0, bodyTop + crossHeight / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[widthM * 0.08, crossHeight, depthM * 0.12]} />
        <LampadaStoneMaterial />
      </mesh>
      <mesh
        position={[0, bodyTop + crossHeight * 0.62, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[widthM * 0.38, heightM * 0.025, depthM * 0.12]} />
        <LampadaStoneMaterial />
      </mesh>
    </group>
  )
}
