import type { InscriptionSymbolId } from '../domain/memorialProject'

export function drawInscriptionSymbol(
  ctx: CanvasRenderingContext2D,
  id: InscriptionSymbolId,
  x: number,
  y: number,
  size: number,
): void {
  if (id === 'none') return

  ctx.save()
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = Math.max(5, size * 0.07)
  ctx.strokeStyle = ctx.fillStyle

  if (id === 'latin-cross') {
    ctx.fillRect(x - size * 0.055, y - size * 0.42, size * 0.11, size * 0.84)
    ctx.fillRect(x - size * 0.25, y - size * 0.12, size * 0.5, size * 0.11)
  } else if (id === 'orthodox-cross') {
    ctx.fillRect(x - size * 0.05, y - size * 0.43, size * 0.1, size * 0.86)
    ctx.fillRect(x - size * 0.15, y - size * 0.28, size * 0.3, size * 0.075)
    ctx.fillRect(x - size * 0.27, y - size * 0.08, size * 0.54, size * 0.09)
    ctx.beginPath()
    ctx.moveTo(x - size * 0.2, y + size * 0.23)
    ctx.lineTo(x + size * 0.2, y + size * 0.12)
    ctx.stroke()
  } else if (id === 'crescent-star') {
    ctx.beginPath()
    ctx.arc(x - size * 0.05, y, size * 0.3, -Math.PI * 0.38, Math.PI * 0.38, false)
    ctx.stroke()

    const starX = x + size * 0.27
    const starY = y - size * 0.08
    const outer = size * 0.12
    const inner = outer * 0.45
    ctx.beginPath()
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? outer : inner
      const angle = -Math.PI / 2 + i * Math.PI / 5
      const px = starX + Math.cos(angle) * radius
      const py = starY + Math.sin(angle) * radius
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  } else if (id === 'rose') {
    const petal = size * 0.12
    const orbit = size * 0.16
    for (let i = 0; i < 6; i += 1) {
      const angle = i * Math.PI / 3
      ctx.beginPath()
      ctx.arc(x + Math.cos(angle) * orbit, y + Math.sin(angle) * orbit, petal, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(x, y, size * 0.09, 0, Math.PI * 2)
    ctx.fill()
  } else if (id === 'laurel') {
    ctx.beginPath()
    ctx.moveTo(x - size * 0.3, y + size * 0.26)
    ctx.quadraticCurveTo(x, y - size * 0.05, x + size * 0.3, y - size * 0.28)
    ctx.stroke()
    for (let i = 0; i < 5; i += 1) {
      const t = 0.15 + i * 0.17
      const px = x - size * 0.3 + size * 0.6 * t
      const py = y + size * 0.26 - size * 0.54 * t
      ctx.beginPath()
      ctx.ellipse(px - size * 0.055, py - size * 0.035, size * 0.09, size * 0.035, -0.55, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(px + size * 0.06, py + size * 0.025, size * 0.09, size * 0.035, 0.55, 0, Math.PI * 2)
      ctx.stroke()
    }
  }

  ctx.restore()
}
