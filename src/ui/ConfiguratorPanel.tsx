import { useEffect, useState, type ChangeEvent } from 'react'
import { MATERIALS, MONUMENT_SHAPES, PORTRAIT_MODES } from '../domain/catalog'
import { BENCH_STYLES, BORDER_STYLES, FENCE_STYLES, PAVING_STYLES, TABLE_STYLES, VASE_STYLES } from '../domain/componentCatalog'
import { validateProjectCompatibility } from '../domain/compatibility'
import { INSCRIPTION_SYMBOLS, INSCRIPTION_TYPOGRAPHY } from '../domain/inscriptionCatalog'
import {
  createDefaultStele,
  getVisibleSteles,
  normalizeProject,
  withLayout,
  type InscriptionAlign,
  type InscriptionSymbolId,
  type InscriptionSymbolPlacement,
  type InscriptionTypographyId,
  type MemorialProject,
  type MemorialStele,
  type MonumentMaterial,
  type MonumentShape,
  type PortraitMode,
  type SurfaceMaterialId,
} from '../domain/memorialProject'
import { PROJECT_PRESETS } from '../domain/presets'
import type { RenderFormat } from '../export/projectExports'
import type { CameraPreset } from '../scene/CameraControls'

interface Props {
  project: MemorialProject
  onChange: (next: MemorialProject) => void
  onPortraitFile: (steleId: string, file: File | null) => void
  portraitErrors: Record<string, string | null>
  cameraPreset: CameraPreset
  onCameraPreset: (preset: CameraPreset) => void
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onSave: () => void
  onReset: () => void
  onExportJson: () => void
  onExportRender: (format: RenderFormat) => void
  onExportPdf: () => void
  onImportProject: (file: File | null) => void
  exportStatus: string | null
  importStatus: string | null
  onShare: () => void
  shareStatus: string | null
  shareOmitsPortrait: boolean
}

