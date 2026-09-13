import type { ChangeEvent } from 'react'
import { MONUMENT_SHAPES, PORTRAIT_MODES } from '../domain/catalog'
import { validateProjectCompatibility } from '../domain/compatibility'
import type { MemorialProject, MonumentMaterial, MonumentShape, PortraitMode } from '../domain/memorialProject'

interface Props {
  project: MemorialProject
  onChange: (next: MemorialProject) => void
  onPortraitFile: (file: File | null) => void
  onSave: () => void
  onReset: () => void
  onExportJson: () => void
}

export function ConfiguratorPanel({ project, onChange, onPortraitFile, onSave, onReset, onExportJson }: Props) {
  const diagnostics = validateProjectCompatibility(project)
  const patchMonument = (patch: Partial<MemorialProject['monument']>) =>
    onChange({ ...project, monument: { ...project.monument, ...patch } })

  const toggle = (key: 'flowerBed' | 'plinth' | 'paving' | 'fence' | 'bench' | 'table' | 'vase') =>
    onChange({ ...project, [key]: { enabled: !project[key].enabled } })

  const numberField = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    apply: (value: number) => void,
  ) => (
    <label className="field">
      <span>{label}</span>
      <input type="number" value={value} min={min} max={max} step={step} onChange={(e) => apply(Number(e.target.value))} />
    </label>
  )

  return (
    <aside className="panel">
      <div className="brand"><strong>КРЫМ МОНУМЕНТ</strong><span>Memorial 3D Studio / Gate 1</span></div>

      <section>
        <h2>Участок</h2>
        {numberField('Ширина, м', project.plot.widthM, 1.2, 6, 0.1, (v) => onChange({ ...project, plot: { ...project.plot, widthM: v } }))}
        {numberField('Глубина, м', project.plot.depthM, 1.2, 8, 0.1, (v) => onChange({ ...project, plot: { ...project.plot, depthM: v } }))}
      </section>

      <section>
        <h2>Памятник</h2>
        <label className="field"><span>Форма</span><select value={project.monument.shape} onChange={(e) => patchMonument({ shape: e.target.value as MonumentShape })}>{MONUMENT_SHAPES.map((shape) => <option value={shape.id} key={shape.id}>{shape.name}</option>)}</select></label>
        <label className="field"><span>Исполнение</span><select value={project.monument.material} onChange={(e) => patchMonument({ material: e.target.value as MonumentMaterial })}><option value="gabbro">Чёрный гранит</option><option value="glass">Стекло</option><option value="hybrid">Гранит + стекло</option></select></label>
        {numberField('Ширина, м', project.monument.widthM, 0.3, 2.5, 0.05, (v) => patchMonument({ widthM: v }))}
        {numberField('Высота, м', project.monument.heightM, 0.5, 3, 0.05, (v) => patchMonument({ heightM: v }))}
        {numberField('Толщина, м', project.monument.depthM, 0.04, 0.4, 0.01, (v) => patchMonument({ depthM: v }))}
      </section>

      <section>
        <h2>Портрет</h2>
        <label className="field"><span>Режим</span><select value={project.portrait.mode} onChange={(e) => onChange({ ...project, portrait: { ...project.portrait, mode: e.target.value as PortraitMode } })}>{PORTRAIT_MODES.map((mode) => <option value={mode.id} key={mode.id}>{mode.name}</option>)}</select></label>
        <label className="upload">Загрузить фото<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e: ChangeEvent<HTMLInputElement>) => onPortraitFile(e.target.files?.[0] ?? null)} /></label>
      </section>

      <section>
        <h2>Комплекс</h2>
        <div className="toggle-grid">
          {([
            ['plinth', 'Цоколь'], ['flowerBed', 'Цветник'], ['paving', 'Плитка'], ['fence', 'Ограда'], ['bench', 'Лавка'], ['table', 'Стол'], ['vase', 'Ваза'],
          ] as const).map(([key, label]) => <button className={project[key].enabled ? 'toggle active' : 'toggle'} key={key} onClick={() => toggle(key)}>{label}</button>)}
        </div>
      </section>

      {diagnostics.length > 0 && <section className="diagnostics"><h2>Проверка компоновки</h2>{diagnostics.map((item) => <div key={item.code} className={`diagnostic ${item.severity}`}><strong>{item.severity === 'error' ? 'Ошибка' : item.severity === 'warning' ? 'Проверьте' : 'Подсказка'}</strong><span>{item.message}</span></div>)}</section>}

      <div className="actions">
        <button className="primary" onClick={onSave}>Сохранить локально</button>
        <button onClick={onExportJson}>Скачать проект JSON</button>
        <button onClick={onReset}>Сбросить</button>
      </div>
      <p className="notice">Предварительная 3D‑визуализация. Финальный макет, размеры и стоимость подтверждаются специалистом.</p>
    </aside>
  )
}
