import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialStele } from '../domain/memorialProject'

function useInscriptionTexture(stele: MemorialStele) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const inscription = stele.inscription
  const material = stele.monument.material

  useEffect(() => {
    if (!inscription.enabled) {
      setTexture((current) => {
        current?.dispose()
        return null
      })
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = 1536
    canvas.height = 820
    const context = canvas.getContext('2d')
    if (!context) return

    context.clearRect(0, 0, canvas.width, canvas.height)
    const isGlass = material === 'glass'
    context.fillStyle = isGlass ? '#151a1b' : '#f3f2ed'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.shadowColor = isGlass ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.45)'
    context.shadowBlur = 5

    context.font = '700 108px Georgia, serif'
    context.fillText(inscription.name || ' ', canvas.width / 2, 230, 1380)

    context.shadowBlur = 3
    context.font = '600 72px Georgia, serif'
    context.fillText(inscription.dates || ' ', canvas.width / 2, 405, 1260)

    if (inscription.epitaph.trim()) {
      context.font = 'italic 48px Georgia, serif'
      context.globalAlpha = 0.92
      context.fillText(inscription.epitaph, canvas.width / 2, 605, 1320)
    }

    const next = new THREE.CanvasTexture(canvas)
    next.colorSpace = THREE.SRGBColorSpace
    next.anisotropy = 8
    next.needsUpdate = true
    setTexture((current) => {
      current?.dispose()
      return next
    })
  }, [inscription.dates, inscription.enabled, inscription.epitaph, inscription.name, material, stele.id])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function InscriptionPlane({ stele, z }: { stele: MemorialStele; z: number }) {
  const texture = useInscriptionTexture(stele)
  if (!texture) return null
  const { widthM, heightM } = stele.monument

  return (
    <mesh position={[0, heightM * 0.245, z]} renderOrder={5}>
      <planeGeometry args={[widthM * 0.86, heightM * 0.34]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
        depthTest={stele.monument.material !== 'glass'}
      />
    </mesh>
  )
}
