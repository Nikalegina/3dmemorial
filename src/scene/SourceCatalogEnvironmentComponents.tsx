import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import {
  BENCH_STYLES,
  FENCE_STYLES,
  FLOWER_BED_STYLES,
  PAVING_STYLES,
  TABLE_STYLES,
  VASE_STYLES,
} from '../domain/componentCatalog'
import type { MemorialProject } from '../domain/memorialProject'

function PolishedBlackStone() {
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

function StoneBox({
  size,
  position,
  rotation,
}: {
  size: [number, number, number]
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <PolishedBlackStone />
    </mesh>
  )
}

function StoneCylinder({
  radius,
  height,
  position,
}: {
  radius: number
  height: number
  position: [number, number, number]
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[radius, radius, height, 32]} />
      <PolishedBlackStone />
    </mesh>
  )
}

function TurnedSupport({
  height,
  diameter,
  position,
}: {
  height: number
  diameter: number
  position: [number, number, number]
}) {
  const radius = diameter / 2
  const points = useMemo(() => [
    new THREE.Vector2(radius * 0.74, 0),
    new THREE.Vector2(radius, height * 0.035),
    new THREE.Vector2(radius, height * 0.075),
    new THREE.Vector2(radius * 0.8, height * 0.11),
    new THREE.Vector2(radius * 0.72, height * 0.22),
    new THREE.Vector2(radius * 0.78, height * 0.34),
    new THREE.Vector2(radius * 0.62, height * 0.48),
    new THREE.Vector2(radius * 0.5, height * 0.68),
    new THREE.Vector2(radius * 0.63, height * 0.82),
    new THREE.Vector2(radius * 0.82, height * 0.9),
    new THREE.Vector2(radius * 0.84, height * 0.96),
    new THREE.Vector2(radius * 0.72, height),
  ], [height, radius])

  return (
    <mesh position={position} castShadow receiveShadow>
      <latheGeometry args={[points, 32]} />
      <PolishedBlackStone />
    </mesh>
  )
}

function SourceFurniture({ project }: { project: MemorialProject }) {
  const bench = BENCH_STYLES.find((item) => item.id === project.bench.styleId) ?? BENCH_STYLES[0]
  const table = TABLE_STYLES.find((item) => item.id === project.table.styleId) ?? TABLE_STYLES[0]
  const benchIsSource = 'sourceComponentId' in bench
  const tableIsSource = 'sourceComponentId' in table

  if (!benchIsSource && !tableIsSource) return null

  const w = project.plot.widthM
  const d = project.plot.depthM
  const benchSide = project.bench.side === 'left' ? -1 : 1
  const tableSide = project.table.side === 'left' ? -1 : 1

  return (
    <group>
      {project.bench.enabled && benchIsSource && (
        <group
          position={[benchSide * w * 0.3, 0.12, d * 0.22]}
          rotation={[0, benchSide * -0.18, 0]}
          data-source-component={bench.sourceComponentId}
        >
          <StoneBox
            size={[bench.seatSizeM[0], bench.seatSizeM[1], bench.seatSizeM[2]]}
            position={[0, bench.supportHeightM + bench.seatSizeM[1] / 2, 0]}
          />
          <TurnedSupport
            height={bench.supportHeightM}
            diameter={bench.supportDiameterM}
            position={[-0.27, 0, 0]}
          />
          <TurnedSupport
            height={bench.supportHeightM}
            diameter={bench.supportDiameterM}
            position={[0.27, 0, 0]}
          />
        </group>
      )}

      {project.table.enabled && tableIsSource && (
        <group
          position={[tableSide * w * 0.3, 0.12, d * 0.24]}
          data-source-component={table.sourceComponentId}
        >
          {table.shape === 'round' ? (
            <mesh
              position={[0, table.supportHeightM + table.topSizeM[2] / 2, 0]}
              castShadow
              receiveShadow
            >
              <cylinderGeometry args={[table.topSizeM[0] / 2, table.topSizeM[0] / 2, table.topSizeM[2], 40]} />
              <PolishedBlackStone />
            </mesh>
          ) : (
            <StoneBox
              size={[table.topSizeM[0], table.topSizeM[2], table.topSizeM[1]]}
              position={[0, table.supportHeightM + table.topSizeM[2] / 2, 0]}
            />
          )}
          <TurnedSupport
            height={table.supportHeightM}
            diameter={table.supportDiameterM}
            position={[0, 0, 0]}
          />
        </group>
      )}
    </group>
  )
}

