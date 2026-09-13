import type { MemorialProject } from '../domain/memorialProject'

function Fence({ project }: { project: MemorialProject }) {
  if (!project.fence.enabled) return null
  const w = project.plot.widthM
  const d = project.plot.depthM
  const h = 0.48
  const post = (x: number, z: number) => (
    <mesh key={`${x}-${z}`} position={[x, h / 2, z]} castShadow>
      <boxGeometry args={[0.045, h, 0.045]} />
      <meshStandardMaterial color="#242424" metalness={0.75} roughness={0.28} />
    </mesh>
  )
  return (
    <group>
      {post(-w / 2, -d / 2)}{post(w / 2, -d / 2)}{post(-w / 2, d / 2)}{post(w / 2, d / 2)}
      <mesh position={[0, h * 0.62, -d / 2]}><boxGeometry args={[w, 0.035, 0.035]} /><meshStandardMaterial color="#242424" metalness={0.75} /></mesh>
      <mesh position={[-w / 2, h * 0.62, 0]}><boxGeometry args={[0.035, 0.035, d]} /><meshStandardMaterial color="#242424" metalness={0.75} /></mesh>
      <mesh position={[w / 2, h * 0.62, 0]}><boxGeometry args={[0.035, 0.035, d]} /><meshStandardMaterial color="#242424" metalness={0.75} /></mesh>
    </group>
  )
}

export function MemorialEnvironment({ project }: { project: MemorialProject }) {
  const w = project.plot.widthM
  const d = project.plot.depthM

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#b8b19e" roughness={0.96} />
      </mesh>

      {project.paving.enabled && (
        <mesh position={[0, 0.025, 0]} receiveShadow>
          <boxGeometry args={[w, 0.05, d]} />
          <meshStandardMaterial color="#868279" roughness={0.78} />
        </mesh>
      )}

      {project.plinth.enabled && (
        <mesh position={[0, 0.085, 0]} receiveShadow>
          <boxGeometry args={[w * 0.78, 0.12, d * 0.68]} />
          <meshStandardMaterial color="#252729" roughness={0.3} />
        </mesh>
      )}

      {project.flowerBed.enabled && (
        <group position={[0, 0.14, d * 0.18]}>
          <mesh position={[0, 0.06, -0.36]}><boxGeometry args={[0.72, 0.12, 0.08]} /><meshStandardMaterial color="#1d1f21" /></mesh>
          <mesh position={[-0.32, 0.06, 0]}><boxGeometry args={[0.08, 0.12, 0.78]} /><meshStandardMaterial color="#1d1f21" /></mesh>
          <mesh position={[0.32, 0.06, 0]}><boxGeometry args={[0.08, 0.12, 0.78]} /><meshStandardMaterial color="#1d1f21" /></mesh>
          <mesh position={[0, 0.015, 0]}><boxGeometry args={[0.56, 0.03, 0.62]} /><meshStandardMaterial color="#49392b" roughness={1} /></mesh>
        </group>
      )}

      {project.vase.enabled && (
        <mesh position={[0.5, 0.28, -d * 0.2]} castShadow>
          <cylinderGeometry args={[0.085, 0.065, 0.38, 24]} />
          <meshPhysicalMaterial color="#151719" roughness={0.2} clearcoat={0.35} />
        </mesh>
      )}

      {project.bench.enabled && (
        <group position={[w * 0.35, 0, d * 0.25]} rotation={[0, -0.2, 0]}>
          <mesh position={[0, 0.34, 0]} castShadow><boxGeometry args={[0.62, 0.08, 0.24]} /><meshStandardMaterial color="#5e4632" roughness={0.7} /></mesh>
          <mesh position={[-0.24, 0.16, 0]}><boxGeometry args={[0.05, 0.32, 0.05]} /><meshStandardMaterial color="#252525" metalness={0.6} /></mesh>
          <mesh position={[0.24, 0.16, 0]}><boxGeometry args={[0.05, 0.32, 0.05]} /><meshStandardMaterial color="#252525" metalness={0.6} /></mesh>
        </group>
      )}

      {project.table.enabled && (
        <group position={[-w * 0.32, 0, d * 0.27]}>
          <mesh position={[0, 0.46, 0]} castShadow><cylinderGeometry args={[0.25, 0.25, 0.05, 32]} /><meshStandardMaterial color="#202224" /></mesh>
          <mesh position={[0, 0.23, 0]}><cylinderGeometry args={[0.055, 0.07, 0.46, 20]} /><meshStandardMaterial color="#202224" /></mesh>
        </group>
      )}

      <Fence project={project} />
    </group>
  )
}
