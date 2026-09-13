import { useEffect, useMemo, useState } from 'react'
import { createDefaultProject, normalizeProject, serializeProject, type MemorialProject } from '../domain/memorialProject'
import { loadLocalProject, saveLocalProject } from '../domain/projectStorage'
import { MemorialCanvas } from '../scene/MemorialCanvas'
import { ConfiguratorPanel } from '../ui/ConfiguratorPanel'

export function App() {
  const [project, setProject] = useState<MemorialProject>(() => loadLocalProject() ?? createDefaultProject())
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null)
  const normalized = useMemo(() => normalizeProject(project), [project])

  useEffect(() => () => {
    if (portraitUrl) URL.revokeObjectURL(portraitUrl)
  }, [portraitUrl])

  const onPortraitFile = (file: File | null) => {
    setPortraitUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return file ? URL.createObjectURL(file) : null
    })
  }

  const exportJson = () => {
    const blob = new Blob([serializeProject(normalized)], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = href
    anchor.download = 'krym-monument-project.kmproject.json'
    anchor.click()
    URL.revokeObjectURL(href)
  }

  return (
    <main className="app-shell">
      <div className="viewport"><MemorialCanvas project={normalized} portraitUrl={portraitUrl} /></div>
      <ConfiguratorPanel
        project={normalized}
        onChange={setProject}
        onPortraitFile={onPortraitFile}
        onSave={() => saveLocalProject(normalized)}
        onReset={() => { setProject(createDefaultProject()); onPortraitFile(null) }}
        onExportJson={exportJson}
      />
    </main>
  )
}
