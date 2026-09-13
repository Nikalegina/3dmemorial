import { PDFDocument } from 'pdf-lib'
import type { MemorialProject } from '../domain/memorialProject.ts'
import { buildProjectSpecification } from '../domain/projectSpec.ts'

export type RenderFormat = 'png' | 'jpeg'

export function canvasToBlob(canvas: HTMLCanvasElement, format: RenderFormat): Promise<Blob> {
  const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png'
  const quality = format === 'jpeg' ? 0.94 : undefined

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Не удалось сформировать изображение.'))
    }, mime, quality)
  })
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (ctx.measureText(candidate).width <= maxWidth || !line) {
      line = candidate
    } else {
      lines.push(line)
      line = word
    }
  }

  if (line) lines.push(line)
  return lines
}

function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = wrapText(ctx, text, maxWidth)
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight))
  return y + lines.length * lineHeight
}

export async function buildProjectPdf(project: MemorialProject, renderCanvas: HTMLCanvasElement): Promise<Blob> {
  const spec = buildProjectSpecification(project)
  const sheet = document.createElement('canvas')
  sheet.width = 1240
  sheet.height = 1754

  const ctx = sheet.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D недоступен.')

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, sheet.width, sheet.height)
  ctx.fillStyle = '#181818'
  ctx.textBaseline = 'top'

  ctx.font = '700 44px Arial, sans-serif'
  ctx.fillText('КРЫМ МОНУМЕНТ', 72, 58)

  ctx.font = '400 24px Arial, sans-serif'
  ctx.fillStyle = '#66615a'
  ctx.fillText(`3D-проект: ${spec.projectId}`, 72, 116)

  const renderX = 72
  const renderY = 172
  const renderW = 1096
  const renderH = 570
  ctx.fillStyle = '#ece9e2'
  ctx.fillRect(renderX, renderY, renderW, renderH)

  const scale = Math.min(renderW / renderCanvas.width, renderH / renderCanvas.height)
  const drawW = renderCanvas.width * scale
  const drawH = renderCanvas.height * scale
  ctx.drawImage(
    renderCanvas,
    renderX + (renderW - drawW) / 2,
    renderY + (renderH - drawH) / 2,
    drawW,
    drawH,
  )

  let y = 794
  for (const section of spec.sections) {
    ctx.fillStyle = '#181818'
    ctx.font = '700 25px Arial, sans-serif'
    ctx.fillText(section.title, 72, y)
    y += 42

    ctx.font = '400 20px Arial, sans-serif'
    for (const row of section.rows) {
      ctx.fillStyle = '#6d675f'
      ctx.fillText(row.label, 72, y)
      ctx.fillStyle = '#181818'
      y = drawWrapped(ctx, row.value, 360, y, 790, 29) + 9
    }
    y += 16
  }

  ctx.fillStyle = '#77716a'
  ctx.font = '400 18px Arial, sans-serif'
  drawWrapped(ctx, spec.disclaimer, 72, Math.min(y + 8, 1660), 1096, 25)

  const pngData = sheet.toDataURL('image/png')
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595.28, 841.89])
  const embedded = await pdf.embedPng(pngData)
  page.drawImage(embedded, { x: 0, y: 0, width: 595.28, height: 841.89 })

  const bytes = await pdf.save()
  return new Blob([Uint8Array.from(bytes)], { type: 'application/pdf' })
}
