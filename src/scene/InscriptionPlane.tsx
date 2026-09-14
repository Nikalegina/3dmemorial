import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { getInscriptionTypography } from '../domain/inscriptionCatalog'
import type { MemorialStele } from '../domain/memorialProject'
import { drawInscriptionSymbol } from './inscriptionArtwork'

function textAnchor(align: MemorialStele['inscription']['align'], width: number): number {
  if (align === 'left') return width * 0.15
  if (align === 'right') return width * 0.85
  return width / 2
}

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
    canvas.height = 900
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const typography = getInscriptionTypography(inscription.typographyId)
    const scale = inscription.textScale
    const anchorX = textAnchor(inscription.align, canvas.width)
    const textMaxWidth = inscription.align === 'center' ? 1320 : 1120

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = material === 'glass' ? '#171717' : '#f1f1ed'
    ctx.textAlign = inscription.align
    ctx.textBaseline = 'middle'

    if (inscription.symbolId !== 'none' && inscription.symbolPlacement === 'top') {
      drawInscriptionSymbol(ctx, inscription.symbolId, canvas.width / 2, 110, 150)
    }

    ctx.font = `${typography.nameWeight} ${Math.round(88 * scale)}px ${typography.fontFamily}`
    ctx.fillText(inscription.name || ' ', anchorX, 300, textMaxWidth)

    ctx.font = `${typography.datesWeight} ${Math.round(64 * scale)}px ${typography.fontFamily}`
    ctx.fillText(inscription.dates || ' ', anchorX, 440, textMaxWidth)

    if (inscription.epitaph.trim()) {
      ctx.font = `${typography.epitaphStyle} ${Math.round(42 * scale)}px ${typography.fontFamily}`
      ctx.globalAlpha = 0.9
      ctx.fillText(inscription.epitaph, anchorX, 585, textMaxWidth)
      ctx.globalAlpha = 1
    }

    if (inscription.symbolId !== 'none' && inscription.symbolPlacement === 'bottom') {
      drawInscriptionSymbol(ctx, inscription.symbolId, canvas.width / 2, 760, 140)
    }

    const next = new THREE.CanvasTexture(canvas)
    next.colorSpace = THREE.SRGBColorSpace
    next.anisotropy = 4
    next.needsUpdate = true
    setTexture((current) => {
      current?.dispose()
      return next
    })
  }, [
    inscription.align,
    inscription.dates,
    inscription.enabled,
    inscription.epitaph,
    inscription.name,
    inscription.symbolId,
    inscription.symbolPlacement,
    inscription.textScale,
    inscription.typographyId,
    material,
    stele.id,
  ])

  useEffect(() => () => texture?.dispose(), [texture])
  return texture
}

export function InscriptionPlane({ stele, z }: { stele: MemorialStele; z: number }) {
  const texture = useInscriptionTexture(stele)
  if (!texture) return null
  const { widthM, heightM } = stele.monument

  return (
    <mesh position={[0, heightM * 0.22, z]}>
      <planeGeometry args={[widthM * 0.8, heightM * 0.36]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  )
}
