import { Canvas } from '@react-three/fiber'
import { ACESFilmicToneMapping } from 'three'
import type { MemorialProject } from '../domain/memorialProject'
import { CameraControls, type CameraPreset } from './CameraControls'
import { MemorialEnvironment } from './MemorialEnvironment'
import { Monument } from './Monument'
import { StudioEnvironment } from './StudioEnvironment'

export function MemorialCanvas({
  project,
  portraitUrls,
  cameraPreset,
  highQualityRender,
  onCanvasReady,
}: {
  project: MemorialProject
  portraitUrls: Record<string, string>
  cameraPreset: CameraPreset
  highQualityRender: boolean
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}) {
  const dpr: number | [number, number] = highQualityRender ? 2.5 : [1, 1.75]
  const shadowSize = highQualityRender ? 4096 : 2048

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [2.35, 1.65, 3.2], fov: 42, near: 0.05, far: 60 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.setClearColor('#d7d4cc')
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.08
        onCanvasReady(gl.domElement)
      }}
    >
      <StudioEnvironment />
      <hemisphereLight args={['#f5f2ea', '#807b72', 0.62]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        color="#fff4df"
        position={[3.8, 6.2, 4.4]}
        intensity={3.05}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.00018}
      />
      <directionalLight color="#d9e7ef" position={[-4.2, 2.8, -2.6]} intensity={0.72} />
      <directionalLight color="#eef7ff" position={[0.8, 3.2, -5]} intensity={0.72} />
      <MemorialEnvironment project={project} />
      <Monument project={project} portraitUrls={portraitUrls} />
      <CameraControls project={project} preset={cameraPreset} />
    </Canvas>
  )
}
