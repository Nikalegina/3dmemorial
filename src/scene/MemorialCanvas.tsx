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
        gl.setClearColor('#dad7cf')
        gl.toneMapping = ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
        onCanvasReady(gl.domElement)
      }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.72} />
      <directionalLight
        position={[3.5, 6, 4]}
        intensity={2.6}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
      />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.5} />
      <MemorialEnvironment project={project} />
      <Monument project={project} portraitUrls={portraitUrls} />
      <CameraControls project={project} preset={cameraPreset} />
    </Canvas>
  )
}