function SourceGraveSlab({ project }: { project: MemorialProject }) {
  if (!project.flowerBed.enabled) return null
  const style = FLOWER_BED_STYLES.find((item) => item.id === project.flowerBed.styleId)
  if (!style || style.kind !== 'grave-slab') return null

  const [lengthM, widthM] = style.slabSizeM
  // The source page gives length and width only. This small render thickness is
  // deliberately visual-only and is never persisted or presented as source data.
  const visualThicknessM = 0.055
  const z = Math.min(project.plot.depthM * 0.18, 0.42)

  return (
    <group data-source-component={style.sourceComponentId}>
      <StoneBox
        size={[widthM, visualThicknessM, lengthM]}
        position={[0, 0.17, z]}
      />
    </group>
  )
}

function SourcePaving({ project }: { project: MemorialProject }) {
  if (!project.paving.enabled) return null
  const style = PAVING_STYLES.find((item) => item.id === project.paving.styleId)
  if (!style || !('sourceComponentId' in style)) return null

  const [tileWidth, tileDepth] = style.tileSizeM
  const w = project.plot.widthM
  const d = project.plot.depthM
  const visualThicknessM = 0.035
  const columns = Math.max(1, Math.floor(w / tileWidth))
  const rows = Math.max(1, Math.floor(d / tileDepth))
  const usedW = columns * tileWidth
  const usedD = rows * tileDepth
  const gap = 0.012

  return (
    <group data-source-component={style.sourceComponentId}>
      {Array.from({ length: columns * rows }, (_, index) => {
        const xIndex = index % columns
        const zIndex = Math.floor(index / columns)
        const x = -usedW / 2 + tileWidth / 2 + xIndex * tileWidth
        const z = -usedD / 2 + tileDepth / 2 + zIndex * tileDepth
        return (
          <StoneBox
            key={`source-tile-${xIndex}-${zIndex}`}
            size={[
              Math.max(0.02, tileWidth - gap),
              visualThicknessM,
              Math.max(0.02, tileDepth - gap),
            ]}
            position={[x, visualThicknessM / 2 + 0.015, z]}
          />
        )
      })}
    </group>
  )
}

function SourceVase({ project, side }: { project: MemorialProject; side: 'left' | 'right' }) {
  const style = VASE_STYLES.find((item) => item.id === project.vase.styleId)
  if (!style || !('sourceComponentId' in style)) return null

  const x = (side === 'left' ? -1 : 1) * Math.max(0.38, project.plot.widthM * 0.22)
  const z = -project.plot.depthM * 0.18
  const h = style.heightM
  const diameter = 'diameterM' in style ? style.diameterM : Math.min(0.18, h * 0.36)
  const radius = diameter / 2

  if (style.kind === 'sphere') {
    const baseDepth = 'baseDepthM' in style ? style.baseDepthM : diameter
    const sphereRadius = diameter * 0.42
    const baseHeight = Math.max(0.035, h - sphereRadius * 2)
    return (
      <group position={[x, 0.13, z]} data-source-component={style.sourceComponentId}>
        <StoneCylinder radius={Math.max(0.035, baseDepth / 2)} height={baseHeight} position={[0, baseHeight / 2, 0]} />
        <mesh position={[0, baseHeight + sphereRadius, 0]} castShadow receiveShadow>
          <sphereGeometry args={[sphereRadius, 32, 20]} />
          <PolishedBlackStone />
        </mesh>
      </group>
    )
  }

  if (style.kind === 'lampada') {
    const bodyRadius = radius * 0.82
    const baseH = h * 0.16
    const capH = h * 0.18
    const pillarH = h - baseH - capH
    return (
      <group position={[x, 0.13, z]} data-source-component={style.sourceComponentId}>
        <StoneCylinder radius={radius} height={baseH} position={[0, baseH / 2, 0]} />
        {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => (
          <StoneBox
            key={`lampada-${sx}-${sz}`}
            size={[radius * 0.22, pillarH, radius * 0.22]}
            position={[sx * bodyRadius * 0.58, baseH + pillarH / 2, sz * bodyRadius * 0.58]}
          />
        )))}
        <mesh position={[0, baseH + pillarH * 0.48, 0]}>
          <cylinderGeometry args={[bodyRadius * 0.28, bodyRadius * 0.28, pillarH * 0.5, 24]} />
          <meshStandardMaterial color="#b97838" emissive="#8b3f13" emissiveIntensity={0.7} />
        </mesh>
        <mesh position={[0, h - capH * 0.42, 0]} castShadow receiveShadow>
          <sphereGeometry args={[radius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <PolishedBlackStone />
        </mesh>
      </group>
    )
  }

  const points = style.kind === 'baluster'
    ? [
        new THREE.Vector2(radius * 0.68, 0),
        new THREE.Vector2(radius, h * 0.05),
        new THREE.Vector2(radius * 0.9, h * 0.12),
        new THREE.Vector2(radius * 0.6, h * 0.3),
        new THREE.Vector2(radius * 0.48, h * 0.52),
        new THREE.Vector2(radius * 0.66, h * 0.72),
        new THREE.Vector2(radius * 0.9, h * 0.9),
        new THREE.Vector2(radius * 0.72, h),
      ]
    : [
        new THREE.Vector2(radius * 0.62, 0),
        new THREE.Vector2(radius * 0.82, h * 0.04),
        new THREE.Vector2(radius * 0.82, h * 0.1),
        new THREE.Vector2(radius * 0.66, h * 0.16),
        new THREE.Vector2(radius * 0.48, h * 0.45),
        new THREE.Vector2(radius * 0.68, h * 0.74),
        new THREE.Vector2(radius, h * 0.88),
        new THREE.Vector2(radius * 0.98, h * 0.96),
        new THREE.Vector2(radius * 0.72, h),
      ]

  return (
    <mesh position={[x, 0.13, z]} castShadow receiveShadow data-source-component={style.sourceComponentId}>
      <latheGeometry args={[points, 32]} />
      <PolishedBlackStone />
    </mesh>
  )
}

