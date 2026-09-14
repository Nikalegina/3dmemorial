import * as THREE from 'three'
import {
  BENCH_STYLES,
  BORDER_STYLES,
  FENCE_STYLES,
  FLOWER_BED_STYLES,
  PAVING_STYLES,
  TABLE_STYLES,
  VASE_STYLES,
} from '../domain/componentCatalog'
import { getCompositionWidth, type MemorialProject } from '../domain/memorialProject'
import { SourceCatalogEnvironmentComponents } from './SourceCatalogEnvironmentComponents'

function Fence({ project }: { project: MemorialProject }) {
  if (!project.fence.enabled) return null
  const w = project.plot.widthM
  const d = project.plot.depthM
  const style = FENCE_STYLES.find((item) => item.id === project.fence.styleId) ?? FENCE_STYLES[0]
  if (style.kind !== 'metal') return null
  const h = style.heightM
  const railY = h * 0.62
  const gateWidth = Math.min(0.72, w * 0.38)
  const post = (x: number, z: number, key: string) => (
    <mesh key={key} position={[x, h / 2, z]} castShadow>
      <boxGeometry args={[0.045, h, 0.045]} />
      <meshStandardMaterial color={style.color} metalness={0.75} roughness={0.28} />
    </mesh>
  )
  const horizontal = (x: number, z: number, length: number, key: string) => (
    <mesh key={key} position={[x, railY, z]}>
      <boxGeometry args={[length, 0.035, 0.035]} />
      <meshStandardMaterial color={style.color} metalness={0.75} roughness={0.3} />
    </mesh>
  )
  const vertical = (x: number, z: number, length: number, key: string) => (
    <mesh key={key} position={[x, railY, z]}>
      <boxGeometry args={[0.035, 0.035, length]} />
      <meshStandardMaterial color={style.color} metalness={0.75} roughness={0.3} />
    </mesh>
  )

  return (
    <group>
      {post(-w / 2, -d / 2, 'p1')}{post(w / 2, -d / 2, 'p2')}{post(-w / 2, d / 2, 'p3')}{post(w / 2, d / 2, 'p4')}
      {project.fence.gateSide === 'front' ? (
        <>
          {post(-gateWidth / 2, d / 2, 'gate-front-left')}
          {post(gateWidth / 2, d / 2, 'gate-front-right')}
          {horizontal(-(w + gateWidth) / 4, d / 2, (w - gateWidth) / 2, 'front-left')}
          {horizontal((w + gateWidth) / 4, d / 2, (w - gateWidth) / 2, 'front-right')}
        </>
      ) : horizontal(0, d / 2, w, 'front')}
      {horizontal(0, -d / 2, w, 'back')}
      {project.fence.gateSide === 'left' ? (
        <>
          {post(-w / 2, gateWidth / 2, 'gate-left-front')}
          {post(-w / 2, -gateWidth / 2, 'gate-left-back')}
          {vertical(-w / 2, -(d + gateWidth) / 4, (d - gateWidth) / 2, 'left-back')}
          {vertical(-w / 2, (d + gateWidth) / 4, (d - gateWidth) / 2, 'left-front')}
        </>
      ) : vertical(-w / 2, 0, d, 'left')}
      {project.fence.gateSide === 'right' ? (
        <>
          {post(w / 2, gateWidth / 2, 'gate-right-front')}
          {post(w / 2, -gateWidth / 2, 'gate-right-back')}
          {vertical(w / 2, -(d + gateWidth) / 4, (d - gateWidth) / 2, 'right-back')}
          {vertical(w / 2, (d + gateWidth) / 4, (d - gateWidth) / 2, 'right-front')}
        </>
      ) : vertical(w / 2, 0, d, 'right')}
    </group>
  )
}

function Border({ project }: { project: MemorialProject }) {
  if (!project.border.enabled) return null
  const w = project.plot.widthM
  const d = project.plot.depthM
  const style = BORDER_STYLES.find((item) => item.id === project.border.styleId) ?? BORDER_STYLES[0]
  const t = 0.08
  const h = 0.1
  return (
    <group position={[0, h / 2, 0]}>
      <mesh position={[0, 0, d / 2 - t / 2]}><boxGeometry args={[w, h, t]} /><meshStandardMaterial color={style.color} roughness={style.roughness} /></mesh>
      <mesh position={[0, 0, -d / 2 + t / 2]}><boxGeometry args={[w, h, t]} /><meshStandardMaterial color={style.color} roughness={style.roughness} /></mesh>
      <mesh position={[-w / 2 + t / 2, 0, 0]}><boxGeometry args={[t, h, d]} /><meshStandardMaterial color={style.color} roughness={style.roughness} /></mesh>
      <mesh position={[w / 2 - t / 2, 0, 0]}><boxGeometry args={[t, h, d]} /><meshStandardMaterial color={style.color} roughness={style.roughness} /></mesh>
    </group>
  )
}

