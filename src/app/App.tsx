import { useEffect, useMemo, useState } from 'react'
import {
  createDefaultProject,
  normalizeProject,
  parseProject,
  serializeProject,
  type MemorialProject,
} from '../domain/memorialProject'
import { loadLocalProject, saveLocalProject } from '../domain/projectStorage'
import { createShareUrl, readSharedProject } from '../domain/shareProject'
import { buildProjectPdf, canvasToBlob, type RenderFormat } from '../export/projectExports'
import { MemorialCanvas } from '../scene/MemorialCanvas'
import type { CameraPreset } from '../scene/CameraControls'
import { ConfiguratorPanel } from '../ui/ConfiguratorPanel'

const PORTRAIT_MAX_BYTES = 12 * 1024 * 1024
const PORTRAIT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const PROJECT_MAX_BYTES = 1024 * 1024

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

export function App() {
  const [project, setProject] = useState<MemorialProject>(() => readSharedProject(window.location.href) ?? loadLocalProject() ?? createDefaultProject())
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null)
  const [portraitError, setPortraitError] = useState<string | null>(null)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective')
  const [renderCanvas, setRenderCanvas] = useState<HTMLCanvasElement | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [highQualityRender, setHighQualityRender] = useState(false)
  const normalized = useMemo(() => normalizeProject(project), [project])

  useEffect(() => () => {
    if (portraitUrl) URL.revokeObjectURL(portraitUrl)
  }, [portraitUrl])

  const onPortraitFile = (file: File | null) => {
    if (!file) {
      setPortraitError(null)
      setPortraitUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return null
      })
      return
    }

    if (!PORTRAIT_TYPES.has(file.type)) {
      setPortraitError('Поддерживаются JPG, PNG и WebP.')
      return
    }
    if (file.size > PORTRAIT_MAX_BYTES) {
      setPortraitError('Файл слишком большой. Максимальный размер — 12 МБ.')
      return
    }

    setPortraitError(null)
    setPortraitUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(href)
  }

  const filenameBase = () =>
    (normalized.projectId || 'krym-monument-project')
      .toLowerCase()
      .replace(/[^a-z0-9а-яё_-]+/gi, '-')
      .replace(/^-+|-+$/g, '') || 'krym-monument-project'

  const withHighQualityCanvas = async (work: (canvas: HTMLCanvasElement) => Promise<void>) => {
    if (!renderCanvas) {
      setExportStatus('3D-сцена ещё не готова к экспорту.')
      return
    }

    setExportStatus('Подготавливаю HD-рендер…')
    setHighQualityRender(true)
    try {
      await nextFrame()
      await nextFrame()
      await work(renderCanvas)
    } catch (error) {
      setExportStatus(error instanceof Error ? error.message : 'Не удалось выполнить экспорт.')
    } finally {
      setHighQualityRender(false)
    }
  }

  const exportJson = () => {
    downloadBlob(new Blob([serializeProject(normalized)], { type: 'application/json' }), `${filenameBase()}.kmproject.json`)
    setExportStatus('Файл проекта JSON скачан.')
  }

  const exportRender = (format: RenderFormat) => {
    void withHighQualityCanvas(async (canvas) => {
      const blob = await canvasToBlob(canvas, format)
      downloadBlob(blob, `${filenameBase()}.${format === 'jpeg' ? 'jpg' : 'png'}`)
      setExportStatus(`HD-${format === 'jpeg' ? 'JPEG' : 'PNG'} скачан.`)
    })
  }

  const exportPdf = () => {
    void withHighQualityCanvas(async (canvas) => {
      const blob = await buildProjectPdf(normalized, canvas)
      downloadBlob(blob, `${filenameBase()}-spec.pdf`)
      setExportStatus('PDF-спецификация скачана.')
    })
  }

  const importProject = async (file: File | null) => {
    if (!file) return
    if (file.size > PROJECT_MAX_BYTES) {
      setImportStatus('Файл проекта слишком большой.')
      return
    }

    try {
      const parsed = parseProject(await file.text())
      setProject(parsed)
      onPortraitFile(null)
      setCameraPreset('perspective')
      setShareStatus(null)
      setImportStatus('Проект импортирован. Фото не входит в JSON и при необходимости загружается отдельно.')
    } catch {
      setImportStatus('Не удалось импортировать проект: файл повреждён или имеет неподдерживаемую схему.')
    }
  }

  const shareProject = async () => {
    const url = createShareUrl(normalized, window.location.href)
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      setShareStatus(portraitUrl ? 'Ссылка скопирована. Фото не передаётся — только конфигурация.' : 'Ссылка на интерактивный проект скопирована.')
    } catch {
      window.prompt('Скопируйте ссылку на проект', url)
      setShareStatus(portraitUrl ? 'Фото остаётся только на этом устройстве.' : 'Ссылка сформирована.')
    }
  }

  return (
    <main className="app-shell">
      <div className="viewport">
        <MemorialCanvas
          project={normalized}
          portraitUrl={portraitUrl}
          cameraPreset={cameraPreset}
          highQualityRender={highQualityRender}
          onCanvasReady={setRenderCanvas}
        />
      </div>
      <ConfiguratorPanel
        project={normalized}
        onChange={setProject}
        onPortraitFile={onPortraitFile}
        portraitError={portraitError}
        cameraPreset={cameraPreset}
        onCameraPreset={setCameraPreset}
        onSave={() => saveLocalProject(normalized)}
        onReset={() => {
          setProject(createDefaultProject())
          onPortraitFile(null)
          setCameraPreset('perspective')
          setExportStatus(null)
          setImportStatus(null)
        }}
        onExportJson={exportJson}
        onExportRender={exportRender}
        onExportPdf={exportPdf}
        onImportProject={importProject}
        exportStatus={exportStatus}
        importStatus={importStatus}
        onShare={shareProject}
        shareStatus={shareStatus}
        shareOmitsPortrait={Boolean(portraitUrl)}
      />
    </main>
  )
}
