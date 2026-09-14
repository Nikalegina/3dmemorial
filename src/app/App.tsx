import { useEffect, useMemo, useRef, useState } from 'react'
import { resolveStartupProject } from '../domain/catalogEntry'
import {
  createDefaultProject,
  normalizeProject,
  parseProject,
  serializeProject,
  type MemorialProject,
} from '../domain/memorialProject'
import {
  canRedoProject,
  canUndoProject,
  commitProject,
  createProjectHistory,
  redoProject,
  resetProjectHistory,
  undoProject,
} from '../domain/projectHistory'
import { loadLocalProject, saveLocalProject } from '../domain/projectStorage'
import { createShareUrl } from '../domain/shareProject'
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

function isEditingText(target: EventTarget | null): boolean {
  return target instanceof HTMLElement
    && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
}

export function App() {
  const [startup] = useState(() => resolveStartupProject(window.location.href, loadLocalProject()))
  const [history, setHistory] = useState(() => createProjectHistory(startup.project))
  const project = history.present
  const [portraitUrls, setPortraitUrls] = useState<Record<string, string>>({})
  const [portraitErrors, setPortraitErrors] = useState<Record<string, string | null>>({})
  const portraitUrlsRef = useRef<Record<string, string>>({})
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective')
  const [renderCanvas, setRenderCanvas] = useState<HTMLCanvasElement | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
  const [exportStatus, setExportStatus] = useState<string | null>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)
  const [highQualityRender, setHighQualityRender] = useState(false)
  const normalized = useMemo(() => normalizeProject(project), [project])

  const applyProject = (next: MemorialProject) => {
    setHistory((current) => commitProject(current, next))
  }

  const undo = () => setHistory((current) => undoProject(current))
  const redo = () => setHistory((current) => redoProject(current))

  useEffect(() => {
    portraitUrlsRef.current = portraitUrls
  }, [portraitUrls])

  useEffect(() => () => {
    for (const url of Object.values(portraitUrlsRef.current)) URL.revokeObjectURL(url)
  }, [])

  useEffect(() => {
    if (history.revision === 0) return
    const timeoutId = window.setTimeout(() => saveLocalProject(normalized), 700)
    return () => window.clearTimeout(timeoutId)
  }, [history.revision, normalized])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || isEditingText(event.target)) return
      const key = event.key.toLowerCase()

      if (key === 'z' && event.shiftKey) {
        event.preventDefault()
        setHistory((current) => redoProject(current))
      } else if (key === 'z') {
        event.preventDefault()
        setHistory((current) => undoProject(current))
      } else if (key === 'y') {
        event.preventDefault()
        setHistory((current) => redoProject(current))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const clearPortraits = () => {
    setPortraitUrls((current) => {
      for (const url of Object.values(current)) URL.revokeObjectURL(url)
      return {}
    })
    setPortraitErrors({})
  }

  const onPortraitFile = (steleId: string, file: File | null) => {
    if (!file) {
      setPortraitErrors((current) => ({ ...current, [steleId]: null }))
      setPortraitUrls((current) => {
        if (current[steleId]) URL.revokeObjectURL(current[steleId])
        const next = { ...current }
        delete next[steleId]
        return next
      })
      return
    }

    if (!PORTRAIT_TYPES.has(file.type)) {
      setPortraitErrors((current) => ({ ...current, [steleId]: 'Поддерживаются JPG, PNG и WebP.' }))
      return
    }
    if (file.size > PORTRAIT_MAX_BYTES) {
      setPortraitErrors((current) => ({ ...current, [steleId]: 'Файл слишком большой. Максимальный размер — 12 МБ.' }))
      return
    }

    setPortraitErrors((current) => ({ ...current, [steleId]: null }))
    setPortraitUrls((current) => {
      if (current[steleId]) URL.revokeObjectURL(current[steleId])
      return { ...current, [steleId]: URL.createObjectURL(file) }
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
      setHistory((current) => resetProjectHistory(current, parsed))
      clearPortraits()
      setCameraPreset('perspective')
      setShareStatus(null)
      setImportStatus('Проект импортирован. Фото не входит в JSON и при необходимости загружается отдельно для каждого памятника.')
    } catch {
      setImportStatus('Не удалось импортировать проект: файл повреждён или имеет неподдерживаемую схему.')
    }
  }

  const shareProject = async () => {
    const url = createShareUrl(normalized, window.location.href)
    const hasPortrait = Object.keys(portraitUrls).length > 0
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      setShareStatus(hasPortrait ? 'Ссылка скопирована. Фото не передаются — только конфигурация.' : 'Ссылка на интерактивный проект скопирована.')
    } catch {
      window.prompt('Скопируйте ссылку на проект', url)
      setShareStatus(hasPortrait ? 'Фотографии остаются только на этом устройстве.' : 'Ссылка сформирована.')
    }
  }

  return (
    <main
      className="app-shell"
      data-startup-source={startup.source}
      data-preset-id={startup.context.presetId ?? undefined}
      data-source-sku={startup.context.sourceSku ?? undefined}
      data-history-revision={history.revision}
    >
      <div className="viewport">
        <MemorialCanvas
          project={normalized}
          portraitUrls={portraitUrls}
          cameraPreset={cameraPreset}
          highQualityRender={highQualityRender}
          onCanvasReady={setRenderCanvas}
        />
      </div>
      <ConfiguratorPanel
        project={normalized}
        onChange={applyProject}
        onPortraitFile={onPortraitFile}
        portraitErrors={portraitErrors}
        cameraPreset={cameraPreset}
        onCameraPreset={setCameraPreset}
        canUndo={canUndoProject(history)}
        canRedo={canRedoProject(history)}
        onUndo={undo}
        onRedo={redo}
        onSave={() => saveLocalProject(normalized)}
        onReset={() => {
          setHistory((current) => resetProjectHistory(current, createDefaultProject()))
          clearPortraits()
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
        shareOmitsPortrait={Object.keys(portraitUrls).length > 0}
      />
    </main>
  )
}
