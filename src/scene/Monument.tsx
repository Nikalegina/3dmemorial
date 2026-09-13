import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { MemorialProject } from '../domain/memorialProject'
import { createSteleGeometry } from './geometry'
import { PortraitPlane } from './PortraitPlane'

export function Monument({
  project,
  portraitUrl,
}: {
  project: MemorialProject
  portraitUrl: string | null
}) {
  const { monument } = project
  const geometry = useMemo(
    () => createSteleGeometry(monument.widthM, monument.heightM, monument.depthM, monument.shape),
    [monument.depthM, monument.heightM, monument.shape, monument.widthM],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  const monumentZ = -project.plot.depthM * 0.22
  const baseHeight = 0.14
  const baseDepth = Math.max(0.34, monument.depthM * 3.5)

  const material = monument.material === 'glass' ? (
    <meshPhysicalMaterial
      color="#dbe8e7"
      roughness={0.08}
      transmission={0.9}
      thickness={0.08}
      ior={1.45}
      transparent
      opacity={0.94}
      side={THREE.DoubleSide}
    />
  ) : (
    <meshPhysicalMaterial
      color="#111315"
      roughness={0.2}
      metalness={0.03}
      clearcoat={0.42}
      clearcoatRoughness={0.14}
    />
  )

  return (
    <group position={[0, 0, monumentZ]}>
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[monument.widthM + 0.28, baseHeight, baseDepth]} />
        <meshStandardMaterial color="#16181a" roughness={0.24} />
      </mesh>

      <group position={[0, baseHeight, 0]}>
        <mesh geometry={geometry} castShadow receiveShadow>{material}</mesh>

        {monument.material === 'hybrid' && (
          <mesh position={[0, monument.heightM * 0.56, monument.depthM / 2 + 0.004]}>
            <planeGeometry args={[monument.widthM * 0.58, monument.heightM * 0.58]} />
            <meshPhysicalMaterial
              color="#d9e9eb"
              transmission={0.92}
              thickness={0.05}
              roughness={0.06}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {project.portrait.enabled && (
          <PortraitPlane
            url={portraitUrl}
            mode={project.portrait.mode}
            width={monument.widthM}
            height={monument.heightM}
            z={monument.depthM / 2 + 0.012}
          />
        )}
      </group>
    </group>
  )
}
