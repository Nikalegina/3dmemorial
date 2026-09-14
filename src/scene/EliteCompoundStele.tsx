import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { getMaterialDefinition } from '../domain/catalog'
import type { MemorialStele } from '../domain/memorialProject'
import { InscriptionPlane } from './InscriptionPlane'
import { PortraitPlane } from './PortraitPlane'
import { SteleSurfaceMaterial } from './SteleSurfaceMaterial'
import {
  createEliteArchRingGeometry,
  createEliteHeaderGeometry,
  createElitePanelGeometry,
  getOpenArchMetrics,
  type EliteCompoundProfileId,
} from './eliteCompoundGeometry'

type Vec3 = [number, number, number]

function StoneBox({
  size,
  position,
  rotation,
  stele,
}: {
  size: Vec3
  position: Vec3
  rotation?: Vec3
  stele: MemorialStele
}) {
  const surface = getMaterialDefinition(stele.monument.surfaceId)
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <SteleSurfaceMaterial definition={surface} physicalThickness={size[2]} />
    </mesh>
  )
}

function StoneCylinder({
  radius,
  height,
  position,
  stele,
}: {
  radius: number
  height: number
  position: Vec3
  stele: MemorialStele
}) {
  const surface = getMaterialDefinition(stele.monument.surfaceId)
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 40]} />
      <SteleSurfaceMaterial definition={surface} physicalThickness={radius * 2} />
    </mesh>
  )
}

function StoneSphere({
  radius,
  position,
  stele,
}: {
  radius: number
  position: Vec3
  stele: MemorialStele
}) {
  const surface = getMaterialDefinition(stele.monument.surfaceId)
  return (
    <mesh position={position} castShadow receiveShadow>
      <sphereGeometry args={[radius, 32, 20]} />
      <SteleSurfaceMaterial definition={surface} physicalThickness={radius * 2} />
    </mesh>
  )
}

function StoneGeometry({
  geometry,
  position,
  stele,
}: {
  geometry: THREE.BufferGeometry
  position: Vec3
  stele: MemorialStele
}) {
  const surface = getMaterialDefinition(stele.monument.surfaceId)
  useEffect(() => () => geometry.dispose(), [geometry])
  return (
    <mesh geometry={geometry} position={position} castShadow receiveShadow>
      <SteleSurfaceMaterial definition={surface} physicalThickness={stele.monument.depthM} />
    </mesh>
  )
}

function OpenArch({
  stele,
  strongerBase = false,
}: {
  stele: MemorialStele
  strongerBase?: boolean
}) {
  const { widthM: width, heightM: height, depthM: depth } = stele.monument
  const metrics = getOpenArchMetrics(width, height)
  const archDepth = depth * 0.9
  const arch = useMemo(
    () => createEliteArchRingGeometry(width, height, archDepth),
    [archDepth, height, width],
  )
  const postWidth = metrics.ringThickness * 0.82
  const capitalWidth = postWidth * 1.55
  const capitalHeight = height * 0.035
  const baseDepth = depth * (strongerBase ? 1.28 : 1.16)

  return (
    <group>
      <StoneBox
        stele={stele}
        size={[width * 0.94, metrics.baseHeight, baseDepth]}
        position={[0, metrics.baseHeight / 2, 0]}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <StoneBox
            stele={stele}
            size={[postWidth, metrics.postHeight, depth * 0.82]}
            position={[side * metrics.postX, metrics.postCenterY, 0]}
          />
          <StoneBox
            stele={stele}
            size={[capitalWidth, capitalHeight, depth]}
            position={[side * metrics.postX, metrics.centerY - capitalHeight * 0.55, 0]}
          />
          <StoneBox
            stele={stele}
            size={[capitalWidth * 0.92, capitalHeight * 0.86, depth * 0.95]}
            position={[side * metrics.postX, metrics.baseHeight + capitalHeight * 0.42, 0]}
          />
        </group>
      ))}
      <StoneGeometry geometry={arch} position={[0, metrics.centerY, 0]} stele={stele} />
    </group>
  )
}

