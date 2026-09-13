import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export function StudioEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const previous = scene.environment
    const generator = new THREE.PMREMGenerator(gl)
    generator.compileEquirectangularShader()
    const room = new RoomEnvironment()
    const target = generator.fromScene(room, 0.04)
    scene.environment = target.texture

    return () => {
      scene.environment = previous
      target.dispose()
      room.dispose()
      generator.dispose()
    }
  }, [gl, scene])

  return null
}
