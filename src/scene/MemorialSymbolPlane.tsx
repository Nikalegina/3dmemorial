import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialStele } from '../domain/memorialProject'

function drawSymbol(context: CanvasRenderingContext2D, stele: MemorialStele) {
  const symbol = stele.inscription.symbolId
  if (symbol === 'none') return

  const isGlass = stele.monument.material === 'glass'
  const ink = isGlass ? '#1b2223' : '#f0eee8'
  context.clearRect(0, 0, 512, 512)
  context.strokeStyle = ink
  context.fillStyle = ink
  context.lineCap = 'round'
  context.lineJoin = 'round'

  if (symbol === 'latin-cross') {
    context.lineWidth = 42
    context.beginPath()
    context.moveTo(256, 88)
    context.lineTo(256, 424)
    context.moveTo(142, 205)
    context.lineTo(370, 205)
    context.stroke()
    return
  }

  if (symbol === 'orthodox-cross') {
    context.lineWidth = 34
    context.beginPath()
    context.moveTo(256, 66)
    context.lineTo(256, 438)
    context.moveTo(195, 128)
    context.lineTo(317, 128)
    context.moveTo(136, 220)
    context.lineTo(376, 220)
    context.moveTo(175, 343)
    context.lineTo(337, 300)
    context.stroke()
    return
  }

  if (symbol !== 'crescent') return

  context.beginPath()
  context.arc(242, 248, 150, 0, Math.PI * 2)
  context.fill()
  context.globalCompositeOperation = 'destination-out'
  context.beginPath()
  context.arc(300, 208, 144, 0, Math.PI * 2)
  context.fill()
  context.globalCompositeOperation = 'source-over'
}

function useSymbolTexture(stele: MemorialStele) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)

  useEffect(() => {
    if (stele.inscription.symbolId === 'none') {
      setTexture((current) => {
        current?.dispose()
        return null
      })
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')
    if (!context) return

    drawSymbol(context, stele)

    const next = new THREE.CanvasTexture(canvas)
    next.colorSpace = THREE.SRGBColorSpace
    next.anisotropy = 4
    next.needsUpdate = true
    setTexture((current) => {
      current?.dispose()
      return next
    })
  }, [stele.inscription.symbolId, stele.monument.material, stele.id])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function MemorialSymbolPlane({ stele, z }: { stele: MemorialStele; z: number }) {
  const texture = useSymbolTexture(stele)
  if (!texture) return null

  const size = Math.min(stele.monument.widthM * 0.19, stele.monument.heightM * 0.12)

  return (
    <mesh position={[0, stele.monument.heightM * 0.91, z]} renderOrder={6}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}
