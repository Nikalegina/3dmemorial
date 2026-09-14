import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getMaterialDefinition } from '../domain/catalog'
import {
  getCompositionWidth,
  getSteleLayoutPositions,
  type MemorialProject,
  type MemorialStele,
} from '../domain/memorialProject'
import { createSteleGeometry } from './geometry'
import { InscriptionPlane } from './InscriptionPlane'
import { PortraitPlane } from './PortraitPlane'
import { SteleSurfaceMaterial } from './SteleSurfaceMaterial'

function SteleMonument({
  stele,
  x,
  portraitUrl,
  baseHeight,
}: {
  stele: MemorialStele
  x: number
  portraitUrl: string | null
  baseHeight: number
}) {
  const { monument } = stele
  const geometry = useMemo(
    () => createSteleGeometry(monument.widthM, monument.heightM, monument.depthM, monument.shape),
    [monument.depthM, monument.heightM, monument.shape, monument.widthM],
  )
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 28), [geometry])

  useEffect(() => () => {
    edges.dispose()
    geometry.dispose()
  }, [edges, geometry])

  const surface = getMaterialDefinition(monument.surfaceId)
  const isGlass = surface.kind === 'glass'
  const faceZ = isGlass
    ? Math.max(0.0005, monument.depthM / 2 - 0.0008)
    : monument.depthM / 2 + 0.013

  return (
    <group position={[x, baseHeight, 0]}>
      <mesh geometry={geometry} castShadow receiveShadow>
        <SteleSurfaceMaterial definition={surface} physicalThickness={monument.depthM} />
      </mesh>

      <lineSegments geometry={edges} renderOrder={3}>
        <lineBasicMaterial
          color={isGlass ? '#e9ffff' : '#8a8f91'}
          transparent
          opacity={isGlass ? 0.42 : 0.14}
          depthWrite={false}
          toneMapped={false}
        />
      </lineSegments>

      {monument.material === 'hybrid' && (
        <mesh position={[0, monument.heightM * 0.57, monument.depthM / 2 + 0.004]}>
          <planeGeometry args={[monument.widthM * 0.6, monument.heightM * 0.6]} />
          <meshPhysicalMaterial
            color="#d9e9eb"
            transmission={0.98}
            thickness={0.055}
            ior={1.45}
            roughness={0.035}
            clearcoat={1}
            clearcoatRoughness={0.02}
            envMapIntensity={1.6}
            transparent
            opacity={1}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {stele.portrait.enabled && (
        <PortraitPlane url={portraitUrl} stele={stele} z={faceZ} />
      )}
      <InscriptionPlane stele={stele} z={faceZ + (isGlass ? 0.00015 : 0.0015)} />
    </group>
  )
}

export function Monument({
  project,
  portraitUrls,
}: {
  project: MemorialProject
  portraitUrls: Record<string, string>
}) {
  const positions = getSteleLayoutPositions(project)
  const compositionWidth = getCompositionWidth(project)
  const maxDepth = Math.max(...positions.map(({ stele }) => stele.monument.depthM), 0.09)
  const monumentZ = -project.plot.depthM * 0.22
  const baseHeight = 0.14
  const baseDepth = Math.max(0.34, maxDepth * 3.5)

  return (
    <group position={[0, 0, monumentZ]}>
      <mesh position={[0, baseHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[compositionWidth + 0.3, baseHeight, baseDepth]} />
        <meshPhysicalMaterial
          color="#141618"
          roughness={0.18}
          metalness={0.01}
          clearcoat={0.48}
          clearcoatRoughness={0.12}
          envMapIntensity={1.1}
        />
      </mesh>

      {positions.map(({ stele, x }) => (
        <SteleMonument
          key={stele.id}
          stele={stele}
          x={x}
          portraitUrl={portraitUrls[stele.id] ?? null}
          baseHeight={baseHeight}
        />
      ))}
    </group>
  )
}
