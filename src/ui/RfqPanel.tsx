import { useMemo, useState } from 'react'
import {
  buildRfqRequest,
  formatRfqSummary,
  validateRfqDraft,
  type ContactChannel,
  type RfqDraft,
  type RfqStartupSource,
} from '../domain/rfq'
import type { MemorialProject } from '../domain/memorialProject'

const EMPTY_DRAFT: RfqDraft = {
  name: '',
  contact: '',
  channel: 'phone',
  comment: '',
}

function downloadText(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type })
  const href = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = href
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(href)
}

export function RfqPanel({
  project,
  shareUrl,
  sourceSku,
  presetId,
  startupSource,
  localPortraitCount,
}: {
  project: MemorialProject
  shareUrl: string
  sourceSku: string | null
  presetId: string | null
  startupSource: RfqStartupSource
  localPortraitCount: number
}) {
  const [draft, setDraft] = useState<RfqDraft>(EMPTY_DRAFT)
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const validation = useMemo(() => validateRfqDraft(draft), [draft])

  const build = () => buildRfqRequest({
    draft,
    project,
    shareUrl,
    generatedAt: new Date().toISOString(),
    sourceSku,
    presetId,
    startupSource,
    localPortraitCount,
  })

  const prepare = () => {
    setSubmitted(true)
    if (!validation.valid) {
      setStatus('Проверьте контакт для связи.')
      return
    }

    const request = build()
    downloadText(
      JSON.stringify(request, null, 2),
      `${project.projectId.toLowerCase().replace(/[^a-z0-9а-яё_-]+/gi, '-') || 'memorial'}-request.kmrequest.json`,
      'application/json',
    )
    setStatus('Пакет заявки сформирован и скачан. Онлайн-отправка будет подключена отдельным интеграционным gate.')
  }

  const copySummary = async () => {
    setSubmitted(true)
    if (!validation.valid) {
      setStatus('Проверьте контакт для связи.')
      return
    }

    const summary = formatRfqSummary(build())
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(summary)
      setStatus('Описание заявки скопировано.')
    } catch {
      window.prompt('Скопируйте описание заявки', summary)
      setStatus('Описание заявки сформировано.')
    }
  }

  return (
    <section className="rfq-panel" data-rfq-ready={validation.valid ? 'true' : 'false'}>
      <div className="rfq-heading">
        <div>
          <h2>Получить расчёт</h2>
          <p>Передайте специалисту точную конфигурацию 3D-проекта.</p>
        </div>
        <span>Без расчёта цены в браузере</span>
      </div>

      <label className="text-field">
        <span>Как к вам обращаться</span>
        <input
          value={draft.name}
          maxLength={80}
          autoComplete="name"
          placeholder="Имя — необязательно"
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </label>

      <label className="field">
        <span>Канал связи</span>
        <select
          value={draft.channel}
          onChange={(event) => setDraft({ ...draft, channel: event.target.value as ContactChannel })}
        >
          <option value="phone">Телефон</option>
          <option value="max">MAX</option>
          <option value="vk">VK</option>
          <option value="telegram">Telegram</option>
          <option value="other">Другой</option>
        </select>
      </label>

      <label className="text-field">
        <span>Контакт для связи</span>
        <input
          value={draft.contact}
          maxLength={160}
          autoComplete="tel"
          placeholder="Телефон, ник или ссылка"
          onChange={(event) => setDraft({ ...draft, contact: event.target.value })}
        />
      </label>
      {submitted && validation.errors.contact && <p className="field-error">{validation.errors.contact}</p>}

      <label className="text-field">
        <span>Комментарий</span>
        <textarea
          value={draft.comment}
          maxLength={600}
          rows={4}
          placeholder="Например: нужен монтаж под ключ или подбор решения под бюджет"
          onChange={(event) => setDraft({ ...draft, comment: event.target.value })}
        />
      </label>

      <div className="rfq-actions">
        <button className="primary" onClick={prepare}>Подготовить заявку для расчёта</button>
        <button onClick={copySummary}>Скопировать описание</button>
      </div>

      {status && <p className="action-status">{status}</p>}
      <p className="share-note">
        Контакты не сохраняются в проекте и не попадают в публичную ссылку. Загруженные фотографии также не включаются автоматически.
      </p>
    </section>
  )
}
