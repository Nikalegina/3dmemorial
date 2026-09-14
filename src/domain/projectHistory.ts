import { normalizeProject, serializeProject, type MemorialProject } from './memorialProject.ts'

export interface ProjectHistory {
  past: MemorialProject[]
  present: MemorialProject
  future: MemorialProject[]
  revision: number
  limit: number
}

function cloneProject(project: MemorialProject): MemorialProject {
  return normalizeProject(structuredClone(project))
}

function sameProject(a: MemorialProject, b: MemorialProject): boolean {
  return serializeProject(a) === serializeProject(b)
}

export function createProjectHistory(initial: MemorialProject, limit = 50): ProjectHistory {
  return {
    past: [],
    present: cloneProject(initial),
    future: [],
    revision: 0,
    limit: Math.max(1, Math.min(200, Math.trunc(limit))),
  }
}

export function commitProject(history: ProjectHistory, next: MemorialProject): ProjectHistory {
  const normalized = cloneProject(next)
  if (sameProject(history.present, normalized)) return history

  const past = [...history.past, cloneProject(history.present)]
  const boundedPast = past.slice(Math.max(0, past.length - history.limit))

  return {
    ...history,
    past: boundedPast,
    present: normalized,
    future: [],
    revision: history.revision + 1,
  }
}

export function undoProject(history: ProjectHistory): ProjectHistory {
  const previous = history.past.at(-1)
  if (!previous) return history

  return {
    ...history,
    past: history.past.slice(0, -1),
    present: cloneProject(previous),
    future: [cloneProject(history.present), ...history.future].slice(0, history.limit),
    revision: history.revision + 1,
  }
}

export function redoProject(history: ProjectHistory): ProjectHistory {
  const next = history.future[0]
  if (!next) return history

  const past = [...history.past, cloneProject(history.present)]
  return {
    ...history,
    past: past.slice(Math.max(0, past.length - history.limit)),
    present: cloneProject(next),
    future: history.future.slice(1),
    revision: history.revision + 1,
  }
}

export function resetProjectHistory(history: ProjectHistory, project: MemorialProject): ProjectHistory {
  return {
    past: [],
    present: cloneProject(project),
    future: [],
    revision: history.revision + 1,
    limit: history.limit,
  }
}

export function canUndoProject(history: ProjectHistory): boolean {
  return history.past.length > 0
}

export function canRedoProject(history: ProjectHistory): boolean {
  return history.future.length > 0
}
