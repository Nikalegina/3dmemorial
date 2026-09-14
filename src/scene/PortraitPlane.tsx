import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialStele, PortraitFrameId } from '../domain/memorialProject'

function framePath(context: CanvasRenderingContext2D, side: number, frame: PortraitFrameId) {
  const left = side * 0.1
  const top = side * 0.06
  const width = side * 0.8
  const height = side * 0.88

  context.beginPath()
  if (frame === 'oval') {
    context.ellipse(side / 2, side / 2, width / 2, height / 2, 0, 0, Math.PI * 2)
    return
  }

  if (frame === 'rounded-rect') {
    const radius = side * 0.08
    context.moveTo(left + radius, top)
    context.lineTo(left + width - radius, top)
    context.quadraticCurveTo(left + width, top, left + width, top + radius)
    context.lineTo(left + width, top + height - radius)
    context.quadraticCurveTo(left + width, top + height, left + width - radius, top + height)
    context.lineTo(left + radius, top + height)
    context.quadraticCurveTo(left, top + height, left, top + height - radius)
    context.lineTo(left, top + radius)
    context.quadraticCurveTo(left, top, left + radius, top)
    context.closePath()
    return
  }

  context.rect(left, top, width, height)
}

function drawFrameStroke(context: CanvasRenderingContext2D, side: number, stele: MemorialStele) {
  const isGlass = stele.monument.material === 'glass'
  framePath(context, side, stele.portrait.frame)
  context.strokeStyle = isGlass ? 'rgba(30,38,39,.72)' : 'rgba(236,235,230,.68)'
  context.lineWidth = side * 0.012
  context.stroke()
}

function drawPlaceholder(context: CanvasRenderingContext2D, side: number, stele: MemorialStele) {
  const isGlass = stele.monument.material === 'glass'
  const ink = isGlass ? '#23292a' : '#e6e6e2'
  context.clearRect(0, 0, side, side)

  context.save()
  framePath(context, side, stele.portrait.frame)
  context.clip()
  context.fillStyle = ink
  context.globalAlpha = isGlass ? 0.42 : 0.52

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
  context.fillText('ФОТО', side / 2, side * 0.86)
  context.restore()

  context.globalAlpha = 1
  drawFrameStroke(context, side, stele)
}

function usePortraitTexture(url: string | null, stele: MemorialStele) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const { mode, offsetX, offsetY, zoom, frame } = stele.portrait

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

      context.clearRect(0, 0, side, side)
      context.save()
      framePath(context, side, frame)
      context.clip()

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
      context.restore()

      drawFrameStroke(context, side, stele)
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

  const portraitWidth = stele.monument.widthM * 0.52
  const portraitHeight = Math.min(stele.monument.heightM * 0.45, portraitWidth * 1.2)

  return (
    <mesh position={[0, stele.monument.heightM * 0.63, z]} renderOrder={4}>
      <planeGeometry args={[portraitWidth, portraitHeight]} />
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