function PavingSurface({ project }: { project: MemorialProject }) {
  if (!project.paving.enabled) return null
  const w = project.plot.widthM
  const d = project.plot.depthM
  const paving = PAVING_STYLES.find((item) => item.id === project.paving.styleId) ?? PAVING_STYLES[0]
  if ('sourceComponentId' in paving) return null
  const showJoints = paving.id !== 'gravel-light'
  const columns = paving.id === 'granite-dark' ? 2 : 4
  const rows = paving.id === 'granite-dark' ? 3 : 6
  const jointColor = paving.id === 'granite-dark' ? '#202224' : '#66645f'

  return (
    <group>
      <mesh position={[0, 0.025, 0]} receiveShadow>
        <boxGeometry args={[w, 0.05, d]} />
        <meshStandardMaterial color={paving.color} roughness={paving.roughness} />
      </mesh>

      {showJoints && Array.from({ length: columns - 1 }, (_, index) => {
        const x = -w / 2 + (w / columns) * (index + 1)
        return (
          <mesh key={`paving-x-${index}`} position={[x, 0.052, 0]}>
            <boxGeometry args={[0.012, 0.006, d * 0.99]} />
            <meshStandardMaterial color={jointColor} roughness={0.9} />
          </mesh>
        )
      })}

      {showJoints && Array.from({ length: rows - 1 }, (_, index) => {
        const z = -d / 2 + (d / rows) * (index + 1)
        return (
          <mesh key={`paving-z-${index}`} position={[0, 0.052, z]}>
            <boxGeometry args={[w * 0.99, 0.006, 0.012]} />
            <meshStandardMaterial color={jointColor} roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function Vase({ project, side }: { project: MemorialProject; side: 'left' | 'right' }) {
  const style = VASE_STYLES.find((item) => item.id === project.vase.styleId) ?? VASE_STYLES[0]
  if ('sourceComponentId' in style) return null
  const compositionWidth = getCompositionWidth(project)
  const x = (side === 'left' ? -1 : 1) * Math.max(0.34, compositionWidth * 0.58)
  const h = style.heightM
  const points = [
    new THREE.Vector2(0.052, 0),
    new THREE.Vector2(0.068, h * 0.08),
    new THREE.Vector2(0.075, h * 0.28),
    new THREE.Vector2(0.066, h * 0.52),
    new THREE.Vector2(0.083, h * 0.78),
    new THREE.Vector2(0.094, h * 0.93),
    new THREE.Vector2(0.082, h),
  ]

  return (
    <mesh position={[x, 0.11, -project.plot.depthM * 0.2]} castShadow>
      <latheGeometry args={[points, 32]} />
      <meshPhysicalMaterial
        color="#151719"
        roughness={0.17}
        clearcoat={0.52}
        clearcoatRoughness={0.1}
        envMapIntensity={1.1}
      />
    </mesh>
  )
}

export function MemorialEnvironment({ project }: { project: MemorialProject }) {
  const w = project.plot.widthM
  const d = project.plot.depthM
  const bench = BENCH_STYLES.find((item) => item.id === project.bench.styleId) ?? BENCH_STYLES[0]
  const table = TABLE_STYLES.find((item) => item.id === project.table.styleId) ?? TABLE_STYLES[0]
  const flowerBedStyle = FLOWER_BED_STYLES.find((item) => item.id === project.flowerBed.styleId) ?? FLOWER_BED_STYLES[0]
  const benchIsSource = 'sourceComponentId' in bench
  const tableIsSource = 'sourceComponentId' in table
  const benchSide = project.bench.side === 'left' ? -1 : 1
  const tableSide = project.table.side === 'left' ? -1 : 1
  const plinthColor = project.plinth.materialId === 'grey-granite' ? '#646566' : '#252729'
  const compositionWidth = getCompositionWidth(project)
  const flowerBedWidth = Math.min(w * 0.62, Math.max(0.72, compositionWidth * 0.9))
  const flowerSideX = flowerBedWidth / 2 - 0.04

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#b8b19e" roughness={0.96} />
      </mesh>

      <PavingSurface project={project} />
      <Border project={project} />

      {project.plinth.enabled && (
        <mesh position={[0, 0.085, 0]} receiveShadow>
          <boxGeometry args={[w * 0.78, 0.12, d * 0.68]} />
          <meshPhysicalMaterial
            color={plinthColor}
            roughness={0.26}
            clearcoat={project.plinth.materialId === 'gabbro' ? 0.28 : 0.14}
            clearcoatRoughness={0.15}
          />
        </mesh>
      )}

      {project.flowerBed.enabled && flowerBedStyle.kind !== 'grave-slab' && (
        <group position={[0, 0.14, d * 0.18]}>
          <mesh position={[0, 0.06, -0.36]}><boxGeometry args={[flowerBedWidth, 0.12, 0.08]} /><meshStandardMaterial color="#1d1f21" roughness={0.28} /></mesh>
          <mesh position={[-flowerSideX, 0.06, 0]}><boxGeometry args={[0.08, 0.12, 0.78]} /><meshStandardMaterial color="#1d1f21" roughness={0.28} /></mesh>
          <mesh position={[flowerSideX, 0.06, 0]}><boxGeometry args={[0.08, 0.12, 0.78]} /><meshStandardMaterial color="#1d1f21" roughness={0.28} /></mesh>
          {(project.flowerBed.styleId === 'closed-granite' || project.flowerBed.styleId === 'glass-panel-granite-frame') && (
            <mesh position={[0, 0.06, 0.36]}>
              <boxGeometry args={[flowerBedWidth, 0.12, 0.08]} />
              <meshPhysicalMaterial color="#151719" roughness={0.18} clearcoat={0.5} clearcoatRoughness={0.1} />
            </mesh>
          )}
          {project.flowerBed.styleId === 'glass-panel-granite-frame' ? (
            <mesh position={[0, 0.035, 0]} receiveShadow>
              <boxGeometry args={[Math.max(0.46, flowerBedWidth - 0.16), 0.035, 0.62]} />
              <meshPhysicalMaterial
                color="#20262a"
                roughness={0.07}
                metalness={0.01}
                transmission={0.08}
                thickness={0.012}
                ior={1.45}
                clearcoat={0.9}
                clearcoatRoughness={0.035}
                envMapIntensity={1.35}
              />
            </mesh>
          ) : (
            <mesh position={[0, 0.015, 0]}>
              <boxGeometry args={[Math.max(0.46, flowerBedWidth - 0.16), 0.03, 0.62]} />
              <meshStandardMaterial color="#49392b" roughness={1} />
            </mesh>
          )}
        </group>
      )}

      {project.vase.enabled && (project.vase.placement === 'left' || project.vase.placement === 'pair') && <Vase project={project} side="left" />}
      {project.vase.enabled && (project.vase.placement === 'right' || project.vase.placement === 'pair') && <Vase project={project} side="right" />}

      {project.bench.enabled && !benchIsSource && (
        <group position={[benchSide * w * 0.34, 0, d * 0.25]} rotation={[0, benchSide * -0.18, 0]}>
          <mesh position={[0, 0.34, 0]} castShadow><boxGeometry args={[0.62, 0.08, 0.24]} /><meshStandardMaterial color={bench.seatColor} roughness={bench.id === 'granite-bench' ? 0.3 : 0.7} /></mesh>
          <mesh position={[-0.24, 0.16, 0]}><boxGeometry args={[0.05, 0.32, 0.05]} /><meshStandardMaterial color="#252525" metalness={bench.id === 'granite-bench' ? 0.05 : 0.6} /></mesh>
          <mesh position={[0.24, 0.16, 0]}><boxGeometry args={[0.05, 0.32, 0.05]} /><meshStandardMaterial color="#252525" metalness={bench.id === 'granite-bench' ? 0.05 : 0.6} /></mesh>
        </group>
      )}

      {project.table.enabled && !tableIsSource && (
        <group position={[tableSide * w * 0.32, 0, d * 0.27]}>
          {table.shape === 'round' ? (
            <mesh position={[0, 0.46, 0]} castShadow><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshStandardMaterial color="#202224" /></mesh>
          ) : (
            <mesh position={[0, 0.46, 0]} castShadow><boxGeometry args={[0.46, 0.05, 0.46]} /><meshStandardMaterial color="#202224" /></mesh>
          )}
          <mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.055, 0.07, 0.46, 20]} /><meshStandardMaterial color="#202224" /></mesh>
        </group>
      )}

      <SourceCatalogEnvironmentComponents project={project} />
      <Fence project={project} />
    </group>
  )
}
