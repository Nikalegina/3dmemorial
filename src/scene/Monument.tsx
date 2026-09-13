import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getMaterialDefinition, type MaterialDefinition } from '../domain/catalog'
import type { MemorialProject } from '../domain/memorialProject'
import { createSteleGeometry } from './geometry'
import { InscriptionPlane } from './InscriptionPlane'
import { PortraitPlane } from './PortraitPlane'

function SurfaceMaterial({ definition }: { definition: MaterialDefinition }) {
  if (definition.kind === 'glass') {
    return (
      <meshPhysicalMaterial
        color={definition.color}
        roughness={definition.roughness}
        transmission={definition.transmission ?? 0.9}
        thickness={definition.thickness ?? 0.08}
        ior={definition.ior ?? 1.45}
        transparent
        opacity={0.96}
        side={THREE.DoubleSide}
      />
    )
  }

  return (
    <meshPhysicalMaterial
      color={definition.color}
      roughness={definition.roughness}
      metalness={definition.metalness ?? 0.02}
      clearcoat={definition.clearcoat ?? 0.35}
      clearcoatRoughness={definition.clearcoatRoughness ?? 0.15}
    />
  )
}

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
  const surface = getMaterialDefinition(monument.surfaceId)
  const faceZ = monument.depthM / 2 + 0.013

  return (
    <group position={[0, 0, monumentZ]}>
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[monument.widthM + 0.28, baseHeight, baseDepth]} />
        <meshPhysicalMaterial color="#151719" roughness={0.2} clearcoat={0.28} clearcoatRoughness={0.16} />
      </mesh>

      <group position={[0, baseHeight, 0]}>
        <mesh geometry={geometry} castShadow receiveShadow>
          <SurfaceMaterial definition={surface} />
        </mesh>

        {monument.material === 'hybrid' && (
          <mesh position={[0, monument.heightM * 0.57, monument.depthM / 2 + 0.004]}>
            <planeGeometry args={[monument.widthM * 0.6, monument.heightM * 0.6]} />
            <meshPhysicalMaterial
              color="#d9e9eb"
              transmission={0.95}
              thickness={0.055}
              ior={1.45}
              roughness={0.045}
              transparent
              opacity={0.96}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {project.portrait.enabled && (
          <PortraitPlane url={portraitUrl} project={project} z={faceZ} />
        )}
        <InscriptionPlane project={project} z={faceZ + 0.001} />
      </group>
    </group>
  )
}