function OrthodoxPortal({ stele }: { stele: MemorialStele }) {
  const { widthM: width, heightM: height, depthM: depth } = stele.monument
  const baseHeight = height * 0.07
  const columnBottom = baseHeight * 1.1
  const headerBottom = height * 0.67
  const shaftHeight = headerBottom - columnBottom
  const columnX = width * 0.34
  const shaftRadius = width * 0.035
  const headerHeight = height * 0.11
  const headerDepth = depth * 0.82
  const header = useMemo(
    () => createEliteHeaderGeometry(width * 0.8, headerHeight, headerDepth, 'orthodox'),
    [headerDepth, headerHeight, width],
  )

  const finialY = height * 0.82
  const crossBaseY = height * 0.84
  const crossHeight = height * 0.15
  const crossDepth = Math.min(depth * 0.45, width * 0.045)

  return (
    <group>
      <StoneBox
        stele={stele}
        size={[width * 0.9, baseHeight, depth * 1.05]}
        position={[0, baseHeight / 2, 0]}
      />

      {[-1, 1].map((side) => (
        <group key={side}>
          <StoneCylinder
            stele={stele}
            radius={shaftRadius}
            height={shaftHeight}
            position={[side * columnX, columnBottom + shaftHeight / 2, 0]}
          />
          <StoneCylinder
            stele={stele}
            radius={shaftRadius * 1.45}
            height={height * 0.035}
            position={[side * columnX, columnBottom + height * 0.0175, 0]}
          />
          <StoneCylinder
            stele={stele}
            radius={shaftRadius * 1.42}
            height={height * 0.034}
            position={[side * columnX, headerBottom - height * 0.017, 0]}
          />
          <StoneBox
            stele={stele}
            size={[shaftRadius * 3.15, height * 0.022, depth * 0.92]}
            position={[side * columnX, headerBottom, 0]}
          />
        </group>
      ))}

      <StoneGeometry geometry={header} position={[0, headerBottom, 0]} stele={stele} />
      <StoneSphere stele={stele} radius={width * 0.045} position={[0, finialY, 0]} />

      <StoneBox
        stele={stele}
        size={[width * 0.032, crossHeight, crossDepth]}
        position={[0, crossBaseY + crossHeight / 2, 0]}
      />
      <StoneBox
        stele={stele}
        size={[width * 0.12, height * 0.018, crossDepth]}
        position={[0, crossBaseY + crossHeight * 0.72, 0]}
      />
      <StoneBox
        stele={stele}
        size={[width * 0.085, height * 0.014, crossDepth]}
        position={[0, crossBaseY + crossHeight * 0.9, 0]}
      />
      <StoneBox
        stele={stele}
        size={[width * 0.082, height * 0.013, crossDepth]}
        position={[0, crossBaseY + crossHeight * 0.46, 0]}
        rotation={[0, 0, -0.18]}
      />
    </group>
  )
}

function FramedPanel({
  stele,
  portraitUrl,
}: {
  stele: MemorialStele
  portraitUrl: string | null
}) {
  const { widthM: width, heightM: height, depthM: depth } = stele.monument
  const baseHeight = height * 0.11
  const panelWidth = width * 0.68
  const panelHeight = height * 0.66
  const panelDepth = depth * 0.68
  const panel = useMemo(
    () => createElitePanelGeometry(panelWidth, panelHeight, panelDepth),
    [panelDepth, panelHeight, panelWidth],
  )
  const columnX = width * 0.4
  const columnBottom = baseHeight * 0.9
  const headerBottom = height * 0.82
  const shaftHeight = headerBottom - columnBottom
  const shaftRadius = width * 0.028
  const headerHeight = height * 0.12
  const headerDepth = depth * 0.82
  const header = useMemo(
    () => createEliteHeaderGeometry(width * 0.91, headerHeight, headerDepth, 'framed'),
    [headerDepth, headerHeight, width],
  )
  const faceZ = panelDepth / 2 + 0.012

  return (
    <group>
      <StoneBox
        stele={stele}
        size={[width * 0.96, baseHeight, depth * 1.08]}
        position={[0, baseHeight / 2, 0]}
      />
      <StoneGeometry geometry={panel} position={[0, baseHeight * 0.76, 0]} stele={stele} />

      {[-1, 1].map((side) => (
        <group key={side}>
          <StoneCylinder
            stele={stele}
            radius={shaftRadius}
            height={shaftHeight}
            position={[side * columnX, columnBottom + shaftHeight / 2, 0]}
          />
          <StoneCylinder
            stele={stele}
            radius={shaftRadius * 1.45}
            height={height * 0.042}
            position={[side * columnX, columnBottom + height * 0.021, 0]}
          />
          <StoneCylinder
            stele={stele}
            radius={shaftRadius * 1.38}
            height={height * 0.04}
            position={[side * columnX, headerBottom - height * 0.02, 0]}
          />
        </group>
      ))}

      <StoneGeometry geometry={header} position={[0, headerBottom, 0]} stele={stele} />

      {stele.portrait.enabled && <PortraitPlane url={portraitUrl} stele={stele} z={faceZ} />}
      <InscriptionPlane stele={stele} z={faceZ + 0.0015} />
    </group>
  )
}

export function EliteCompoundStele({
  profileId,
  stele,
  portraitUrl,
}: {
  profileId: EliteCompoundProfileId
  stele: MemorialStele
  portraitUrl: string | null
}) {
  if (profileId === 'ermis-elite-4') return <OpenArch stele={stele} />
  if (profileId === 'ermis-elite-22') return <OpenArch stele={stele} strongerBase />
  if (profileId === 'ermis-elite-24') return <OrthodoxPortal stele={stele} />
  return <FramedPanel stele={stele} portraitUrl={portraitUrl} />
}
