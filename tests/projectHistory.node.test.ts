import assert from 'node:assert/strict'
import test from 'node:test'
import {
  canRedoProject,
  canUndoProject,
  commitProject,
  createProjectHistory,
  redoProject,
  resetProjectHistory,
  undoProject,
} from '../src/domain/projectHistory.ts'
import { createDefaultProject, withLayout } from '../src/domain/memorialProject.ts'

test('history commits, undoes and redoes project configuration', () => {
  const initial = createDefaultProject()
  let history = createProjectHistory(initial)

  const changed = withLayout(initial, 'paired')
  changed.steles[1].inscription.name = 'ВТОРОЙ'
  history = commitProject(history, changed)

  assert.equal(canUndoProject(history), true)
  assert.equal(history.present.layout.type, 'paired')

  history = undoProject(history)
  assert.equal(history.present.layout.type, 'single')
  assert.equal(canRedoProject(history), true)

  history = redoProject(history)
  assert.equal(history.present.layout.type, 'paired')
  assert.equal(history.present.steles[1].inscription.name, 'ВТОРОЙ')
})

test('no-op commit does not create history revision', () => {
  const project = createDefaultProject()
  const history = createProjectHistory(project)
  const same = commitProject(history, structuredClone(project))
  assert.equal(same, history)
  assert.equal(same.revision, 0)
  assert.equal(same.past.length, 0)
})

test('new edit after undo clears redo branch', () => {
  const initial = createDefaultProject()
  let history = createProjectHistory(initial)

  const first = structuredClone(initial)
  first.steles[0].inscription.name = 'ПЕРВОЕ'
  history = commitProject(history, first)

  const second = structuredClone(first)
  second.steles[0].inscription.name = 'ВТОРОЕ'
  history = commitProject(history, second)
  history = undoProject(history)
  assert.equal(canRedoProject(history), true)

  const alternate = structuredClone(history.present)
  alternate.steles[0].inscription.name = 'АЛЬТЕРНАТИВА'
  history = commitProject(history, alternate)
  assert.equal(canRedoProject(history), false)
  assert.equal(history.present.steles[0].inscription.name, 'АЛЬТЕРНАТИВА')
})

test('history enforces bounded past capacity', () => {
  let history = createProjectHistory(createDefaultProject(), 2)
  for (let index = 0; index < 5; index += 1) {
    const next = structuredClone(history.present)
    next.steles[0].inscription.name = `ИМЯ-${index}`
    history = commitProject(history, next)
  }
  assert.equal(history.past.length, 2)
})

test('reset starts a clean undo branch and increments revision', () => {
  let history = createProjectHistory(createDefaultProject())
  const changed = structuredClone(history.present)
  changed.steles[0].monument.heightM = 1.8
  history = commitProject(history, changed)

  const imported = withLayout(createDefaultProject(), 'paired')
  history = resetProjectHistory(history, imported)

  assert.equal(history.past.length, 0)
  assert.equal(history.future.length, 0)
  assert.equal(history.present.layout.type, 'paired')
  assert.equal(history.revision, 2)
})
