import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { PortraitMode } from '../domain/memorialProject'

function usePortraitTexture(url: string | null, mode: PortraitMode) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

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
      const side = 1024
      canvas.width = side
      canvas.height = side
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = Math.max(side / image.width, side / image.height)
      const width = image.width * scale
      const height = image.height * scale
      const x = (side - width) / 2
      const y = (side - height) / 2
      ctx.filter = mode === 'bw' ? 'grayscale(1) contrast(1.08)' : mode === 'engraving' ? 'grayscale(1) contrast(1.7) brightness(1.12)' : 'none'
      ctx.drawImage(image, x, y, width, height)

      const next = new THREE.CanvasTexture(canvas)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = 4
      setTexture((current) => {
        current?.dispose()
        return next
      })
    }
    image.src = url

    return () => {
      cancelled = true
    }
  }, [url, mode])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function PortraitPlane({
  url,
  mode,
  width,
  height,
  z,
}: {
  url: string | null
  mode: PortraitMode
  width: number
  height: number
  z: number
}) {
  const texture = usePortraitTexture(url, mode)
  if (!texture) return null

  const portraitWidth = width * 0.48
  const portraitHeight = Math.min(height * 0.42, portraitWidth * 1.18)

  return (
    <mesh position={[0, height * 0.58, z]}>
      <planeGeometry args={[portraitWidth, portraitHeight]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  )
}
