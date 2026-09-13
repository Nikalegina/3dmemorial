import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialStele } from '../domain/memorialProject'

function usePortraitTexture(url: string | null, stele: MemorialStele) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const { mode, offsetX, offsetY, zoom } = stele.portrait

  useEffect(() => {
    if (!url) {
      setTexture((current) => {
        current?.dispose()
        return null
      })
      return
    }

    let cancelled = false
    const image = new Image()
    image.onload = () => {
      if (cancelled) return
      const canvas = document.createElement('canvas')
      const side = 1536
      canvas.width = side
      canvas.height = side
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const coverScale = Math.max(side / image.width, side / image.height)
      const scale = coverScale * zoom
      const width = image.width * scale
      const height = image.height * scale
      const x = (side - width) / 2 + offsetX * side * 0.24
      const y = (side - height) / 2 + offsetY * side * 0.24
      ctx.filter = mode === 'bw'
        ? 'grayscale(1) contrast(1.08)'
        : mode === 'engraving'
          ? 'grayscale(1) contrast(1.7) brightness(1.12)'
          : 'none'
      ctx.drawImage(image, x, y, width, height)

      const next = new THREE.CanvasTexture(canvas)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = 8
      next.needsUpdate = true
      setTexture((current) => {
        current?.dispose()
        return next
      })
    }
    image.src = url

    return () => {
      cancelled = true
    }
  }, [mode, offsetX, offsetY, stele.id, url, zoom])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function PortraitPlane({
  url,
  stele,
  z,
}: {
  url: string | null
  stele: MemorialStele
  z: number
}) {
  const texture = usePortraitTexture(url, stele)
  if (!texture) return null

  const portraitWidth = stele.monument.widthM * 0.5
  const portraitHeight = Math.min(stele.monument.heightM * 0.42, portraitWidth * 1.18)

  return (
    <mesh position={[0, stele.monument.heightM * 0.62, z]}>
      <planeGeometry args={[portraitWidth, portraitHeight]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}
