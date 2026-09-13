import { useEffect, useMemo, useState } from 'react'
import { createDefaultProject, normalizeProject, serializeProject, type MemorialProject } from '../domain/memorialProject'
import { loadLocalProject, saveLocalProject } from '../domain/projectStorage'
import { createShareUrl, readSharedProject } from '../domain/shareProject'
import { MemorialCanvas } from '../scene/MemorialCanvas'
import type { CameraPreset } from '../scene/CameraControls'
import { ConfiguratorPanel } from '../ui/ConfiguratorPanel'

const PORTRAIT_MAX_BYTES = 12 * 1024 * 1024
const PORTRAIT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function App() {
  const [project, setProject] = useState<MemorialProject>(() => readSharedProject(window.location.href) ?? loadLocalProject() ?? createDefaultProject())
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null)
  const [portraitError, setPortraitError] = useState<string | null>(null)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('perspective')
  const [renderCanvas, setRenderCanvas] = useState<HTMLCanvasElement | null>(null)
  const [shareStatus, setShareStatus] = useState<string | null>(null)
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

  const exportJson = () => {
    downloadBlob(new Blob([serializeProject(normalized)], { type: 'application/json' }), 'krym-monument-project.kmproject.json')
  }

  const exportRender = () => {
    renderCanvas?.toBlob((blob) => {
      if (blob) downloadBlob(blob, 'krym-monument-render.png')
    }, 'image/png')
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
        onReset={() => { setProject(createDefaultProject()); onPortraitFile(null); setCameraPreset('perspective') }}
        onExportJson={exportJson}
        onExportRender={exportRender}
        onShare={shareProject}
        shareStatus={shareStatus}
        shareOmitsPortrait={Boolean(portraitUrl)}
      />
    </main>
  )
}