function FenceFinial({ x, z, postHeight }: { x: number; z: number; postHeight: number }) {
  const baseH = 0.04
  const sphereRadius = 0.045
  return (
    <group>
      <StoneBox size={[0.11, baseH, 0.11]} position={[x, postHeight + baseH / 2, z]} />
      <mesh position={[x, postHeight + baseH + sphereRadius, z]} castShadow receiveShadow>
        <sphereGeometry args={[sphereRadius, 28, 18]} />
        <PolishedBlackStone />
      </mesh>
    </group>
  )
}

function WingGeometry({ variant }: { variant: 'f01' | 'f02' }) {
  const geometry = useMemo(() => {
    const width = 0.6
    const height = 0.4
    const depth = 0.07
    const shape = new THREE.Shape()
    shape.moveTo(-width / 2, 0)
    shape.lineTo(-width / 2, variant === 'f01' ? height * 0.72 : height * 0.68)

    if (variant === 'f01') {
      shape.bezierCurveTo(-width * 0.32, height * 0.78, -width * 0.14, height * 0.78, 0, height * 0.72)
      shape.bezierCurveTo(width * 0.14, height * 0.64, width * 0.28, height * 0.5, width / 2, height * 0.46)
    } else {
      shape.bezierCurveTo(-width * 0.34, height * 0.76, -width * 0.18, height * 0.75, 0, height * 0.68)
      shape.bezierCurveTo(width * 0.18, height * 0.6, width * 0.34, height * 0.48, width / 2, height * 0.44)
    }

    shape.lineTo(width / 2, 0)
    shape.closePath()

    const result = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: false,
      curveSegments: 16,
    })
    result.translate(0, 0, -depth / 2)
    result.computeVertexNormals()
    return result
  }, [variant])

  useEffect(() => () => geometry.dispose(), [geometry])

  return geometry
}

function SourceWing({
  variant,
  position,
  rotationY = 0,
}: {
  variant: 'f01' | 'f02'
  position: [number, number, number]
  rotationY?: number
}) {
  const geometry = WingGeometry({ variant })
  return (
    <mesh geometry={geometry} position={position} rotation={[0, rotationY, 0]} castShadow receiveShadow>
      <PolishedBlackStone />
    </mesh>
  )
}

function SolidWingFence({ variant }: { variant: 'f01' | 'f02' }) {
  const moduleLength = 0.6
  const span = moduleLength * 2
  const postHeight = 0.45
  const postSize = 0.12
  const half = span / 2

  const posts: Array<[number, number]> = [
    [-half, -half], [0, -half], [half, -half],
    [-half, 0], [half, 0],
    [-half, half], [0, half], [half, half],
  ]

  return (
    <group>
      {posts.map(([x, z], index) => (
        <group key={`solid-post-${index}`}>
          <StoneBox size={[postSize, postHeight, postSize]} position={[x, postHeight / 2 + 0.08, z]} />
          <FenceFinial x={x} z={z} postHeight={postHeight + 0.08} />
        </group>
      ))}
      {[-0.3, 0.3].map((x, index) => (
        <SourceWing key={`back-${index}`} variant={variant} position={[x, 0.08, -half]} />
      ))}
      {[-0.3, 0.3].map((x, index) => (
        <SourceWing key={`front-${index}`} variant={variant} position={[x, 0.08, half]} rotationY={Math.PI} />
      ))}
      {[-0.3, 0.3].map((z, index) => (
        <SourceWing key={`left-${index}`} variant={variant} position={[-half, 0.08, z]} rotationY={Math.PI / 2} />
      ))}
      {[-0.3, 0.3].map((z, index) => (
        <SourceWing key={`right-${index}`} variant={variant} position={[half, 0.08, z]} rotationY={-Math.PI / 2} />
      ))}
    </group>
  )
}

