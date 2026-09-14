import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialStele, PortraitFrame } from '../domain/memorialProject'

function applyFrameMask(context: CanvasRenderingContext2D, side: number, frame: PortraitFrame) {
  if (frame === 'full') return

  context.globalCompositeOperation = 'destination-in'
  context.fillStyle = '#ffffff'
  context.beginPath()

  if (frame === 'oval') {
    context.ellipse(side / 2, side / 2, side * 0.42, side * 0.48, 0, 0, Math.PI * 2)
  } else {
    const margin = side * 0.055
    const radius = side * 0.055
    context.roundRect(margin, margin, side - margin * 2, side - margin * 2, radius)
  }

  context.fill()
  context.globalCompositeOperation = 'source-over'
}

function drawPlaceholder(context: CanvasRenderingContext2D, side: number, stele: MemorialStele) {
  const isGlass = stele.monument.material === 'glass'
  const ink = isGlass ? '#23292a' : '#e6e6e2'
  context.clearRect(0, 0, side, side)
  context.strokeStyle = ink
  context.fillStyle = ink
  context.globalAlpha = isGlass ? 0.48 : 0.56
  context.lineWidth = side * 0.014

  if (stele.portrait.frame !== 'full') {
    context.beginPath()
    if (stele.portrait.frame === 'oval') {
      context.ellipse(side / 2, side * 0.48, side * 0.34, side * 0.43, 0, 0, Math.PI * 2)
    } else {
      context.roundRect(side * 0.16, side * 0.08, side * 0.68, side * 0.8, side * 0.06)
    }
    context.stroke()
  }

  context.beginPath()
  context.arc(side / 2, side * 0.39, side * 0.105, 0, Math.PI * 2)
  context.fill()

  context.beginPath()
  context.ellipse(side / 2, side * 0.66, side * 0.19, side * 0.12, 0, Math.PI, 0, true)
  context.fill()

  context.globalAlpha = 0.7
  context.font = `600 ${Math.round(side * 0.055)}px Arial, sans-serif`
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(
    stele.portrait.frame === 'full' ? 'КРУПНАЯ ФОТОПЕЧАТЬ' : 'ФОТО',
    side / 2,
    side * 0.86,
  )
  context.globalAlpha = 1

  applyFrameMask(context, side, stele.portrait.frame)
}

function usePortraitTexture(url: string | null, stele: MemorialStele) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const { mode, frame, offsetX, offsetY, zoom } = stele.portrait

  useEffect(() => {
    let cancelled = false
    const canvas = document.createElement('canvas')
    const side = 1536
    canvas.width = side
    canvas.height = side
    const context = canvas.getContext('2d')
    if (!context) return

    const publish = () => {
      if (cancelled) return
      const next = new THREE.CanvasTexture(canvas)
      next.colorSpace = THREE.SRGBColorSpace
      next.anisotropy = 8
      next.needsUpdate = true
      setTexture((current) => {
        current?.dispose()
        return next
      })
    }

    if (!url) {
      drawPlaceholder(context, side, stele)
      publish()
      return () => {
        cancelled = true
      }
    }

    const image = new Image()
    image.onload = () => {
      if (cancelled) return

      const coverScale = Math.max(side / image.width, side / image.height)
      const scale = coverScale * zoom
      const width = image.width * scale
      const height = image.height * scale
      const x = (side - width) / 2 + offsetX * side * 0.24
      const y = (side - height) / 2 + offsetY * side * 0.24
      context.filter = mode === 'bw'
        ? 'grayscale(1) contrast(1.08)'
        : mode === 'engraving'
          ? 'grayscale(1) contrast(1.7) brightness(1.12)'
          : 'none'
      context.drawImage(image, x, y, width, height)
      context.filter = 'none'
      applyFrameMask(context, side, frame)
      publish()
    }
    image.src = url

    return () => {
      cancelled = true
    }
  }, [frame, mode, offsetX, offsetY, stele, url, zoom])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

function portraitDimensions(stele: MemorialStele): { width: number; height: number; y: number } {
  const { frame, size } = stele.portrait
  const widthFactor = frame === 'full' ? 0.72 : frame === 'rectangle' ? 0.58 : 0.52
  const baseWidth = stele.monument.widthM * widthFactor
  const width = baseWidth * size

  if (frame === 'full') {
    return {
      width,
      height: Math.min(stele.monument.heightM * 0.48 * size, width * 1.28),
      y: stele.monument.heightM * 0.69,
    }
  }

  const ratio = frame === 'oval' ? 1.24 : 1.12
  return {
    width,
    height: Math.min(stele.monument.heightM * 0.46 * size, width * ratio),
    y: stele.monument.heightM * 0.63,
  }
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

  const dimensions = portraitDimensions(stele)

  return (
    <mesh position={[0, dimensions.y, z]} renderOrder={4}>
      <planeGeometry args={[dimensions.width, dimensions.height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={url ? 1 : 0.78}
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  )
}
