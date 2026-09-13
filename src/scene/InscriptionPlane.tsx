import { useEffect, useState } from 'react'
import * as THREE from 'three'
import type { MemorialProject } from '../domain/memorialProject'

function useInscriptionTexture(project: MemorialProject) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const inscription = project.inscription
  const material = project.monument.material

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
    canvas.height = 768
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = material === 'glass' ? '#171717' : '#f1f1ed'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.font = '600 88px Georgia, serif'
    ctx.fillText(inscription.name || ' ', canvas.width / 2, 230, 1360)
    ctx.font = '500 64px Georgia, serif'
    ctx.fillText(inscription.dates || ' ', canvas.width / 2, 370, 1250)

    if (inscription.epitaph.trim()) {
      ctx.font = 'italic 42px Georgia, serif'
      ctx.globalAlpha = 0.9
      ctx.fillText(inscription.epitaph, canvas.width / 2, 535, 1320)
    }

    const next = new THREE.CanvasTexture(canvas)
    next.colorSpace = THREE.SRGBColorSpace
    next.anisotropy = 4
    next.needsUpdate = true
    setTexture((current) => {
      current?.dispose()
      return next
    })
  }, [inscription.dates, inscription.enabled, inscription.epitaph, inscription.name, material])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function InscriptionPlane({ project, z }: { project: MemorialProject; z: number }) {
  const texture = useInscriptionTexture(project)
  if (!texture) return null
  const { widthM, heightM } = project.monument

  return (
    <mesh position={[0, heightM * 0.23, z]}>
      <planeGeometry args={[widthM * 0.78, heightM * 0.3]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}