export function ConfiguratorPanel({
  project,
  onChange,
  onPortraitFile,
  portraitErrors,
  cameraPreset,
  onCameraPreset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSave,
  onReset,
  onExportJson,
  onExportRender,
  onExportPdf,
  onImportProject,
  exportStatus,
  importStatus,
  onShare,
  shareStatus,
  shareOmitsPortrait,
}: Props) {
  const [activeSteleIndex, setActiveSteleIndex] = useState(0)
  const visibleSteles = getVisibleSteles(project)
  const safeIndex = Math.min(activeSteleIndex, Math.max(0, visibleSteles.length - 1))
  const activeStele = visibleSteles[safeIndex] ?? project.steles[0]
  const diagnostics = validateProjectCompatibility(project)

  useEffect(() => {
    if (activeSteleIndex !== safeIndex) setActiveSteleIndex(safeIndex)
  }, [activeSteleIndex, safeIndex])

  const updateStele = (steleId: string, updater: (stele: MemorialStele) => MemorialStele) => {
    onChange(normalizeProject({
      ...project,
      steles: project.steles.map((stele) => stele.id === steleId ? updater(stele) : stele),
    }))
  }

  const patchMonument = (patch: Partial<MemorialStele['monument']>) =>
    updateStele(activeStele.id, (stele) => ({
      ...stele,
      monument: { ...stele.monument, ...patch },
    }))

  const patchPortrait = (patch: Partial<MemorialStele['portrait']>) =>
    updateStele(activeStele.id, (stele) => ({
      ...stele,
      portrait: { ...stele.portrait, ...patch },
    }))

  const patchInscription = (patch: Partial<MemorialStele['inscription']>) =>
    updateStele(activeStele.id, (stele) => ({
      ...stele,
      inscription: { ...stele.inscription, ...patch },
    }))

  const setLayout = (type: 'single' | 'paired') => {
    onChange(withLayout(project, type))
    setActiveSteleIndex(0)
  }

  const toggle = (key: 'flowerBed' | 'plinth' | 'paving' | 'border' | 'fence' | 'bench' | 'table' | 'vase') =>
    onChange({ ...project, [key]: { ...project[key], enabled: !project[key].enabled } })

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

  const slider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    apply: (value: number) => void,
  ) => (
    <label className="slider-field">
      <span>{label}</span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(e) => apply(Number(e.target.value))} />
    </label>
  )

  const compatibleMaterials = MATERIALS.filter((item) =>
    activeStele.monument.material === 'glass' ? item.kind === 'glass' : item.kind === 'stone',
  )

  const setConstruction = (material: MonumentMaterial) => {
    const surfaceId: SurfaceMaterialId = material === 'glass' ? 'glass-clear' : 'gabbro-polished'
    patchMonument({ material, surfaceId })
  }

  const applyPreset = (create: () => MemorialProject) => {
    onChange(create())
    setActiveSteleIndex(0)
  }

  const addFamilySteleForImportedFamily = () => {
    if (project.steles.length >= 6) return
    const next = createDefaultStele(`stele-${project.steles.length + 1}`)
    onChange(normalizeProject({
      ...project,
      layout: { ...project.layout, type: 'family' },
      steles: [...project.steles, next],
    }))
    setActiveSteleIndex(project.steles.length)
  }

  return (
    <aside className="panel">
      <div className="brand">
        <strong>КРЫМ МОНУМЕНТ</strong>
        <span>Memorial 3D Studio / Gate 8</span>
      </div>

      <div className="history-toolbar" aria-label="История изменений">
        <button type="button" onClick={onUndo} disabled={!canUndo} title="Отменить — Ctrl/Cmd+Z">
          ← Отменить
        </button>
        <button type="button" onClick={onRedo} disabled={!canRedo} title="Повторить — Ctrl+Y или Ctrl/Cmd+Shift+Z">
          Повторить →
        </button>
      </div>
      <p className="autosave-note">Изменения автоматически сохраняются локально после редактирования.</p>

      <section>
        <h2>Тип композиции</h2>
        <div className="layout-grid">
          <button className={project.layout.type === 'single' ? 'toggle active' : 'toggle'} onClick={() => setLayout('single')}>Одиночный</button>
          <button className={project.layout.type === 'paired' ? 'toggle active' : 'toggle'} onClick={() => setLayout('paired')}>Парный</button>
        </div>
        {project.layout.type !== 'single' && numberField('Расстояние, м', project.layout.gapM, 0.04, 0.8, 0.02, (v) =>
          onChange(normalizeProject({ ...project, layout: { ...project.layout, gapM: v } }))
        )}
        {project.layout.type === 'family' && (
          <button className="secondary-action" onClick={addFamilySteleForImportedFamily} disabled={project.steles.length >= 6}>
            Добавить стелу
          </button>
        )}
      </section>

      <section>
        <h2>Готовые решения</h2>
        <div className="preset-grid">
          {PROJECT_PRESETS.map((preset) => (
            <button key={preset.id} className="preset" onClick={() => applyPreset(preset.create)} title={preset.description}>
              <strong>{preset.name}</strong>
              <span>{preset.description}</span>
            </button>
          ))}
        </div>
      </section>

      {visibleSteles.length > 1 && (
        <section>
          <h2>Кого редактируем</h2>
          <div className="stele-tabs">
            {visibleSteles.map((stele, index) => (
              <button
                key={stele.id}
                className={safeIndex === index ? 'toggle active' : 'toggle'}
                onClick={() => setActiveSteleIndex(index)}
              >
                {stele.inscription.name && stele.inscription.name !== 'ИМЯ ФАМИЛИЯ'
                  ? stele.inscription.name
                  : `Памятник ${index + 1}`}
              </button>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2>Камера</h2>
        <div className="camera-grid">
          {([
            ['perspective', 'Общий'],
            ['front', 'Спереди'],
            ['top', 'Сверху'],
            ['detail', 'Крупно'],
          ] as const).map(([id, label]) => (
            <button key={id} className={cameraPreset === id ? 'toggle active' : 'toggle'} onClick={() => onCameraPreset(id)}>{label}</button>
          ))}
        </div>
      </section>

      <section>
        <h2>Участок</h2>
        {numberField('Ширина, м', project.plot.widthM, 1.2, 6, 0.1, (v) => onChange({ ...project, plot: { ...project.plot, widthM: v } }))}
        {numberField('Глубина, м', project.plot.depthM, 1.2, 8, 0.1, (v) => onChange({ ...project, plot: { ...project.plot, depthM: v } }))}
      </section>

      <section>
        <h2>{visibleSteles.length > 1 ? `Памятник ${safeIndex + 1}` : 'Памятник'}</h2>
        <label className="field">
          <span>Форма</span>
          <select value={activeStele.monument.shape} onChange={(e) => patchMonument({ shape: e.target.value as MonumentShape })}>
            {MONUMENT_SHAPES.map((shape) => <option value={shape.id} key={shape.id}>{shape.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Исполнение</span>
          <select value={activeStele.monument.material} onChange={(e) => setConstruction(e.target.value as MonumentMaterial)}>
            <option value="gabbro">Гранит</option>
            <option value="glass">Стекло</option>
            <option value="hybrid">Гранит + стекло</option>
          </select>
        </label>
        <label className="field">
          <span>Поверхность</span>
          <select value={activeStele.monument.surfaceId} onChange={(e) => patchMonument({ surfaceId: e.target.value as SurfaceMaterialId })}>
            {compatibleMaterials.map((material) => <option value={material.id} key={material.id}>{material.name}</option>)}
          </select>
        </label>
        {numberField('Ширина, м', activeStele.monument.widthM, 0.3, 2.5, 0.05, (v) => patchMonument({ widthM: v }))}
        {numberField('Высота, м', activeStele.monument.heightM, 0.5, 3, 0.05, (v) => patchMonument({ heightM: v }))}
        {numberField('Толщина, м', activeStele.monument.depthM, 0.04, 0.4, 0.01, (v) => patchMonument({ depthM: v }))}
      </section>

      <section>
        <h2>Портрет</h2>
        <label className="field">
          <span>Режим</span>
          <select value={activeStele.portrait.mode} onChange={(e) => patchPortrait({ mode: e.target.value as PortraitMode })}>
            {PORTRAIT_MODES.map((mode) => <option value={mode.id} key={mode.id}>{mode.name}</option>)}
          </select>
        </label>
        <label className="upload">
          Загрузить фото
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e: ChangeEvent<HTMLInputElement>) => onPortraitFile(activeStele.id, e.target.files?.[0] ?? null)}
          />
        </label>
        {portraitErrors[activeStele.id] && <p className="field-error">{portraitErrors[activeStele.id]}</p>}
        {slider('Масштаб', activeStele.portrait.zoom, 1, 3, 0.05, (v) => patchPortrait({ zoom: v }))}
        {slider('По горизонтали', activeStele.portrait.offsetX, -1, 1, 0.02, (v) => patchPortrait({ offsetX: v }))}
        {slider('По вертикали', activeStele.portrait.offsetY, -1, 1, 0.02, (v) => patchPortrait({ offsetY: v }))}
      </section>

      <section>
        <h2>Надпись и символ</h2>
        <label className="text-field">
          <span>Имя</span>
          <input value={activeStele.inscription.name} maxLength={80} onChange={(e) => patchInscription({ name: e.target.value })} />
        </label>
        <label className="text-field">
          <span>Даты</span>
          <input value={activeStele.inscription.dates} maxLength={40} onChange={(e) => patchInscription({ dates: e.target.value })} />
        </label>
        <label className="text-field">
          <span>Эпитафия</span>
          <input value={activeStele.inscription.epitaph} maxLength={120} onChange={(e) => patchInscription({ epitaph: e.target.value })} />
        </label>

        <label className="field">
          <span>Стиль текста</span>
          <select
            value={activeStele.inscription.typographyId}
            onChange={(e) => patchInscription({ typographyId: e.target.value as InscriptionTypographyId })}
          >
            {INSCRIPTION_TYPOGRAPHY.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>

        <label className="field">
          <span>Выравнивание</span>
          <select
            value={activeStele.inscription.align}
            onChange={(e) => patchInscription({ align: e.target.value as InscriptionAlign })}
          >
            <option value="center">По центру</option>
            <option value="left">Слева</option>
            <option value="right">Справа</option>
          </select>
        </label>

        {slider('Масштаб текста', activeStele.inscription.textScale, 0.75, 1.35, 0.05, (v) => patchInscription({ textScale: v }))}

        <label className="field">
          <span>Символ</span>
          <select
            value={activeStele.inscription.symbolId}
            onChange={(e) => patchInscription({ symbolId: e.target.value as InscriptionSymbolId })}
          >
            {INSCRIPTION_SYMBOLS.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </label>

        {activeStele.inscription.symbolId !== 'none' && (
          <label className="field">
            <span>Положение символа</span>
            <select
              value={activeStele.inscription.symbolPlacement}
              onChange={(e) => patchInscription({ symbolPlacement: e.target.value as InscriptionSymbolPlacement })}
            >
              <option value="top">Над текстом</option>
              <option value="bottom">Под текстом</option>
            </select>
          </label>
        )}

        <p className="share-note">
          Шрифты и символы используются для предварительной визуализации. Производственный макет подтверждается отдельно.
        </p>
      </section>

      <section>
        <h2>Комплекс</h2>
        <div className="toggle-grid">
          {([
            ['plinth', 'Цоколь'],
            ['flowerBed', 'Цветник'],
            ['paving', 'Покрытие'],
            ['border', 'Бордюр'],
            ['fence', 'Ограда'],
            ['bench', 'Лавка'],
            ['table', 'Стол'],
            ['vase', 'Ваза'],
          ] as const).map(([key, label]) => (
            <button className={project[key].enabled ? 'toggle active' : 'toggle'} key={key} onClick={() => toggle(key)}>{label}</button>
          ))}
        </div>

        {project.flowerBed.enabled && (
          <label className="field">
            <span>Цветник</span>
            <select value={project.flowerBed.styleId} onChange={(e) => onChange({ ...project, flowerBed: { ...project.flowerBed, styleId: e.target.value as MemorialProject['flowerBed']['styleId'] } })}>
              <option value="open-granite">Открытый гранитный</option>
              <option value="closed-granite">Закрытый гранитный</option>
            </select>
          </label>
        )}
        {project.plinth.enabled && (
          <label className="field">
            <span>Цоколь</span>
            <select value={project.plinth.materialId} onChange={(e) => onChange({ ...project, plinth: { ...project.plinth, materialId: e.target.value as MemorialProject['plinth']['materialId'] } })}>
              <option value="gabbro">Чёрный габбро</option>
              <option value="grey-granite">Серый гранит</option>
            </select>
          </label>
        )}
        {project.paving.enabled && (
          <label className="field">
            <span>Покрытие</span>
            <select value={project.paving.styleId} onChange={(e) => onChange({ ...project, paving: { ...project.paving, styleId: e.target.value as MemorialProject['paving']['styleId'] } })}>
              {PAVING_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
        )}
        {project.border.enabled && (
          <label className="field">
            <span>Бордюр</span>
            <select value={project.border.styleId} onChange={(e) => onChange({ ...project, border: { ...project.border, styleId: e.target.value as MemorialProject['border']['styleId'] } })}>
              {BORDER_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
        )}
        {project.fence.enabled && <>
          <label className="field">
            <span>Ограда</span>
            <select value={project.fence.styleId} onChange={(e) => onChange({ ...project, fence: { ...project.fence, styleId: e.target.value as MemorialProject['fence']['styleId'] } })}>
              {FENCE_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Калитка</span>
            <select value={project.fence.gateSide} onChange={(e) => onChange({ ...project, fence: { ...project.fence, gateSide: e.target.value as MemorialProject['fence']['gateSide'] } })}>
              <option value="front">Спереди</option><option value="left">Слева</option><option value="right">Справа</option>
            </select>
          </label>
        </>}
        {project.bench.enabled && <>
          <label className="field">
            <span>Лавка</span>
            <select value={project.bench.styleId} onChange={(e) => onChange({ ...project, bench: { ...project.bench, styleId: e.target.value as MemorialProject['bench']['styleId'] } })}>
              {BENCH_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Сторона лавки</span>
            <select value={project.bench.side} onChange={(e) => onChange({ ...project, bench: { ...project.bench, side: e.target.value as MemorialProject['bench']['side'] } })}>
              <option value="left">Слева</option><option value="right">Справа</option>
            </select>
          </label>
        </>}
        {project.table.enabled && <>
          <label className="field">
            <span>Стол</span>
            <select value={project.table.styleId} onChange={(e) => onChange({ ...project, table: { ...project.table, styleId: e.target.value as MemorialProject['table']['styleId'] } })}>
              {TABLE_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Сторона стола</span>
            <select value={project.table.side} onChange={(e) => onChange({ ...project, table: { ...project.table, side: e.target.value as MemorialProject['table']['side'] } })}>
              <option value="left">Слева</option><option value="right">Справа</option>
            </select>
          </label>
        </>}
        {project.vase.enabled && <>
          <label className="field">
            <span>Ваза</span>
            <select value={project.vase.styleId} onChange={(e) => onChange({ ...project, vase: { ...project.vase, styleId: e.target.value as MemorialProject['vase']['styleId'] } })}>
              {VASE_STYLES.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Размещение ваз</span>
            <select value={project.vase.placement} onChange={(e) => onChange({ ...project, vase: { ...project.vase, placement: e.target.value as MemorialProject['vase']['placement'] } })}>
              <option value="left">Слева</option><option value="right">Справа</option><option value="pair">Пара</option>
            </select>
          </label>
        </>}
      </section>

      {diagnostics.length > 0 && (
        <section className="diagnostics">
          <h2>Проверка компоновки</h2>
          {diagnostics.map((item) => (
            <div key={item.code} className={`diagnostic ${item.severity}`}>
              <strong>{item.severity === 'error' ? 'Ошибка' : item.severity === 'warning' ? 'Проверьте' : 'Подсказка'}</strong>
              <span>{item.message}</span>
            </div>
          ))}
        </section>
      )}

      <section>
        <h2>Экспорт проекта</h2>
        <div className="export-grid">
          <button className="primary" onClick={() => onExportRender('png')}>HD PNG</button>
          <button onClick={() => onExportRender('jpeg')}>HD JPEG</button>
          <button onClick={onExportPdf}>PDF-спецификация</button>
        </div>
        {exportStatus && <p className="action-status">{exportStatus}</p>}
      </section>

      <div className="actions">
        <button onClick={onShare}>Поделиться интерактивным проектом</button>
        {shareStatus && <p className="share-status">{shareStatus}</p>}
        <p className="share-note">Ссылка доступна всем, у кого она есть. Данные проекта не шифруются.</p>
        {shareOmitsPortrait && <p className="share-note">Загруженные фотографии не включаются в ссылку и остаются только на этом устройстве.</p>}
        <button onClick={onSave}>Сохранить локально</button>
        <button onClick={onExportJson}>Скачать проект JSON</button>
        <label className="project-import">
          Импортировать проект JSON
          <input type="file" accept="application/json,.json" onChange={(e: ChangeEvent<HTMLInputElement>) => onImportProject(e.target.files?.[0] ?? null)} />
        </label>
        {importStatus && <p className="action-status">{importStatus}</p>}
        <button onClick={onReset}>Сбросить</button>
      </div>

      <p className="notice">Предварительная 3D‑визуализация. Финальный макет, размеры и стоимость подтверждаются специалистом.</p>
    </aside>
  )
}
