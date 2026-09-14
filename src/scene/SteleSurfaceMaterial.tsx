import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { MaterialDefinition } from '../domain/catalog'

function seedFrom(value: string): number {
  let seed = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    seed ^= value.charCodeAt(index)
    seed = Math.imul(seed, 16777619)
  }
  return seed >>> 0
}

function randomFactory(seedValue: number): () => number {
  let seed = seedValue || 1
  return () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return (seed >>> 0) / 0xffffffff
  }
}

function stonePalette(base: THREE.Color): string[] {
  const variants = [
    base.clone().multiplyScalar(0.72),
    base.clone().multiplyScalar(0.86),
    base.clone(),
    base.clone().lerp(new THREE.Color('#a7a49d'), 0.24),
    base.clone().lerp(new THREE.Color('#d0cdc5'), 0.12),
  ]
  return variants.map((color) => `#${color.getHexString()}`)
}

function createStoneTexture(definition: MaterialDefinition): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 384
  canvas.height = 384
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas 2D is unavailable.')

  const base = new THREE.Color(definition.color)
  const palette = stonePalette(base)
  const random = randomFactory(seedFrom(definition.id))

  context.fillStyle = palette[2]
  context.fillRect(0, 0, canvas.width, canvas.height)

  const speckleCount = definition.id.startsWith('gabbro-') ? 3200 : 5000
  for (let index = 0; index < speckleCount; index += 1) {
    const radius = 0.25 + random() * (definition.id.startsWith('gabbro-') ? 1.15 : 1.8)
    const x = random() * canvas.width
    const y = random() * canvas.height
    const paletteIndex = Math.min(palette.length - 1, Math.floor(random() * palette.length))

    context.globalAlpha = 0.12 + random() * 0.38
    context.fillStyle = palette[paletteIndex]
    context.beginPath()
    context.arc(x, y, radius, 0, Math.PI * 2)
    context.fill()
  }

  context.globalAlpha = 0.1
  for (let index = 0; index < 45; index += 1) {
    context.strokeStyle = palette[index % palette.length]
    context.lineWidth = 0.35 + random() * 0.5
    context.beginPath()
    const y = random() * canvas.height
    context.moveTo(0, y)
    context.bezierCurveTo(
      canvas.width * 0.3,
      y + (random() - 0.5) * 8,
      canvas.width * 0.7,
      y + (random() - 0.5) * 8,
      canvas.width,
      y + (random() - 0.5) * 8,
    )
    context.stroke()
  }

  context.globalAlpha = 1
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.8, 2.8)
  texture.anisotropy = 8
  texture.needsUpdate = true
  return texture
}

function StoneMaterial({ definition }: { definition: MaterialDefinition }) {
  const texture = useMemo(() => createStoneTexture(definition), [definition])

  useEffect(() => () => texture.dispose(), [texture])

  return (
    <meshPhysicalMaterial
      map={texture}
      color="#ffffff"
      roughness={definition.roughness}
      metalness={definition.metalness ?? 0.01}
      clearcoat={definition.clearcoat ?? 0.3}
      clearcoatRoughness={definition.clearcoatRoughness ?? 0.16}
      envMapIntensity={1.15}
    />
  )
}

export function SteleSurfaceMaterial({
  definition,
  physicalThickness,
}: {
  definition: MaterialDefinition
  physicalThickness?: number
}) {
  if (definition.kind === 'glass') {
    return (
      <meshPhysicalMaterial
        color={definition.color}
        roughness={definition.roughness}
        transmission={Math.min(1, definition.transmission ?? 0.95)}
        thickness={physicalThickness ?? definition.thickness ?? 0.08}
        ior={definition.ior ?? 1.45}
        transparent
        opacity={1}
        clearcoat={1}
        clearcoatRoughness={0.025}
        envMapIntensity={1.65}
        reflectivity={0.92}
        attenuationColor={definition.color}
        attenuationDistance={0.82}
        side={THREE.DoubleSide}
      />
    )
  }

  return <StoneMaterial definition={definition} />
}
