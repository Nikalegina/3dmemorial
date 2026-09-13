import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { MemorialProject } from '../domain/memorialProject'

export type CameraPreset = 'perspective' | 'front' | 'top' | 'detail'

export function CameraControls({ project, preset }: { project: MemorialProject; preset: CameraPreset }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<ThreeOrbitControls | null>(null)

  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.2
    controls.maxDistance = 9
    controls.maxPolarAngle = Math.PI / 2.02
    controlsRef.current = controls

    return () => {
      controls.dispose()
      controlsRef.current = null
    }
  }, [camera, gl])

  useEffect(() => {
    const controls = controlsRef.current
    if (!controls) return
    const targetZ = -project.plot.depthM * 0.18
    const targetY = Math.max(0.55, project.monument.heightM * 0.42)
    controls.target.set(0, targetY, targetZ)

    if (preset === 'front') camera.position.set(0, 1.2, 3.35)
    else if (preset === 'top') camera.position.set(0.02, 5.4, targetZ + 0.02)
    else if (preset === 'detail') camera.position.set(1.05, 1.35, 1.65)
    else camera.position.set(2.35, 1.65, 3.2)

    controls.update()
  }, [camera, preset, project.monument.heightM, project.plot.depthM])

  useFrame(() => controlsRef.current?.update())
  return null
}
