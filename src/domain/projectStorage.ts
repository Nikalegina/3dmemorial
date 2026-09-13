import type { MemorialProject } from './memorialProject'
import { parseProject, serializeProject } from './memorialProject'

const STORAGE_KEY = 'krym-monument-3d:project:v4'
const LEGACY_STORAGE_KEYS = [
  'krym-monument-3d:project:v3',
  'krym-monument-3d:project:v2',
  'krym-monument-3d:project:v1',
]

export function saveLocalProject(project: MemorialProject): void {
  localStorage.setItem(STORAGE_KEY, serializeProject(project))
}

export function loadLocalProject(): MemorialProject | null {
  const raw = localStorage.getItem(STORAGE_KEY)
    ?? LEGACY_STORAGE_KEYS.map((key) => localStorage.getItem(key)).find((value) => value !== null)
  if (!raw) return null
  try {
    return parseProject(raw)
  } catch {
    return null
  }
}