function OpenBalustradeFence() {
  const moduleLength = 0.9
  const span = moduleLength * 2
  const half = span / 2
  const postHeight = 0.45
  const postSize = 0.12
  const parapetHeight = 0.12
  const beamHeight = 0.12
  const beamDepth = 0.03
  const balusterHeight = 0.3
  const balusterDiameter = 0.1

  const posts: Array<[number, number]> = [
    [-half, -half], [0, -half], [half, -half],
    [-half, 0], [half, 0],
    [-half, half], [0, half], [half, half],
  ]

  const horizontalModules = [-moduleLength / 2, moduleLength / 2]
  const sideModules = [-moduleLength / 2, moduleLength / 2]

  return (
    <group>
      {posts.map(([x, z], index) => (
        <group key={`f03-post-${index}`}>
          <StoneBox size={[postSize, postHeight, postSize]} position={[x, postHeight / 2 + 0.08, z]} />
          <FenceFinial x={x} z={z} postHeight={postHeight + 0.08} />
        </group>
      ))}

      {[-half, half].flatMap((z) => horizontalModules.map((x) => (
        <group key={`f03-h-${z}-${x}`}>
          <StoneBox size={[moduleLength, parapetHeight, 0.12]} position={[x, 0.08 + parapetHeight / 2, z]} />
          <StoneBox size={[moduleLength, beamHeight, beamDepth]} position={[x, 0.08 + postHeight - beamHeight / 2, z]} />
          <TurnedSupport height={balusterHeight} diameter={balusterDiameter} position={[x, 0.08 + parapetHeight, z]} />
        </group>
      )))}

      {[-half, half].flatMap((x) => sideModules.map((z) => (
        <group key={`f03-v-${x}-${z}`}>
          <StoneBox size={[0.12, parapetHeight, moduleLength]} position={[x, 0.08 + parapetHeight / 2, z]} />
          <StoneBox size={[beamDepth, beamHeight, moduleLength]} position={[x, 0.08 + postHeight - beamHeight / 2, z]} />
          <TurnedSupport height={balusterHeight} diameter={balusterDiameter} position={[x, 0.08 + parapetHeight, z]} />
        </group>
      )))}
    </group>
  )
}

function MinimalStoneFence() {
  const railLength = 1.1
  const span = railLength * 2
  const half = span / 2
  const postHeight = 0.3
  const postSize = 0.12
  const railHeight = 0.12
  const railDepth = 0.07

  const posts: Array<[number, number]> = [
    [-half, -half], [0, -half], [half, -half],
    [-half, 0], [half, 0],
    [-half, half], [0, half], [half, half],
  ]

  return (
    <group>
      {posts.map(([x, z], index) => (
        <StoneBox
          key={`f04-post-${index}`}
          size={[postSize, postHeight, postSize]}
          position={[x, postHeight / 2 + 0.08, z]}
        />
      ))}
      {[-half, half].flatMap((z) => [-railLength / 2, railLength / 2].map((x) => (
        <StoneBox
          key={`f04-h-${z}-${x}`}
          size={[railLength, railHeight, railDepth]}
          position={[x, 0.08 + railHeight / 2, z]}
        />
      )))}
      {[-half, half].flatMap((x) => [-railLength / 2, railLength / 2].map((z) => (
        <StoneBox
          key={`f04-v-${x}-${z}`}
          size={[railDepth, railHeight, railLength]}
          position={[x, 0.08 + railHeight / 2, z]}
        />
      )))}
    </group>
  )
}

function SourceFence({ project }: { project: MemorialProject }) {
  if (!project.fence.enabled) return null
  const style = FENCE_STYLES.find((item) => item.id === project.fence.styleId)
  if (!style || style.kind === 'metal') return null

  return (
    <group data-source-component={style.sourceComponentId}>
      {style.kind === 'stone-f01' && <SolidWingFence variant="f01" />}
      {style.kind === 'stone-f02' && <SolidWingFence variant="f02" />}
      {style.kind === 'stone-f03' && <OpenBalustradeFence />}
      {style.kind === 'stone-f04' && <MinimalStoneFence />}
    </group>
  )
}

export function SourceCatalogEnvironmentComponents({ project }: { project: MemorialProject }) {
  const showLeftVase = project.vase.enabled && (project.vase.placement === 'left' || project.vase.placement === 'pair')
  const showRightVase = project.vase.enabled && (project.vase.placement === 'right' || project.vase.placement === 'pair')

  return (
    <group>
      <SourcePaving project={project} />
      <SourceGraveSlab project={project} />
      <SourceFurniture project={project} />
      {showLeftVase && <SourceVase project={project} side="left" />}
      {showRightVase && <SourceVase project={project} side="right" />}
      <SourceFence project={project} />
    </group>
  )
}
