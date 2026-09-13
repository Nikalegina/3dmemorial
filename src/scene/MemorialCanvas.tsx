import { Canvas } from '@react-three/fiber'
import type { MemorialProject } from '../domain/memorialProject'
import { CameraControls } from './CameraControls'
import { MemorialEnvironment } from './MemorialEnvironment'
import { Monument } from './Monument'

export function MemorialCanvas({ project, portraitUrl }: { project: MemorialProject; portraitUrl: string | null }) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.75]}
      camera={{ position: [2.35, 1.65, 3.2], fov: 42, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#dad7cf')
        gl.toneMappingExposure = 1.05
      }}
    >
      <ambientLight intensity={0.95} />
      <directionalLight
        position={[3.5, 6, 4]}
        intensity={3.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.65} />
      <MemorialEnvironment project={project} />
      <Monument project={project} portraitUrl={portraitUrl} />
      <CameraControls />
    </Canvas>
  )
}
