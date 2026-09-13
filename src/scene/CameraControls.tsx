import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { getCompositionWidth, getVisibleSteles, type MemorialProject } from '../domain/memorialProject'

export type CameraPreset = 'perspective' | 'front' | 'top' | 'detail'

export function CameraControls({ project, preset }: { project: MemorialProject; preset: CameraPreset }) {
  const { camera, gl } = useThree()
  const controlsRef = useRef<ThreeOrbitControls | null>(null)

  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.minDistance = 1.2
    controls.maxDistance = 12
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
    const visibleSteles = getVisibleSteles(project)
    const maxHeight = Math.max(...visibleSteles.map((stele) => stele.monument.heightM), 1)
    const compositionWidth = getCompositionWidth(project)
    const targetZ = -project.plot.depthM * 0.18
    const targetY = Math.max(0.55, maxHeight * 0.42)
    const widthFactor = Math.max(0, compositionWidth - 0.7)
    controls.target.set(0, targetY, targetZ)

    if (preset === 'front') camera.position.set(0, 1.2, 3.35 + widthFactor * 1.15)
    else if (preset === 'top') camera.position.set(0.02, 5.4 + widthFactor * 0.7, targetZ + 0.02)
    else if (preset === 'detail') camera.position.set(1.05 + widthFactor * 0.35, 1.35, 1.65 + widthFactor * 0.55)
    else camera.position.set(2.35 + widthFactor * 0.55, 1.65, 3.2 + widthFactor * 0.55)

    controls.update()
  }, [camera, preset, project])

  useFrame(() => controlsRef.current?.update())
  return null
}
